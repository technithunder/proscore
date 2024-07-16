import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import { useTranslation } from 'react-i18next';

const GaugeChartView2 = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        py: 2,
        display: 'flex',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <Box
        sx={{
          width: '100%'
        }}
      >
        <Typography
          align="center"
          variant="h3"
          sx={{
            mb: 2
          }}
        >
          {t('Job Site')}
        </Typography>

        <GaugeChart
          style={{ width: '90%', margin: '0 auto' }}
          nrOfLevels={16}
          hideText
          colors={[
            theme.colors.error.main,
            theme.colors.warning.main,
            theme.colors.success.main
          ]}
          needleColor={theme.colors.alpha.black[100]}
          needleBaseColor={theme.colors.alpha.black[100]}
          arcWidth={0.25}
          arcPadding={0.0}
          cornerRadius={3}
          percent={1}
        />

        <Typography align="center" variant="h1" />
          
       
      </Box>
    </Card>
  );
};

export default GaugeChartView2;
