import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Contact from 'src/content/client/Client/View/Contact';
import Document from 'src/content/client/Client/View/Document';
import Notes from 'src/content/client/Client/View/Notes';
import Profile from 'src/content/client/Client/View/Profile';
import Location from 'src/content/client/Client/View/Location';
import SocialMedia from 'src/content/client/Client/View/SocialMedia';

const ClientView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const [companyName, setCompanyName] = useState('');
  const [currentTab, setCurrentTab] = useState('profile');

  const tabs = [
    { value: 'profile', label: t('Profile') },
    { value: 'contact', label: t('Contacts') },
    { value: 'document', label: t('Documents') },
    { value: 'notes', label: t('Notes') },
    { value: 'location', label: t('Locations') },
    { value: 'media', label: t('Social Media') }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      {location.pathname === `/partner/view/${id}` ? (
        <>
          <Helmet>
            <title>View - Client</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Box}
              heading={t('Partner Information')}
              description={companyName}
              pathname={'/partner'}
              buttonHeading={t('Go back to all partner')}
              Icon={ArrowBackIcon}
            />
          </PageTitleWrapper>
          <Box sx={{ mx: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Tabs
                onChange={handleTabsChange}
                value={currentTab}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
            </Paper>
            <Box sx={{ mt: 3 }}>
              {currentTab === 'profile' && (
                <Profile clientId={id} onClick={(e) => setCompanyName(e)} />
              )}
              {currentTab === 'contact' && (
                <Contact currentTab={currentTab} clientId={id} />
              )}
              {currentTab === 'document' && (
                <Document currentTab={currentTab} clientId={id} />
              )}
              {currentTab === 'notes' && (
                <Notes currentTab={currentTab} clientId={id} />
              )}
              {currentTab === 'location' && (
                <Location currentTab={currentTab} clientId={id} />
              )}
              {currentTab === 'media' && (
                <SocialMedia currentTab={currentTab} clientId={id} />
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default ClientView;
