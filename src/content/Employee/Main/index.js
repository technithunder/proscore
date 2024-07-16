import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useTranslation } from 'react-i18next';
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate
} from 'react-router-dom';
import PageHeader from 'src/components/PageHeader';
import useRefMounted from 'src/hooks/useRefMounted';
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Zoom
} from '@mui/material';
import DataTable from 'src/components/Table/Table';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import {
  deleteProScoreEmployees,
  getAllProScoreEmployees
} from 'src/api/employee';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';
import Text from 'src/components/Text';

const Employee = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = useLocation();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoding] = useState(false);
  const isMountedRef = useRefMounted();
  const [totalRecords, setTotalRecords] = useState();
  const [employeeId, setEmployeeId] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchAllProScoreEmployee = useCallback(async () => {
    setLoding(true);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllProScoreEmployees(obj)
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
    fetchAllProScoreEmployee();
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
  }, [getAllProScoreEmployees, page, limit, query, location.pathname]);

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (params) => {
    setEmployeeId([...employeeId, { employeeId: params?.row?.employeeId }]);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
    await getAllProScoreEmployees(obj)
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

  const columns = [
    {
      field: 'lastName',
      headerName: `Last Name`,
      flex: 2,
      renderHeader: (params) => (
        <Typography
          variant="h5"
          to={`${location.pathname}/ManageEmployee/${params.field.employeeId}`}
          onClick={() =>
            sessionStorage.setItem(
              'fullName',
              `${params.row.firstName} ${params.row.lastName}`
            )
          }
        >
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <Box
          component={RouterLink}
          to={`${location.pathname}/ManageEmployee/${params.row.employeeId}`}
          onClick={() =>
            sessionStorage.setItem(
              'fullName',
              `${params.row.firstName} ${params.row.lastName}`
            )
          }
        >
          <Text color="darkblue"> {params.row.lastName}</Text>
        </Box>
      )
    },
    {
      field: 'firstName',
      headerName: t(`First Name`),
      flex: 2,
      renderHeader: (params) => (
        <Typography
          variant="h5"
          to={`${location.pathname}/ManageEmployee/${params.field.employeeId}`}
          onClick={() =>
            sessionStorage.setItem(
              'fullName',
              `${params.row.firstName} ${params.row.lastName}`
            )
          }
        >
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <Box
          component={RouterLink}
          to={`${location.pathname}/ManageEmployee/${params.row.employeeId}`}
          onClick={() =>
            sessionStorage.setItem(
              'fullName',
              `${params.row.firstName} ${params.row.lastName}`
            )
          }
        >
          <Text color="darkblue">{params.row.firstName}</Text>
        </Box>
      )
    },

    {
      field: 'jobTitle',
      headerName: `Job Title`,
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'department',
      headerName: `Department`,
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },

    {
      field: 'employeeId',
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

  const handleDeleteCompleted = async () => {
    console.log('Delete length ' + selectedIds.length);
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteProScoreEmployees(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllProScoreEmployee();
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
      await deleteProScoreEmployees(employeeId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllProScoreEmployee();
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
    fetchAllProScoreEmployee();
  };

  const handleSelectionChange = (selection) => {
    const selectedEmployeeIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.employeeId;
    });
    let tempArr = [];
    selectedEmployeeIds.forEach((e) => {
      tempArr.push({
        employeeId: e
      });
    });
    setSelectedIds(tempArr);
  };

  return (
    <>
      {location.pathname === '/employee/employee' ? (
        <>
          <Helmet>
            <title>Employee - Employee</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Paper}
              heading={t('Employees')}
              description={''}
              pathname={'/employee/employee/add'}
              buttonHeading={t('Add Employee')}
              Icon={AddTwoToneIcon}
            />
          </PageTitleWrapper>
          <Box sx={{ px: 2 }}>
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
                'lastName',
                'firstName',
                'jobTitle',
                'department'
              ]}
            />
          </Box>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Employee;
