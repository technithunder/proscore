import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Zoom,
  CircularProgress,
  Tooltip,
  Grid,
  TextField,
  Button
} from '@mui/material';
import DataTable from 'src/components/Table/Table';
import useRefMounted from 'src/hooks/useRefMounted';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { addNewProjectSchedule, updateProjectSchedule, getProjectSchedule, deleteProjectSchedule, getAllProjectSchedules } from 'src/api/projects/ProjectSchedue';
import Text from 'src/components/Text';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const ProjectScheduling = (projectId) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoding] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const location = useLocation();
  const isMountedRef = useRefMounted();
  const [buttonText, setButtonText] = useState("Save")
  const [projectScheduleId, setProjectScheduleId] = useState("")
  const [projectEditScheduleId, setProjectEditScheduleId] = useState("")
  const [documentUrl, setDocumentUrl] = useState("")
  const [deliveryScheduleText, setDeliveryScheduleText] = useState("")
  const [documentFile, setDocumentFile] = useState(null)
  const [attachment, setAttachment] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isScheduleTextError, setScheduleTextError] = useState(false);
  const [isDocumentFileError, setDocumentFileError] = useState(false);
  const inputFile = useRef(null);

  const getProjectSchedules = useCallback( () => {
    setLoding(true);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
     getAllProjectSchedules(obj, projectId.projectId)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
          console.log(res.data)
          setTotalRecords(res.data.totalRecords);
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoding(false);
      });
  }, [isMountedRef, page, limit, query]);



  useEffect( () => {

    getProjectSchedules();
  }, [getAllProjectSchedules, page, limit, query, location.pathname]);

  const handleQueryChange =  (event) => {
    event.persist();
    setQuery(event.target.value);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
     getAllProjectSchedules(obj, projectId.projectId)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const handleConfirmDelete = (params) => {
    setProjectScheduleId([
      ...projectScheduleId,
      { projectScheduleId: params?.row?.projectScheduleId }
    ]);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted =  () => {

    setDeleteLoading(true);
    if (selectedIds.length > 0) {
       deleteProjectSchedule(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            setSelectedIds([]);
            enqueueSnackbar(t('Record has been deleted successfully'), {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },

              TransitionComponent: Zoom
            });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => setDeleteLoading(false));
    } else {
       deleteProjectSchedule(projectScheduleId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            enqueueSnackbar(t('Record has been deleted successfully'), {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },

              TransitionComponent: Zoom
            });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => setDeleteLoading(false));
    }
    getProjectSchedules()
  };

  const handleSelectionChange = (selection) => {
    const selectedProjectScheduleIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.projectScheduleId;
    });
    let tempArr = [];
    selectedProjectScheduleIds.forEach((e) => {
      tempArr.push({
        projectScheduleId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const isError = () => {
    let errors = [];

    if (deliveryScheduleText === "") {
      errors.push(0)
      setScheduleTextError(true)
    }else{
      setScheduleTextError(false)
    }

    if (documentFile === null) {
      errors.push(0)
      setDocumentFileError(true)
    }else{
      setDocumentFileError(false)
    }

    return errors;
  }

  const handleAddUpdateRow = async () => {
    setIsSubmitting(true);
    let error=isError();

    if(error.length === 0){
      const obj = {
        "projectId": projectId.projectId,
        "equipmentDeliverySchedule": deliveryScheduleText,
  
      }
      if (documentFile != null) {
        obj["documentMediaModel"] = {
          "base64String": documentUrl,
          "fileName": documentFile
        }
      }
  
      if (projectEditScheduleId === "") {
        await addNewProjectSchedule(obj)
          .then(async (res) => {
            if (res.data) {
              setIsSubmitting(false);
              getProjectSchedules()
              cancelAddUpdateRow()
            }
          })
          .catch((err) => {
            console.log(err)
          });
      } else {
        obj["projectScheduleId"] = projectEditScheduleId;
        await updateProjectSchedule(obj)
          .then(async (res) => {
            if (res.data) {
              setIsSubmitting(false);
              getProjectSchedules()
              cancelAddUpdateRow()
            }
          })
          .catch((err) => {
            console.log(err)
          });
      }
    }else{
      setIsSubmitting(false);
    }
    


  }
  const cancelAddUpdateRow = () => {
    setProjectEditScheduleId("")
    setDeliveryScheduleText("")
    setDocumentUrl("")
    setDocumentFile(null)
    setAttachment(null)
    setButtonText("Save")
    document.getElementsByName("attachmentFile")[0].value=""
  }

  const handleEditRow = async (event) => {
    setProjectEditScheduleId(event)
    setButtonText("Update")
    await getProjectSchedule(event)
      .then(async (res) => {
        setDeliveryScheduleText(res.data.data.equipmentDeliverySchedule)
        setDocumentUrl(res.data.data.documentMediaModel.base64String)
        setDocumentFile(res.data.data.documentMediaModel.fileName)
      })
      .catch((err) => {
        console.log(err)
      });

  }

  const handleDownload = (params) => {
    console.log(params.row.documentMediaModel.path)
    const file = params.row.documentMediaModel.path;
    const link = document.createElement('a');
    link.href = file;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };


  const columns = [
    {
      field: 'equipmentDeliverySchedule',
      headerName: t('Equipment Delivery Schedule'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <Box
          component={RouterLink}
          to=""
          onClick={() => handleEditRow(params.row.projectScheduleId)}
        >
          <Text color="darkblue">{params.row.equipmentDeliverySchedule}</Text>
        </Box>
      )
    },
    {
      field: 'projectClientContractId',
      headerName: 'Actions',
      flex: 1,
      disableColumnMenu: true,
      hideSortIcons: true,
      sortingOrder: false,
      renderHeader: (params) => (
        <Typography variant="h5">
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Tooltip title={t('Download')} arrow>
            <IconButton onClick={() => handleDownload(params)}>
              <CloudDownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Delete')} arrow>
            <IconButton
              onClick={() => handleConfirmDelete(params)}
              color="error"
            >
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="deliverySchedule"
            value={deliveryScheduleText}
            onChange={(e) => setDeliveryScheduleText(e.target.value)}
            variant="outlined"
            label={t('What is your Equipment Delivery Schedule?')}
            placeholder={t('What is your Equipment Delivery Schedule?')}
            error={isScheduleTextError}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            value={attachment}
            ref={inputFile}
            name="attachmentFile"
            fullWidth
            type="file"
            accept=".jpeg, .jpg, .png, .webp"
            error={isDocumentFileError}
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              setDocumentFile(file.name);

              const reader = new FileReader();
              reader.onloadend = () => {
                const dataUrl = reader.result;
                const cleanedDataUrl = dataUrl.split(',')[1];
                setDocumentUrl(cleanedDataUrl);
              };
              if (file) {
                reader.readAsDataURL(file);
              } else {
                setDocumentUrl('');
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size="1rem" /> : null
            }
            onClick={handleAddUpdateRow}>{buttonText}</Button>
        </Grid>
        <Grid item xs={12} md={1}>
          <Button variant="outlined" color="primary" onClick={cancelAddUpdateRow}>Cancel</Button>
        </Grid>

      </Grid>
      <DataTable
        data={users}
        columns={columns}
        page={page}
        limit={limit}
        query={query}
        loading={loading}
        onQueryChange={handleQueryChange}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        deleteLoading={deleteLoading}
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
        onRowSelectionModelChange={handleSelectionChange}
        handleDeleteSelected={() => setOpenConfirmDelete(true)}
        selectionModel={selectedIds}
        totalRecords={totalRecords}
      />
    </>
  );
};

export default ProjectScheduling;
