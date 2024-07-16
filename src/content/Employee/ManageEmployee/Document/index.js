import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRefMounted from 'src/hooks/useRefMounted';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  Zoom
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import EmployeeDocument from './Add';
import DataTable from 'src/components/Table/Table';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  deleteEmployeeDocument,
  getAllEmployeeDocument
} from 'src/api/employee/document';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Text from 'src/components/Text';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const EmployeeDocumentType = ({ employeeId }) => {
  console.log(employeeId);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = useLocation();
  const isMountedRef = useRefMounted();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoding] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const [addEmployeeDocumnetForm, setAddEmployeeDocumnetForm] = useState(false);
  const [employeeDocumentId, setEmployeeDocumentId] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [documentId, setDocumentId] = useState('');

  const fetchAllEmployeeDocument = useCallback(async () => {
    setLoding(true);
    let obj = {
      id: employeeId,
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllEmployeeDocument(obj)
      .then((res) => {
        if (res.data.data == null) {
          setLoding(false);
          setUsers([]);
        } else {
          setLoding(false);
          setTotalRecords(res.data.totalRecords);
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoding(false);
      });
  }, [isMountedRef, page, limit, query]);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (params) => {
    setEmployeeDocumentId([
      ...employeeDocumentId,
      { employeeDocumentId: params?.row?.employeeDocumentId }
    ]);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDownload = (params) => {
    const file = params.row.documentMediaModel?.path;
    const link = document.createElement('a');
    link.href = file;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const columns = [
    {
      field: 'documentName',
      headerName: `Document Name`,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box
          component={Link}
          onClick={() => handleEditForm(params.row.employeeDocumentId)}
          to=""
        >
          <Text color="darkblue"> {params.row.documentName}</Text>
        </Box>
      )
    },
    {
      field: 'employeeDocumentType',
      headerName: `Document Type`,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'employeeDocumentId',
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

  useEffect(() => {
    setLoding(true);
    fetchAllEmployeeDocument();
    if (state) {
      enqueueSnackbar(t('Record has been ' + state.action + ' successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },

        TransitionComponent: Zoom
      });
      navigate(location.pathname, { replace: true });
    }
  }, [getAllEmployeeDocument, addEmployeeDocumnetForm]);

  const handleAddForm = () => {
    fetchAllEmployeeDocument();
    setDocumentId('');
    setAddEmployeeDocumnetForm(false);
  };

  const handleEditForm = (employeeDocumentId) => {
    fetchAllEmployeeDocument();
    setAddEmployeeDocumnetForm(true);
    setDocumentId(employeeDocumentId);
    console.log('Edit document with ID:', employeeDocumentId);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleQueryChange = async (event) => {
    setLoding(true);
    event.persist();
    setQuery(event.target.value);
    let obj = {
      id: employeeId,
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
    await getAllEmployeeDocument(obj)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoding(false);
      });
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const handleDeleteCompleted = async () => {
    console.log('Delete length ' + selectedIds.length);
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteEmployeeDocument(selectedIds)
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
      await deleteEmployeeDocument(employeeDocumentId)
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
    fetchAllEmployeeDocument();
  };

  const handleSelectionChange = (selection) => {
    const selectedEmployeeIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.employeeDocumentId;
    });
    let tempArr = [];
    selectedEmployeeIds.forEach((e) => {
      tempArr.push({
        employeeDocumentId: e
      });
    });
    setSelectedIds(tempArr);
  };

  return (
    <>
      {addEmployeeDocumnetForm ? (
        <EmployeeDocument
          onClick={handleAddForm}
          onCancelContactForm={() => setAddEmployeeDocumnetForm(false)}
          employeeId={employeeId}
          documentId={documentId}
        />
      ) : (
        <Paper>
          <Box p={2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                textTransform="uppercase"
                variant="h4"
                fontWeight="700"
              >
                {t('Documents')}
              </Typography>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => {
                  setDocumentId('');
                  setAddEmployeeDocumnetForm(true);
                }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
              >
                Add Document
              </Button>
            </Stack>
          </Box>
          <Divider />
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
            totalRecords={totalRecords}
            openConfirmDelete={openConfirmDelete}
            handleDeleteCompleted={handleDeleteCompleted}
            onRowSelectionModelChange={handleSelectionChange}
            selectionModel={selectedIds}
            handleDeleteSelected={() => setOpenConfirmDelete(true)}
            closeConfirmDelete={closeConfirmDelete}
            exportFields={['documentName', 'employeeDocumentType']}
          />
        </Paper>
      )}
    </>
  );
};

export default EmployeeDocumentType;
