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
import EmployeeAddSocialMedia from './Add';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router';
import {
  deleteEmployeeSocialMedia,
  getAllEmployeeocialMedia
} from 'src/api/employee/socailmedia';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import DataTable from 'src/components/Table/Table';
import Text from 'src/components/Text';
import { Link } from 'react-router-dom';

const EmployeeSocialMedia = ({ employeeId }) => {
  console.log(employeeId);
  const [addEmployeeSocailMediaForm, setAddEmployeeSocialMediaForm] =
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
  const [proScoreEmployeeSocialMediaId, setProScoreEmployeeSocialMediaId] =
    useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [employeeSocialMediaId, setEmployeeSocialMediaId] = useState('');

  const handleConfirmDelete = (params) => {
    setProScoreEmployeeSocialMediaId([
      ...proScoreEmployeeSocialMediaId,
      {
        proScoreEmployeeSocialMediaId:
          params?.row?.proScoreEmployeeSocialMediaId
      }
    ]);
    setOpenConfirmDelete(true);
  };

  const fetchAllEmployeeSocialMedia = useCallback(async () => {
    setLoding(true);
    let obj = {
      id: employeeId,
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllEmployeeocialMedia(obj)
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
    fetchAllEmployeeSocialMedia();
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
  }, [getAllEmployeeocialMedia, addEmployeeSocailMediaForm]);

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
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
    await getAllEmployeeocialMedia(obj)
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

  const handleDeleteCompleted = async () => {
    console.log('Delete length ' + selectedIds.length);
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteEmployeeSocialMedia(selectedIds)
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
      await deleteEmployeeSocialMedia(proScoreEmployeeSocialMediaId)
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
    fetchAllEmployeeSocialMedia();
  };

  const handleSelectionChange = (selection) => {
    const selectedEmployeeIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.proScoreEmployeeSocialMediaId;
    });
    let tempArr = [];
    selectedEmployeeIds.forEach((e) => {
      tempArr.push({
        proScoreEmployeeSocialMediaId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const columns = [
    {
      field: 'handle',
      headerName: `Handle`,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box
          component={Link}
          onClick={() =>
            handleEditForm(params.row.proScoreEmployeeSocialMediaId)
          }
          to=""
        >
          <Text color="darkblue"> {params.row.handle}</Text>
        </Box>
      )
    },
    {
      field: 'socialMediaName',
      headerName: `Social Media Name`,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'proScoreEmployeeSocialMediaId',
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

  const handleAddForm = () => {
    fetchAllEmployeeSocialMedia();
    setAddEmployeeSocialMediaForm(false);
  };

  const handleEditForm = (EmployeeSocialMediaId) => {
    fetchAllEmployeeSocialMedia();
    setAddEmployeeSocialMediaForm(true);
    setEmployeeSocialMediaId(EmployeeSocialMediaId);
  };

  return (
    <>
      {addEmployeeSocailMediaForm ? (
        <EmployeeAddSocialMedia
          onClick={handleAddForm}
          onCancelContactForm={() => setAddEmployeeSocialMediaForm(false)}
          employeeId={employeeId}
          employeeSocialMediaId={employeeSocialMediaId}
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
                {t('Social Media')}
              </Typography>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => {
                  setEmployeeSocialMediaId('');
                  setAddEmployeeSocialMediaForm(true);
                }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
              >
                Add Social Media
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
            exportFields={['handle', 'socialMediaName']}
          />
        </Paper>
      )}
    </>
  );
};

export default EmployeeSocialMedia;
