import React, {  useEffect,useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ActiveReferrals from './ApprenticeReferrals';
import OTJHoursReferrals from './OTJHoursReferrals';
import PendingEnrollmentReferrals from './PendingEnrollmentReferrals';
import RTIHoursReferrals from './RTIHoursReferrals';
import { getAllRAPStatusDetail } from 'src/api/rap';


function RAPStatus({ assignRAPInfoGuid, onClick }) {
  console.log(onClick)
  const { t } = useTranslation();
  console.log(t)
  const [totalApprentice, setTotalApprentice] = useState(0);
  const [totalOTJHours, setTotalOTJHours] = useState(0);
  const [totalRTIHours, setTotalRTIHours] = useState(0);

  const getRAPStatusDetail = async () => {
    await getAllRAPStatusDetail(assignRAPInfoGuid)
      .then((res) => {   
        setTotalApprentice(res.data.data.totalApprentice);
        setTotalOTJHours(res.data.data.totalOTJHours);
        setTotalRTIHours(res.data.data.totalRTIHours);
      })
      .catch((e) => console.log(e))
      .finally(() => {
      });
  };

  useEffect(() => {
    getRAPStatusDetail()
   
  }, []);


  return (
    <>
      <Helmet>
        <title>ProscroPlus</title>
      </Helmet>
      <Grid
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
              <ActiveReferrals data={totalApprentice} />
            </Grid>
            <Grid item sm={6} md={6} lg={6} xl={3} xs={12}>
              <OTJHoursReferrals data={totalOTJHours} />
            </Grid>
            <Grid item sm={6} md={6} lg={6} xl={3} xs={12}>
              <RTIHoursReferrals data={totalRTIHours} />
            </Grid>
            <Grid item sm={6} md={6} lg={6} xl={3} xs={12}>
              <PendingEnrollmentReferrals />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item lg={12} md={12} xs={12}>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid item sm={6} md={6} lg={6} xl={3} xs={12}>
              <WPSStatus />
            </Grid>
            <Grid item sm={6} md={6} lg={6} xl={3} xs={12}>
              <OTJHoursReferrals />
            </Grid>
            
          </Grid>
        </Grid> */}
        
      </Grid>

    </>
  );
}

export default RAPStatus;
