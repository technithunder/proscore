import React, { useCallback, useEffect, useState } from 'react';
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
import EmployeeAddNotes from './Add';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { deleteEmployeeNote, getAllEmployeeNote } from 'src/api/employee/notes';
import { useSnackbar } from 'notistack';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import DataTable from 'src/components/Table/Table';
import Text from 'src/components/Text';
import { Link } from 'react-router-dom';

const EmployeeNotes = ({ employeeId }) => {
  console.log(employeeId);
  const [addEmployeeNoteForm, setAddEmployeeNoteForm] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useLocation();
  const isMountedRef = useRefMounted();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoding] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const [employeeNoteId, setEmployeeNoteId] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [noteId, setNoteId] = useState('');

  const handleConfirmDelete = (params) => {
    setEmployeeNoteId([
      ...employeeNoteId,
      { employeeNoteId: params?.row?.employeeNoteId }
    ]);
    setOpenConfirmDelete(true);
  };

  const fetchAllEmployeeNote = useCallback(async () => {
    setLoding(true);
    let obj = {
      id: employeeId,
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllEmployeeNote(obj)
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

  useEffect(() => {
    setLoding(true);
    fetchAllEmployeeNote();
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
  }, [getAllEmployeeNote, addEmployeeNoteForm]);

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
    await getAllEmployeeNote(obj)
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

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const handleAddForm = () => {
    fetchAllEmployeeNote();
    setAddEmployeeNoteForm(false);
  };

  const handleEditForm = (noteId) => {
    fetchAllEmployeeNote();
    setAddEmployeeNoteForm(true);
    setNoteId(noteId);
    console.log(noteId);
  };

  const columns = [
    {
      field: 'notes',
      headerName: `Notes Name`,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box
          component={Link}
          onClick={() => handleEditForm(params.row.employeeNoteId)}
          to=""
        >
          <Text color="darkblue"> {params.row.notes}</Text>
        </Box>
      )
    },
    {
      field: 'noteType',
      headerName: `Notes Type`,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'employeeNoteId',
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

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    console.log('Delete length ' + selectedIds.length);
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteEmployeeNote(selectedIds)
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
      await deleteEmployeeNote(employeeNoteId)
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
    fetchAllEmployeeNote();
  };

  const handleSelectionChange = (selection) => {
    const selectedEmployeeIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.employeeNoteId;
    });
    let tempArr = [];
    selectedEmployeeIds.forEach((e) => {
      tempArr.push({
        employeeNoteId: e
      });
    });
    setSelectedIds(tempArr);
  };

  return (
    <>
      {addEmployeeNoteForm ? (
        <EmployeeAddNotes
          onClick={handleAddForm}
          onCancelContactForm={() => setAddEmployeeNoteForm(false)}
          employeeId={employeeId}
          noteId={noteId}
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
                variant="h4"
                textTransform="uppercase"
                fontWeight="700"
              >
                {t('Notes')}
              </Typography>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => {
                  setNoteId('');
                  setAddEmployeeNoteForm(true);
                }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
              >
                Add Note
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
            exportFields={['notes', 'noteType']}
          />
        </Paper>
      )}
    </>
  );
};

export default EmployeeNotes;
