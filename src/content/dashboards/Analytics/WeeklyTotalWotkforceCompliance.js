import { Card, Typography, Box, useTheme, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import GaugeChart from 'react-gauge-chart';

function CpuUsage() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <Grid item sm={3} xs={12}>
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
              {t('Worker')}
            </Typography>

            <GaugeChart
              nrOfLevels={3}
              colors={['red', 'yellow', 'green']}
              arcWidth={0.4}
              percent={0.65}
              arcPadding={0.0}
              fontSize="14"
              textColor={'black'}
            />

            <Typography align="center" variant="h3">
              75%
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid item sm={3} xs={12}>
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
              {t('Worker')}
            </Typography>

            <GaugeChart
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
              percent={0.75}
            />

            <Typography align="center" variant="h1">
              75%
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid item sm={3} xs={12}>
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
              {t('Worker')}
            </Typography>

            <GaugeChart
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
              percent={0.75}
            />

            <Typography align="center" variant="h1">
              75%
            </Typography>
          </Box>
        </Card>
      </Grid>
    </>
  );
}

export default CpuUsage;
