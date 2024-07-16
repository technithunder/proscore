import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import PageHeader from 'src/components/PageHeader';
import { Box, Paper } from '@mui/material';
import DataTable from 'src/components/DataTable';
import useRefMounted from 'src/hooks/useRefMounted';
import axios from 'src/utils/axios';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

const IndustryType = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isMountedRef = useRefMounted();
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/users');

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
      {location.pathname === '/setting/industry-type' ? (
        <>
          <Helmet>
            <title>Industry Type - Setting</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Paper}
              heading={t('Industry Type')}
              description={''}
              pathname={'/setting/industry-type/add'}
              buttonHeading={t('Add Type')}
              Icon={AddTwoToneIcon}
            />
          </PageTitleWrapper>
          <Box sx={{ px: 2 }}>
            <DataTable users={users} label={'Industry Type'} />
          </Box>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default IndustryType;
