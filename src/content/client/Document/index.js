import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import PageHeader from 'src/components/PageHeader';
import useRefMounted from 'src/hooks/useRefMounted';
import axios from 'src/utils/axios';
import { Box, Paper } from '@mui/material';
import DataTable from 'src/components/DataTable';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

const ClientDocumentType = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isMountedRef = useRefMounted();
  const [users, setUsers] = useState([]);

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

  return (
    <>
      {location.pathname === '/client/document' ? (
        <>
          <Helmet>
            <title>Document - Client</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Paper}
              heading={t('Document')}
              description={''}
              pathname={'/client/document/add'}
              buttonHeading={t('Add Document')}
              Icon={AddTwoToneIcon}
            />
          </PageTitleWrapper>
          <Box sx={{ px: 2 }}>
            <DataTable users={users} label={'Document Type'} />
          </Box>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default ClientDocumentType;
