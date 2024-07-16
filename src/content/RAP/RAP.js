import * as React from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab, Typography, Paper, Card } from '@mui/material';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import RAPInfo from './RAPInfo';
import WageRate from './WageRate';
import WpsActivities from './WpsActivities';


export default function RAP() {
  const [value, setValue] = React.useState('rap');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={'Registered Apprenticeship Program'}
          description={''}
        />
      </PageTitleWrapper>
      <Box sx={{ mx: 4 }}>
        <TabContext value={value}>
          <Card sx={{ mx: 0, mb: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="RAP Info" value="rap" />
                  <Tab label="Wage Rate" value="wage" />
                  <Tab label="WPS Activities" value="wps" />
                  <Tab label="Partner RAP Settings" value="settings" />
                  <Tab label="Documents" value="documents" />
                </TabList>
              </Box>
            </Paper>
          </Card>
          <Card sx={{ mx: 0, mb: 3 }}>
            <TabPanel value="rap">
              <RAPInfo />
            </TabPanel>
            <TabPanel value="wage">
              <WageRate />
            </TabPanel>
            <TabPanel value="wps">
              <WpsActivities />
            </TabPanel>
            <TabPanel value="settings">
              <Typography variant="h4">Partner RAP Settings</Typography>
            </TabPanel>
            <TabPanel value="documents">
              <Typography variant="h4">Documents</Typography>
            </TabPanel>
          </Card>
        </TabContext>
      </Box>
    </>
  );
}
