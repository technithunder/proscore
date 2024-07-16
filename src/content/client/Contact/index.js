import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, Link as RouterLink } from 'react-router-dom';
import PageHeader from 'src/components/PageHeader';
import useRefMounted from 'src/hooks/useRefMounted';
import axios from 'src/utils/axios';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Tooltip,
  Zoom
} from '@mui/material';
import DataTable from 'src/components/Table/Table';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';

const Contact = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isMountedRef = useRefMounted();
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/users');
      console.log('==>', response);

      if (isMountedRef.current) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleSelectionChange = (selection) => {
    setSelectedIds(selection);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('Record has been deleted successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const handleDeleteSelected = () => {
    console.log('selected row', selectedIds);
  };

  const columns = [
    {
      field: 'username',
      headerName: `First Name`,
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'name',
      headerName: `Last Name`,
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'email',
      headerName: `Company Email`,
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'id',
      headerName: 'Actions',
      flex: 1,
      disableColumnMenu: true,
      hideSortIcons: true,
      sortingOrder: false,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: () => (
        <Box>
          <Tooltip title={t('Edit')} arrow>
            <IconButton
              component={RouterLink}
              to={`${location.pathname}/add`}
              color="primary"
            >
              <LaunchTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Delete')} arrow>
            <IconButton onClick={handleConfirmDelete} color="error">
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <>
      {location.pathname === '/client/contact' ? (
        <>
          <Helmet>
            <title>Contact - Client</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Paper}
              heading={t('Contact')}
              description={''}
              pathname={'/client/contact/add'}
              buttonHeading={t('Add Contact')}
              Icon={AddTwoToneIcon}
            />
          </PageTitleWrapper>
          <Box sx={{ px: 2 }}>
            <DataTable
              data={users}
              selectionModel={selectedIds}
              onRowSelectionModelChange={handleSelectionChange}
              columns={columns}
              openConfirmDelete={openConfirmDelete}
              closeConfirmDelete={closeConfirmDelete}
              handleDeleteCompleted={handleDeleteCompleted}
              handleDeleteSelected={handleDeleteSelected}
            />
          </Box>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Contact;
