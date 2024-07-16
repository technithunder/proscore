import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProjectEmployee from 'src/content/projects/Project/ManageProject/ProjectEmployee';
import ProjectJobTitle from 'src/content/projects/Project/ManageProject/ProjectJobTitle';
import MyProjectInfo from 'src/content/projects/Project/ManageProject/MyProjectInfo';
import AddProject from 'src/content/projects/Project/Add';
import TimeSheet from 'src/content/projects/Project/ManageProject/TimeSheet';
import CertifiedPayrollReport from './CertifiedPayrollReport';
import PayrollSummaryReport from './PayrollSummaryReport';

const ManageProject = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [projectName, setProjectName] = useState('');

  const [currentTab, setCurrentTab] = useState('profile');

  const tabs = [
    { value: 'profile', label: t('Profile') },
    { value: 'myProjectInfo', label: t('My Project Info') },
    { value: 'jobTitle', label: t('Jobs') },
    { value: 'employee', label: t('Employees') },
    { value: 'timesheet', label: t('TimeSheets') },
    { value: 'payrollSummaryReport', label: t('Payroll Summary Report') },
    { value: 'CertifiedPayrollReport', label: t('Certified Payroll Report') }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
    console.log(value);
  };

  return (
    <>
      <>
        <Helmet>
          <title>View - Project</title>
        </Helmet>
        <PageTitleWrapper>
          <PageHeader
            Component={Box}
            heading={t('Project Profile')}
            description={projectName}
            pathname={'/projects/project'}
            buttonHeading={t('Go back to all Projects')}
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
              <AddProject
                currentTab={currentTab}
                id={id}
                onClick={(e) => setProjectName(e)}
              />
            )}
            {currentTab === 'employee' && (
              <ProjectEmployee currentTab={currentTab} projectId={id} />
            )}
            {currentTab === 'myProjectInfo' && (
              <MyProjectInfo currentTab={currentTab} id={id} />
            )}
            {currentTab === 'jobTitle' && (
              <ProjectJobTitle currentTab={currentTab} projectId={id} />
            )}
            {currentTab === 'timesheet' &&
              (<TimeSheet projectId={id} />
              )}
            {currentTab === 'payrollSummaryReport' &&
              (<PayrollSummaryReport projectId={id} />
              )}
            {currentTab === 'CertifiedPayrollReport' && (
              <CertifiedPayrollReport projectId={id} currentTab={currentTab} />
            )}
          </Box>
        </Box>
      </>
    </>
  );
};

export default ManageProject;
