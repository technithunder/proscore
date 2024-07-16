import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Helmet } from 'react-helmet-async';
import Gauge from 'src/components/Gauge';
// import Conversions from './Conversions';
import TopLandingPages from './TopLandingPages';
import ActiveReferrals from './ActiveReferrals';
import PendingInvitations from './PendingInvitations';
import BounceRate from './BounceRate';
import ConversionsAlt from './ConversionsAlt';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { buildStyles } from 'react-circular-progressbar';
import { useTranslation } from 'react-i18next';
import WoktForceTable from './WotkForce';
import LandingPages from './LandingPages';
import Label from 'src/components/Label';
import GaugeChartComponent from 'src/components/Chart/Guage';

const data = {
  percentage: 80,
  sales: 127,
  customers: 1.358,
  earnings: '$15,864.00'
};

function DashboardAnalytics() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>ProscroPlus</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
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
        <Grid item lg={12} md={12} xs={12}>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid item sm={6} md={6} lg={6} xl={3} xs={12}>
              <ActiveReferrals />
            </Grid>
            <Grid item sm={6} md={6} lg={6} xl={3} xs={12}>
              <PendingInvitations />
            </Grid>
            <Grid item sm={6} md={6} lg={6} xl={3} xs={12}>
              <BounceRate />
            </Grid>
            <Grid item sm={6} md={6} lg={6} xl={3} xs={12}>
              <ConversionsAlt />
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          <WoktForceTable />
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid item sm={12} md={6} lg={6} xs={12}>
              <Card sx={{ minHeight: '80%' }}>
                <CardHeader
                  title={
                    <Typography fontSize={18} fontWeight="700">
                      {t('Weekly Total Workforce Compliance')}
                    </Typography>
                  }
                />
                <Divider sx={{ mb: 2 }} />
                <Stack
                  spacing={2}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Gauge
                    circleRatio={0.8}
                    styles={buildStyles({ rotation: 1 / 2 + 1 / 9.5 })}
                    value={data.percentage}
                    strokeWidth={13}
                    text={`${data.percentage}%`}
                    color="success"
                    size="xxlarge"
                  />
                </Stack>

                <Stack
                  spacing={2}
                  mt={2}
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                >
                  <Stack direction="row" spacing={1}>
                    <Box
                      sx={{
                        backgroundColor: '#57ca22',
                        width: 20,
                        height: 20
                      }}
                    />

                    <Typography color="black" fontWeight="bold">
                      {t('Non-Apprentice Hours')}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Box
                      sx={{
                        backgroundColor: '#e8eaee',
                        width: 20,
                        height: 20
                      }}
                    />
                    <Typography color="black" fontWeight="bold">
                      {t('Apprentice Hours')}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  sx={{
                    justifyContent: {
                      xs: 'flex-start',
                      sm: 'center',
                      md: 'space-around',
                      lg: 'space-around'
                    }
                  }}
                  alignItems="center"
                >
                  <Box sx={{ p: 2 }}>
                    <Tooltip
                      placement="top"
                      title="Total Workforce Hours"
                      arrow
                    >
                      <Typography fontSize={15} color="black">
                        Total Workforce
                      </Typography>
                    </Tooltip>

                    <Typography fontSize={20} fontWeight="bold">
                      8,419 Hrs
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Tooltip placement="top" title="Apprentice OTJ Hours" arrow>
                      <Typography fontSize={15} color="black">
                        Apprentice OTJ
                      </Typography>
                    </Tooltip>

                    <Typography fontSize={20} fontWeight="bold">
                      1,684 Hrs
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Tooltip
                      fontSize={10}
                      placement="top"
                      title="Non Apprentice-to-Apprentice Hours"
                      arrow
                    >
                      <Typography fontSize={15} color="black">
                        Non Apprentice-to-Apprentice Hours
                      </Typography>
                    </Tooltip>
                    <Typography fontSize={20} fontWeight="bold" color="green">
                      20%
                      <Label color="success">15% Min Threshold</Label>
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item sm={12} md={6} lg={6} xs={12}>
              <Card sx={{ minHeight: '100%' }}>
                <CardHeader
                  title={
                    <Typography fontSize={18} fontWeight="700">
                      {t('ProScore Rating')}
                    </Typography>
                  }
                />
                <Divider />
                <Grid container p={4} spacing={2}>
                  <Grid item sm={4} xs={12}>
                    <GaugeChartComponent title={t('Worker')} percent={0.75} />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <GaugeChartComponent title={t('Employer')} percent={0.85} />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <GaugeChartComponent title={t('Job Site')} percent={1} />
                  </Grid>
                </Grid>

                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={4}
                  my={2}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        backgroundColor: 'red',
                        width: 22,
                        height: 22
                      }}
                    />
                    <Typography color="red" fontSize={17} fontWeight="bold">
                      {t('Not Efficient')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        backgroundColor: '#57ca22',
                        width: 22,
                        height: 22
                      }}
                    />
                    <Typography fontSize={17} color="#57ca22" fontWeight="bold">
                      {t('Efficient')}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box m={3}>
        <Typography mb={2} fontWeight="700" fontSize={18}>
          Apprenticeship Program Progression
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <TopLandingPages
              title={'Quartz Solar (26 Apprentices)'}
              projectId={'11415-Renewable'}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <LandingPages
              projectId={'43302-Renewable'}
              title={'Sunnyside Up (14 Apprentices)'}
            />
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default DashboardAnalytics;
