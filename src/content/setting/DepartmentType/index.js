import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Zoom,
  Tooltip
} from '@mui/material';
import DataTable from 'src/components/Table/Table';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import useRefMounted from 'src/hooks/useRefMounted';
import EditIcon from '@mui/icons-material/Edit';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  getAllDepartmentType,
  deleteDepartmentType
} from 'src/api/settings/departmentType';

const DepartmentType = () => {
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
  const [departmentTypeId, setDepartmentTypeId] = useState('');
  const location = useLocation();
  const isMountedRef = useRefMounted();

  const getDepartmentType = useCallback(async () => {
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: query
    };
    await getAllDepartmentType(obj)
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
    getDepartmentType();
  }, [getAllDepartmentType, page, limit, query, location.pathname]);

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
      await deleteDepartmentType(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            getDepartmentType();
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
      await deleteDepartmentType(departmentTypeId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            getDepartmentType();
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
  };

  const handleSelectionChange = (selection) => {
    const selectedDepartmentType = selection.map((selectedIndex) => {
      return users[selectedIndex]?.departmentTypeId;
    });
    let tempArr = [];
    selectedDepartmentType.forEach((e) => {
      tempArr.push({
        departmentTypeId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const handleConfirmDelete = (params) => {
    setDepartmentTypeId([{ departmentTypeId: params?.row?.departmentTypeId }]);
    setOpenConfirmDelete(true);
  };

  const columns = [
    {
      field: 'departmentType',
      headerName: t('Department Type'),
      flex: 6,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },

    {
      field: 'departmentTypeId',
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
          <Tooltip title={t('Edit')} arrow>
            <IconButton
              component={RouterLink}
              to={`${location.pathname}/edit/${params.row.departmentTypeId}`}
              color="primary"
            >
              <EditIcon fontSize="small" />
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
      {location.pathname === '/setting/department-type' ? (
        <>
          <Helmet>
            <title>Department Type - Setting</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Paper}
              heading={t('Department Type')}
              description={''}
              pathname={'/setting/department-type/add'}
              buttonHeading={t('Add Type')}
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

export default DepartmentType;
