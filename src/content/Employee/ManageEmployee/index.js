import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmployeeDocumentType from './Document';
import EmployeeNotes from './Notes';
import EmployeeSocialMedia from './SocialMedia';
import Employee from './TimeSheet';
import EmployeeAdd from '../Main/Add';

const ManageEmployee = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const employeeName = sessionStorage.getItem('fullName');

  const [currentTab, setCurrentTab] = useState('profile');

  const tabs = [
    { value: 'profile', label: t('Profile') },
    { value: 'document', label: t('Document') },
    { value: 'notes', label: t('Notes') },
    { value: 'socialmedia', label: t('Social Media') },
    { value: 'timesheet', label: t('Time Sheet') }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Helmet>
        <title>View - Employee</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Employee Information')}
          description={`${employeeName}`}
          pathname={'/employee/employee'}
          buttonHeading={t('Go back to all Employees')}
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
            <EmployeeAdd currentTab={currentTab} employeeId={id} />
          )}
          {currentTab === 'document' && (
            <EmployeeDocumentType currentTab={currentTab} employeeId={id} />
          )}
          {currentTab === 'notes' && (
            <EmployeeNotes currentTab={currentTab} employeeId={id} />
          )}
          {currentTab === 'socialmedia' && (
            <EmployeeSocialMedia currentTab={currentTab} employeeId={id} />
          )}
          {currentTab === 'timesheet' && (
            <Employee currentTab={currentTab} employeeId={id} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default ManageEmployee;
