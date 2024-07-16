import React, { useState, useEffect, useCallback } from 'react';

import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import PageHeader from 'src/components/PageHeader';
import { Helmet } from 'react-helmet-async';
import DataTable from 'src/components/DataTable';
import useRefMounted from 'src/hooks/useRefMounted';
import axios from 'src/utils/axios';
import { Box, Paper } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

const ProjectType = () => {
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
      {location.pathname === '/setting/project-type' ? (
        <>
          <Helmet>
            <title>Project Type - Setting</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Paper}
              heading={t('Project Type')}
              description={''}
              pathname={'/setting/project-type/add'}
              buttonHeading={t('Add Type')}
              Icon={AddTwoToneIcon}
            />
          </PageTitleWrapper>
          <Box sx={{ px: 2 }}>
            <DataTable users={users} label={'Project Type'} />
          </Box>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default ProjectType;
