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
import { deleteNotes, getAllNotes } from 'src/api/client/client/notes';
import { useTranslation } from 'react-i18next';
import AddNotes from './Add';
import { getAllNotesType } from 'src/api/client/notes';

const Notes = ({ clientId }) => {
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
  const [clientNoteId, setClientNoteId] = useState('');
  const [addNotesForm, setAddNotesForm] = useState(false);
  const [notesType, setNotesType] = useState([]);
  const location = useLocation();
  const isMountedRef = useRefMounted();

  const fetchAllNotes = useCallback(async () => {
    setLoding(true);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllNotes(obj, clientId)
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
    fetchAllNotes();
  }, [getAllNotes, page, limit, query, location.pathname]);

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
      await deleteNotes(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllNotes();
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
      await deleteNotes(clientNoteId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllNotes();
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
    const selectedClientNoteId = selection.map((selectedIndex) => {
      return users[selectedIndex]?.clientNoteId;
    });
    let tempArr = [];
    selectedClientNoteId.forEach((e) => {
      tempArr.push({
        clientNoteId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const handleConfirmDelete = (params) => {
    setClientNoteId([{ clientNoteId: params?.row?.clientNoteId }]);
    setOpenConfirmDelete(true);
  };

  const handleEditNotes = (params) => {
    setClientNoteId({ clientNoteId: params?.row?.clientNoteId });
    setAddNotesForm(true);
  };

  const handleAddForm = () => {
    fetchAllNotes();
    setAddNotesForm(false);
  };

  useEffect(() => {
    fetchAllNotesType();
  }, []);

  const fetchAllNotesType = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    let temp = [];
    await getAllNotesType(obj)
      .then((res) => {
        if (res) {
          res?.data?.data?.forEach((e) => {
            temp.push({
              label: e.noteType,
              value: e.noteTypeId
            });
          });
          setNotesType(temp);
        }
      })
      .catch((e) => console.log(e));
  };

  const columns = [
    {
      field: 'noteType',
      headerName: t('Notes Type'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Typography
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={() => handleEditNotes(params)}
        >
          {params.row.noteType}
        </Typography>
      )
    },
    {
      field: 'notes',
      headerName: t('Notes'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },

    {
      field: 'isPrivate',
      headerName: t('Is Private'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Typography>{params.row.isPrivate ? 'Yes' : 'No'}</Typography>
      )
    },

    {
      field: 'clientNoteId',
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
      {addNotesForm ? (
        <AddNotes
          clientNoteId={clientNoteId}
          id={clientId}
          onClick={handleAddForm}
          notesType={notesType}
          onCancelNotesForm={() => setAddNotesForm(false)}
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
                Notes
              </Typography>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => {
                  setClientNoteId();
                  setAddNotesForm(true);
                }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
              >
                Add Notes
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
            exportFields={['noteType', 'notes', 'isPrivate']}
          />
        </Paper>
      )}
    </>
  );
};

export default Notes;
