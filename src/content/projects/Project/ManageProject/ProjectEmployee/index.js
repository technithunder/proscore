import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Zoom,
  Tooltip,
  Divider,
  Stack,
  Button,
  Paper
} from '@mui/material';
import DataTable from 'src/components/Table/Table';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import useRefMounted from 'src/hooks/useRefMounted';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  deleteProjectEmployee,
  getAllProjectEmployee
} from 'src/api/projects/ProjectEmployee';
import AddProjectEmployee from './Add';
import Text from 'src/components/Text';

const ProjectEmployee = ({ projectId }) => {
  const [addProjectEmployeeForm, setAddProjectEmployeeForm] = useState(false);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [employmentTermId, setEmploymentTermId] = useState('');
  const [loading, setLoding] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const location = useLocation();
  const isMountedRef = useRefMounted();

  const getProjectEmployees = useCallback(async () => {
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllProjectEmployee(obj, projectId)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
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
    getProjectEmployees();
  }, [getAllProjectEmployee, page, limit, query, location.pathname]);

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
    await getAllProjectEmployee(obj)
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
    console.log(params?.row?.employmentTermId);
    setEmploymentTermId([{ employmentTermId: params?.row?.employmentTermId }]);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteProjectEmployee(selectedIds)
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
      console.log(employmentTermId);
      await deleteProjectEmployee(employmentTermId)
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
    getProjectEmployees();
  };

  const handleSelectionChange = (selection) => {
    const selectedEmploymentTermIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.employmentTermId;
    });
    let tempArr = [];
    selectedEmploymentTermIds.forEach((e) => {
      tempArr.push({
        employmentTermId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const handleAddForm = () => {
    getProjectEmployees();
    setAddProjectEmployeeForm(true);
  };

  const columns = [
    {
      field: 'fullName',
      headerName: `Full Name`,
      flex: 2,
      renderHeader: (params) => (
        <Typography
          variant="h5"
          to={`${location.hash}/employee/employee/ManageEmployee/${params.field.employeeId}`}
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
          to={`${location.hash}/employee/employee/ManageEmployee/${params.row.employeeId}`}
          onClick={() =>
            sessionStorage.setItem(
              'fullName',
              `${params.row.firstName} ${params.row.lastName}`
            )
          }
        >
          <Text color="darkblue">
            {' '}
            {params.row.firstName} {params.row.lastName}
          </Text>
        </Box>
      )
    },
    {
      field: 'projectJobTitle',
      headerName: t('Job Title'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'isActive',
      headerName: t('Status'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Text> {params.row.isActive === true ? 'Active' : 'In Active'}</Text>
        </Box>
      )
    },
    {
      headerName: t('Actual Total Hourly Comp'),
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Text> ${(params.row.fringe + params.row.rate).toFixed(2)}</Text>
        </Box>
      )
    },
    {
      field: 'perDiem',
      headerName: t('Perdiem (p/day)'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Text> ${params.row.perDiem.toFixed(2)}</Text>
        </Box>
      )
    },
    {
      field: 'isApprentice',
      headerName: t('Apprentice Job (Y/N)'),
      flex: 2,
      width: 80,
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Text> {params.row.isApprentice === true ? 'Yes' : 'No'}</Text>
        </Box>
      )
    },
    {
      field: 'projectEmployeeId',
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
      {addProjectEmployeeForm ? (
        <AddProjectEmployee
          projectId={projectId}
          onClick={handleAddForm}
          onCancelProjectJobEmployeeForm={() =>
            setAddProjectEmployeeForm(false)
          }
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
                Employee
              </Typography>
              <Button
                type="button"
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => {
                  setAddProjectEmployeeForm(true);
                }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
              >
                Add Employee
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
            exportFields={[
              'fullName',
              'projectJobTitle',
              'perDiem',
              'isApprentice',
              'actualTotalHourlyComp'
            ]}
          />
        </Paper>
      )}
    </>
  );
};

export default ProjectEmployee;
