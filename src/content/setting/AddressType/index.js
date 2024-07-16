import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Zoom
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, Link as RouterLink } from 'react-router-dom';
import DataTable from 'src/components/Table/Table';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import useRefMounted from 'src/hooks/useRefMounted';
import {
  deleteAddressType,
  getAllAddressType
} from 'src/api/settings/addressType';

const AddressType = () => {
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
  const [addressTypeId, setAddressTypeId] = useState('');
  const location = useLocation();
  const isMountedRef = useRefMounted();

  const getAddressType = useCallback(async () => {
    // let obj = {
    //   pageIndex: page + 1,
    //   pageSize: limit,
    //   orderByAscending: true,
    //   searchString: query
    // };
    // await getAllAddressType(obj)
    //   .then((res) => {
    // if (res.data.data == null) {
    //   setUsers([]);
    // } else {
    //   setUsers(res.data.data);
    // }
    // })
    //   .catch((e) => console.log(e));
    getAllAddressType()
      .then((res) => {
        if (res) {
          if (res.data.data == null) {
            setUsers([]);
          } else {
            setUsers(res.data.data);
            setTotalRecords(res.data.totalRecords);
          }
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoding(false);
      });
  }, [isMountedRef, page, limit, query]);

  useEffect(() => {
    setLoding(true);
    getAddressType();
  }, [getAllAddressType, page, limit, query, location.pathname]);

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
    await getAllAddressType(obj)
      .then((res) => {
        if (res.data.data == null) {
          // setUsers([]);
        } else {
          // setUsers(res.data.data);
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
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteAddressType(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            getAddressType();
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
      await deleteAddressType(addressTypeId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            getAddressType();
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
    const selectedLanguageTypeIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.addressTypeId;
    });
    let tempArr = [];
    selectedLanguageTypeIds.forEach((e) => {
      tempArr.push({
        addressTypeId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const handleConfirmDelete = (params) => {
    setAddressTypeId([{ addressTypeId: params?.row?.addressTypeId }]);
    setOpenConfirmDelete(true);
  };

  const columns = [
    {
      field: 'addressType',
      headerName: t('Address Type'),
      flex: 6,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },

    {
      field: 'addressTypeId',
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
              to={`${location.pathname}/edit/${params.row.addressTypeId}`}
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
      {location.pathname === '/setting/address-type' ? (
        <>
          <Helmet>
            <title>Address Type - Setting</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Paper}
              heading={t('Address Type')}
              description={''}
              pathname={'/setting/address-type/add'}
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

export default AddressType;
