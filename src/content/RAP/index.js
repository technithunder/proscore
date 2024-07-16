import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Outlet, useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, Typography, Zoom } from '@mui/material';
import Text from 'src/components/Text';
import DataTable from 'src/components/Table/Table';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import useRefMounted from 'src/hooks/useRefMounted';
import { deleteProject, getAllProjects } from 'src/api/projects/Project';
import { getAllAssignRAP } from 'src/api/rap';

const RAP = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [projectId] = useState('');
  const [loading, setLoding] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const location = useLocation();
  const isMountedRef = useRefMounted();

  const getProject = useCallback(async () => {
    setLoding(true);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllAssignRAP(obj)
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

  useEffect(() => {
    setLoding(true);
    getProject();
    console.log(state);
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
  }, [getAllProjects, page, limit, query, location.pathname]);

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
    await getAllProjects(obj)
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

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    console.log('Delete length ' + selectedIds.length);
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteProject(selectedIds)
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
      await deleteProject(projectId)
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
    getProject();
  };

  const handleSelectionChange = (selection) => {
    const selectedProjectTypeIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.projectId;
    });
    let tempArr = [];
    selectedProjectTypeIds.forEach((e) => {
      tempArr.push({
        projectId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const columns = [
    {
      field: 'jobTitleName',
      headerName: t('Job Title'),
      flex: 1,
      width: 100,
      minWidth: 150,

      headerClassName: 'wrapHeader',
      renderHeader: (params) => (
        <Typography
          variant="h5"
          to={`${location.pathname}/ManageAssignRAP/${params.field.assignRAPInfoId}`}
        >
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <Box
          component={RouterLink}
          to={`${location.pathname}/ManageAssignRAP/${params.row.assignRAPInfoId}`}
        >
          <Text color="darkblue">{params.row.jobTitleName}</Text>
        </Box>
      )
    },
    {
      field: 'category',
      headerName: t('Category'),
      flex: 2,
      minWidth: 150,

      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'rapidCode',
      headerName: t('RAPIDS Code'),
      flex: 2,
      minWidth: 150,

      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'onetCode',
      headerName: t('ONetCode'),
      flex: 2,
      minWidth: 150,

      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    }
  ];

  return (
    <>
      {location.pathname === '/RAP/RAP' ? (
        <>
          <Helmet>
            <title>Assigned RAP management</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Paper}
              heading={t('Assigned RAP management')}
              description={''}
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
              openConfirmDelete={openConfirmDelete}
              closeConfirmDelete={closeConfirmDelete}
              handleDeleteCompleted={handleDeleteCompleted}
              onRowSelectionModelChange={handleSelectionChange}
              handleDeleteSelected={() => setOpenConfirmDelete(true)}
              selectionModel={selectedIds}
              totalRecords={totalRecords}
            />
          </Box>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default RAP;
