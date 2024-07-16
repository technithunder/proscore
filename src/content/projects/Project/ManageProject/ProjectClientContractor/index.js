import React, { useCallback, useEffect, useState } from 'react';
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
  Autocomplete,
  TextField,
  Button
} from '@mui/material';
import DataTable from 'src/components/Table/Table';
import useRefMounted from 'src/hooks/useRefMounted';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  addNewProjectClientContractor,
  updateProjectClientContractor,
  getProjectClientContractor,
  deleteProjectClientContractor,
  getAllProjectClientContractor,
  getAllClientContractorType,
  getAllClientList
} from 'src/api/projects/ProjectClientContractor';
import { getAllContact } from 'src/api/client/client/contact';
import Text from 'src/components/Text';

const ClientContractor = (projectId) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [projectClientContractId, setProjectClientContractId] = useState('');
  const [loading, setLoding] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const location = useLocation();
  const isMountedRef = useRefMounted();
  const [contractValue, setContractValue] = useState(null);
  const [clientValue, setClientValue] = useState(null);
  const [contractType, setContractType] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientContact, setClientContact] = useState([]);
  const [clientContactValue, setClientContactValue] = useState(null);
  const [buttonText, setButtonText] = useState('Save');
  const [projectContractId, setProjectContractId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClientError, setClientError] = useState(false);
  const [isClientContactError, setClientContactError] = useState(false);
  const [isContractTypeError, setContractTypeError] = useState(false);
  

  const getProjectClientContractors = useCallback( () => {
    setLoding(true);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
     getAllProjectClientContractor(obj, projectId.projectId)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
          console.log(res.data.data);
          setTotalRecords(res.data.totalRecords);
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoding(false);
      });
  }, [isMountedRef, page, limit, query]);

  const getClientContractorType =  () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
     getAllClientContractorType(obj)
      .then((res) => {
        if (res.data.data == null) {
          setContractType([]);
        } else {
          setContractType(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => { });
  };

  const getClientList = useCallback( () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
     getAllClientList(obj)
      .then((res) => {
        if (res.data.data == null) {
          setClients([]);
        } else {
          setClients(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => { });
  }, [isMountedRef]);

  useEffect( () => {
    getProjectClientContractors();
     getClientContractorType();
     getClientList();
  }, [getAllProjectClientContractor, page, limit, query, location.pathname]);

  const handleQueryChange =  (event) => {
    event.persist();
    setQuery(event.target.value);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
     getAllProjectClientContractor(obj, projectId.projectId)
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
    console.log(params);
    setProjectClientContractId([
      ...projectClientContractId,
      { projectClientContractId: params?.row?.projectClientContractId }
    ]);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted =  () => {
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
       deleteProjectClientContractor(selectedIds)
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
       deleteProjectClientContractor(projectClientContractId)
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
    getProjectClientContractors();
  };

  const handleSelectionChange = (selection) => {
    const selectedProjectClientContractIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.projectClientContractId;
    });
    let tempArr = [];
    selectedProjectClientContractIds.forEach((e) => {
      tempArr.push({
        projectClientContractId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const isError = () => {
    let errors = [];

    if (clientValue === null) {
      errors.push(0)
      setClientError(true)
    }else{
      setClientError(false)
    }
    if (clientContactValue === null) {
      errors.push(1)
      setClientContactError(true)
    }
    else{
      setClientContactError(false)
    }
    if (contractValue === null) {
      errors.push(2)
      setContractTypeError(true)
    }
    else{
      setContractTypeError(false)
    }

    return errors;
  }

  const handleAddUpdateRow =  () => {
    setIsSubmitting(true);
    let error=isError();
    console.log(error)
    if (error.length === 0) {
      console.log("called")
      const obj = {
        projectId: projectId.projectId,
        clientId: clientValue?.clientId,
        clientContactId: clientContactValue?.clientContactId,
        clientContractTypeId: contractValue?.clientContractTypeId
      };

      if (projectContractId === '') {
         addNewProjectClientContractor(obj)
          .then(async (res) => {
            if (res.data) {
              await getProjectClientContractors();
              setIsSubmitting(false);
              setClientValue(null);
              setContractValue(null);
              setClientContactValue(null);
              setProjectContractId('');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        obj['projectClientContractId'] = projectContractId;
         updateProjectClientContractor(obj)
          .then(async (res) => {
            if (res.data) {
              await getProjectClientContractors();
              setIsSubmitting(false);
              setClientValue(null);
              setContractValue(null);
              setClientContactValue(null);
              setProjectContractId('');
              setButtonText('Add New');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    else{
      setIsSubmitting(false);
    }

  };

  const handleEditRow =  (event) => {
    setButtonText('Update');
     getProjectClientContractor(event)
      .then(async (res) => {
        if (res.data) {
          setProjectContractId(res.data.data.projectClientContractId);
          const clientContractObj = contractType.filter(
            (x) => x.clientContractTypeId === res.data.data.clientContractTypeId
          );
          const clientObj = clients.filter(
            (x) => x.clientId === res.data.data.clientId
          );
          const clientContactObj = clientContact.filter(
            (x) => x.clientContactId === res.data.data.clientContactId
          );
          setClientValue(clientObj.length > 0 ? clientObj[0] : null);
          setContractValue(
            clientContractObj.length > 0 ? clientContractObj[0] : null
          );
          setClientContactValue(
            clientContactObj.length > 0 ? clientContactObj[0] : null
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cancelAddUpdateRow = () => {
    setClientValue(null);
    setContractValue(null);
    setClientContactValue(null);
    setProjectContractId('');
    setButtonText('Save');
  };

  const getClientContact =  (option) => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
     getAllContact(obj, option.clientId)
      .then((res) => {
        if (res.data.data == null) {
          setClientContact([]);
        } else {
          console.log(res.data.data);
          setClientContact(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => { });
  };

  const columns = [
    {
      field: 'companyName',
      headerName: t('Partner'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box
          component={RouterLink}
          to=""
          onClick={() => handleEditRow(params.row.projectClientContractId)}
        >
          <Text color="darkblue">{params.row.companyName}</Text>
        </Box>
      )
    },
    {
      field: 'clientContact',
      headerName: t('Partner Contact'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'clientContractType',
      headerName: t('Partner Type'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
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
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
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
        <Grid item xs={12} md={3}>
          <Autocomplete
            id="client"
            name="client"
            options={clients}
            getOptionLabel={(option) =>
              option.companyName
            }
            getOptionValue={(option) => option.clientId}
            value={clientValue}
            onChange={(event, newValue) => {
              setClientValue(newValue);
              getClientContact(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Partner"
                variant="outlined"
                fullWidth
                error={isClientError}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete
            id="clientContact"
            name="clientContact"
            options={clientContact}
            getOptionLabel={(option) =>
              option.firstName + ' ' + option.lastName
            }
            getOptionValue={(option) => option.clientContactId}
            value={clientContactValue}
            onChange={(event, newValue) => {
              setClientContactValue(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Partner Contact"
                variant="outlined"
                fullWidth
                error={isClientContactError}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete
            id="contractType"
            name="contractType"
            options={contractType}
            getOptionLabel={(option) => option.clientContractType}
            getOptionValue={(option) => option.clientContractTypeId}
            value={contractValue}
            onChange={(event, newValue) => {
              setContractValue(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Partner Type"
                variant="outlined"
                fullWidth
                error={isContractTypeError}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
            onClick={handleAddUpdateRow}
          >
            {buttonText}
          </Button>
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            variant="outlined"
            color="primary"
            onClick={cancelAddUpdateRow}
          >
            Cancel
          </Button>
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

export default ClientContractor;
