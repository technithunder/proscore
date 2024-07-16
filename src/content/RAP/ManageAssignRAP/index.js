import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WageScale from 'src/content/RAP/ManageAssignRAP/WageScale';
import RAPStatus from 'src/content/RAP/ManageAssignRAP/RAPStatus';
import Apprentice from './Apprentice';

const ManageAssignRAP = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [rapName, setRAPName] = useState('');

  const [currentTab, setCurrentTab] = useState('rapStatus');

  const tabs = [
    { value: 'rapStatus', label: t('RAP Status') },
    { value: 'apprentice', label: t('Apprentice') },
    { value: 'wageScale', label: t('Wage Scale') }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
    console.log(value);
  };

  console.log('==>?', id);

  return (
    <>
      <>
        <Helmet>
          <title>View - Assign Rap info</title>
        </Helmet>
        <PageTitleWrapper>
          <PageHeader
            Component={Box}
            heading={t('Assign Rap info')}
            description={rapName}
            pathname={'/RAP'}
            buttonHeading={t('Go back to all Assigned RAP')}
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
            {currentTab === 'apprentice' && (
              <Apprentice assignRAPInfoGuid={id} currentTab={currentTab} />
            )}

            {currentTab === 'wageScale' && (
              <WageScale assignRAPInfoGuid={id} currentTab={currentTab} />
            )}
            {currentTab === 'rapStatus' && (
              <RAPStatus assignRAPInfoGuid={id} currentTab={currentTab} 
                onClick={(e) =>
                setRAPName(e)
              } />
            )}
          </Box>
        </Box>
      </>
    </>
  );
};

export default ManageAssignRAP;
