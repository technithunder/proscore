import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { useSnackbar } from 'notistack';
import DataTable from 'src/components/Table/Table';
import {
  deleteEmployeeTimeSheet,
  getAllEmployeeTimeSheet
} from 'src/api/employee/timesheet';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useTranslation } from 'react-i18next';
import Text from 'src/components/Text';
import AddTimeSheet from './Add';

const Employee = ({ employeeId }) => {
  console.log(employeeId);
  const [addEmployeeTimeSheetForm, setAddEmployeeTimeSheetForm] =
    useState(false);
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
  const [employeeTimesheetId, setEmployeeTimesheetId] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [timesheetId, setTimesheetId] = useState('');

  const handleConfirmDelete = (params) => {
    setEmployeeTimesheetId([
      ...employeeTimesheetId,
      {
        employeeTimesheetId: params?.row?.employeeTimesheetId
      }
    ]);
    setOpenConfirmDelete(true);
  };

  const fetchAllEmployeeTimeSheet = useCallback(async () => {
    setLoding(true);
    let obj = {
      id: employeeId,
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllEmployeeTimeSheet(obj)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
          setLoding(false);
        } else {
          setTotalRecords(res.data.totalRecords);
          setUsers(res.data.data);
          setLoding(false);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoding(false);
      });
  }, [isMountedRef, page, limit, query]);

  useEffect(() => {
    setLoding(true);
    fetchAllEmployeeTimeSheet();
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
  }, [getAllEmployeeTimeSheet, addEmployeeTimeSheetForm]);

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const handleAddForm = () => {
    fetchAllEmployeeTimeSheet();
    setAddEmployeeTimeSheetForm(false);
  };

  const handleEditForm = (timesheetId) => {
    fetchAllEmployeeTimeSheet();
    setAddEmployeeTimeSheetForm(true);
    setTimesheetId(timesheetId);
  };

  const columns = [
    {
      field: 'projectName',
      headerName: `Project Name`,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box
          component={Link}
          onClick={() => handleEditForm(params.row.employeeTimesheetId)}
          to=""
        >
          <Text color="darkblue"> {params.row.projectName}</Text>
        </Box>
      )
    },
    {
      field: 'comment',
      headerName: `Comment`,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'workDate',
      headerName: 'Work Date',
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => {
        const date = new Date(params.value);
        const dateString = date.toISOString().split('T')[0];

        return <Typography variant="body1">{dateString}</Typography>;
      }
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => {
        const date = new Date(params.value);
        const timeString = date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        return <Typography variant="body1">{timeString}</Typography>;
      }
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => {
        const date = new Date(params.value);
        const timeString = date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        return <Typography variant="body1">{timeString}</Typography>;
      }
    },

    {
      field: 'timeEntryReasonType',
      headerName: `Time Entry Reason Type`,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'employeeTimesheetId',
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
      await deleteEmployeeTimeSheet(selectedIds)
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
      await deleteEmployeeTimeSheet(employeeTimesheetId)
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
    fetchAllEmployeeTimeSheet();
  };

  const handleSelectionChange = (selection) => {
    const selectedEmployeeIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.employeeTimesheetId;
    });
    let tempArr = [];
    selectedEmployeeIds.forEach((e) => {
      tempArr.push({
        employeeTimesheetId: e
      });
    });
    setSelectedIds(tempArr);
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
    await getAllEmployeeTimeSheet(obj)
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

  return (
    <>
      {addEmployeeTimeSheetForm ? (
        <AddTimeSheet
          onClick={handleAddForm}
          onCancelContactForm={() => setAddEmployeeTimeSheetForm(false)}
          employeeId={employeeId}
          timesheetId={timesheetId}
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
                {t('Time Sheet')}
              </Typography>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => {
                  setTimesheetId('');
                  setAddEmployeeTimeSheetForm(true);
                }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
              >
                Add Time Sheet
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
            exportFields={[
              'projectName',
              'comment',
              'workDate',
              'startTime',
              'endTime',
              'timeEntryReasonType'
            ]}
          />
        </Paper>
      )}
    </>
  );
};

export default Employee;
