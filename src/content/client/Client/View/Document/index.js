import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  Zoom,
  Tooltip,
  IconButton,
  Divider
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DataTable from 'src/components/Table/Table';
import useRefMounted from 'src/hooks/useRefMounted';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  deleteDocument,
  getAllDocument,
  getAllDocumentType
} from 'src/api/client/client/document';
import { useTranslation } from 'react-i18next';
import AddDocument from './Add';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const Document = ({ clientId }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoding] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [clientDocumentId, setClientDocumentId] = useState('');
  const [addDocumentForm, setAddDocumentForm] = useState(false);
  const [documentType, setDocumentType] = useState([]);
  const location = useLocation();
  const isMountedRef = useRefMounted();

  const fetchAllDocuments = useCallback(async () => {
    setLoding(true);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllDocument(obj, clientId)
      .then((res) => {
        if (res.data.data == null) {
          setLoding(false);
          setUsers([]);
        } else {
          setTotalRecords(res?.data?.totalRecords);
          setUsers(res?.data?.data);
          setLoding(false);
        }
      })
      .catch((e) => console.log(e));
  }, [isMountedRef, page, limit, query]);

  useEffect(() => {
    fetchAllDocuments();
  }, [getAllDocument, page, limit, query, location.pathname]);

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteDocument(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllDocuments();
            setSelectedIds([]);
            enqueueSnackbar(t('Record Deleted Successfully'), {
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
      await deleteDocument(clientDocumentId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllDocuments();
            setSelectedIds([]);
            enqueueSnackbar(t('Record Deleted Successfully'), {
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
  };

  const handleSelectionChange = (selection) => {
    const selectedDocumentId = selection.map((selectedIndex) => {
      return users[selectedIndex]?.clientDocumentId;
    });
    let tempArr = [];
    selectedDocumentId.forEach((e) => {
      tempArr.push({
        clientDocumentId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const handleConfirmDelete = (params) => {
    setClientDocumentId([{ clientDocumentId: params?.row?.clientDocumentId }]);
    setOpenConfirmDelete(true);
  };

  const handleEditDocument = (params) => {
    setClientDocumentId({ clientDocumentId: params?.row?.clientDocumentId });
    setAddDocumentForm(true);
  };

  const handleAddForm = () => {
    fetchAllDocuments();
    setAddDocumentForm(false);
  };

  useEffect(() => {
    fetchAllDocumentType();
  }, []);

  const fetchAllDocumentType = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    let temp = [];
    await getAllDocumentType(obj)
      .then((res) => {
        if (res) {
          res?.data?.data?.forEach((e) => {
            temp.push({
              label: e.clientDocumentType,
              value: e.clientDocumentTypeId
            });
          });
          setDocumentType(temp);
        }
      })
      .catch((e) => console.log(e));
  };

  const handleDownload = (params) => {
    const file = params.row.documentMediaModel.path;
    const link = document.createElement('a');
    link.href = file;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const columns = [
    {
      field: 'clientDocumentType',
      headerName: t('Document Type'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Typography
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={() => handleEditDocument(params)}
        >
          {params.row.clientDocumentType}
        </Typography>
      )
    },
    {
      field: 'documentName',
      headerName: t('Document Name'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },

    {
      field: 'clientDocumentId',
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

  return (
    <>
      {addDocumentForm ? (
        <AddDocument
          clientDocumentId={clientDocumentId}
          id={clientId}
          onClick={handleAddForm}
          documentType={documentType}
          onCancelDocumentForm={() => setAddDocumentForm(false)}
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
                Documents
              </Typography>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => {
                  setClientDocumentId([]);
                  setAddDocumentForm(true);
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
            openConfirmDelete={openConfirmDelete}
            closeConfirmDelete={closeConfirmDelete}
            handleDeleteCompleted={handleDeleteCompleted}
            onRowSelectionModelChange={handleSelectionChange}
            handleDeleteSelected={() => setOpenConfirmDelete(true)}
            selectionModel={selectedIds}
            totalRecords={totalRecords}
            exportFields={['clientDocumentType', 'documentName']}
          />
        </Paper>
      )}
    </>
  );
};

export default Document;
