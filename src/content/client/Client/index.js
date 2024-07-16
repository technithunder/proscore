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
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { deleteClient, getAllClient } from 'src/api/client/client';
import Text from 'src/components/Text';

const Client = () => {
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
  const [clientId, setClientId] = useState('');

  const location = useLocation();
  const isMountedRef = useRefMounted();

  const fetchAllClient = useCallback(async () => {
    setLoding(true);

    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllClient(obj)
      .then((res) => {
        if (res.data.data == null) {
          setLoding(false);
          setUsers([]);
        } else {
          setTotalRecords(res.data.totalRecords);
          setUsers(res.data.data);
          setLoding(false);
        }
      })
      .catch((e) => console.log(e));
  }, [isMountedRef, page, limit, query]);

  useEffect(() => {
    fetchAllClient();
  }, [getAllClient, page, limit, query, location.pathname]);

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
    setClientId([]);
  };

  const handleDeleteCompleted = async () => {
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteClient(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllClient();
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
      await deleteClient(clientId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllClient();
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
    const selectedContactId = selection.map((selectedIndex) => {
      return users[selectedIndex]?.clientId;
    });
    let tempArr = [];
    selectedContactId.forEach((e) => {
      tempArr.push({
        clientId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const handleConfirmDelete = (params) => {
    setClientId([{ clientId: params?.row?.clientId }]);
    setOpenConfirmDelete(true);
  };


  const columns = [
    {
      field: 'companyName',
      headerName: t('Company Name'),
      flex: 1,
      minWidth: 150,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box
          component={RouterLink}
          to={`${location.pathname}/view/${params.row.clientId}`}
        >
          <Text color="darkblue">{params.row.companyName}</Text>
        </Box>
      )
    },
    {
      field: 'legalBusinessName',
      headerName: t('Legal Business Name'),
      flex: 1,
      minWidth: 150,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'website',
      headerName: t('Website'),
      flex: 1,
      minWidth: 150,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'industrySector',
      headerName: t('Industry Sector'),
      flex: 1,
      minWidth: 150,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'clientId',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
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
      {location.pathname === '/partner' ? (
        <>
          <Helmet>
            <title>Partners - Partner</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Paper}
              heading={t('Partners')}
              description={''}
              pathname={'/partner/add'}
              buttonHeading={t('Add Partner')}
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
              exportFields={[
                'companyName',
                'legalBusinessName',
                'website',
                'industrySector'
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

export default Client;
