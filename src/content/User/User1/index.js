import { useState, useEffect, useCallback } from 'react';
import axios from 'src/utils/axios';

import { Helmet } from 'react-helmet-async';

import { Grid } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';

import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import Results from './Results';

import { useTranslation } from 'react-i18next';
import { useLocation, Outlet } from 'react-router-dom';

const User1 = () => {
  const { t } = useTranslation();
  const isMountedRef = useRefMounted();
  const [users, setUsers] = useState([]);
  const location = useLocation();

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
      {location.pathname === '/user/user1' ? (
        <>
          <Helmet>
            <title>User - Users</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              heading={t('Users Management')}
              description={t(
                'All aspects related to the app users can be managed from this page'
              )}
              pathname={'/user/user1/add-user'}
              buttonHeading={t('Create User')}
            />
          </PageTitleWrapper>

          <Grid
            sx={{
              px: 3
            }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item xs={12}>
              <Results users={users} />
            </Grid>
          </Grid>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default User1;
