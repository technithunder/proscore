import {
  CardHeader,
  Divider,
  CardContent,
  Box,
  Typography,
  Card,
  ListItemText,
  List,
  ListItem
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import Label from 'src/components/Label';

function LandingPages({ title, projectId }) {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardHeader
        title={
          <Box>
            <Typography fontSize={18} fontWeight={600}>{`${title}`}</Typography>
            <Typography>{`Project ID: ${projectId}`}</Typography>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        <List component="div" disablePadding>
          <ListItem
            sx={{
              display: { xs: 'block', sm: 'flex' }
            }}
            disableGutters
            alignItems="flex-start"
            component="div"
          >
            <ListItemText
              primary="Scheduled ST vs Completed ST"
              primaryTypographyProps={{
                variant: 'h6',
                sx: {
                  mt: 1
                },
                gutterBottom: true,
                noWrap: true
              }}
              secondaryTypographyProps={{ variant: 'h3', noWrap: true }}
              secondary={
                <Box
                  sx={{
                    mt: 1,
                    flexDirection: 'row',
                    display: 'flex'
                  }}
                >
                  <Box
                    sx={{
                      mr: 2
                    }}
                  >
                    <Typography
                      component="div"
                      variant="body2"
                      gutterBottom
                      fontSize={15}
                      color="black"
                    >
                      {t('Scheduled ST')}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography
                        component="div"
                        variant="h3"
                        sx={{
                          mr: 1
                        }}
                      >
                        140 Hrs
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      component="div"
                      variant="body2"
                      gutterBottom
                      fontSize={15}
                      color="black"
                    >
                      {t('Completed ST')}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
                    >
                      <Typography component="div" variant="h3">
                        94.28%
                      </Typography>

                      <Label color="success">133 Hrs</Label>
                    </Box>
                  </Box>
                </Box>
              }
            />
          </ListItem>
          <Divider
            sx={{
              my: 1
            }}
          />
          <ListItem
            sx={{
              display: { xs: 'block', sm: 'flex' }
            }}
            disableGutters
            alignItems="flex-start"
            component="div"
          >
            <ListItemText
              primary="LW OTJ Hours vs WPC"
              primaryTypographyProps={{
                variant: 'h6',
                sx: {
                  mt: 1
                },
                gutterBottom: true,
                noWrap: true
              }}
              secondaryTypographyProps={{ variant: 'h3', noWrap: true }}
              secondary={
                <Box
                  sx={{
                    mt: 1,
                    flexDirection: 'row',
                    display: 'flex'
                  }}
                >
                  <Box
                    sx={{
                      mr: 2
                    }}
                  >
                    <Typography
                      component="div"
                      variant="body2"
                      gutterBottom
                      fontSize={15}
                      color="black"
                    >
                      {t('Last week OTJ ')}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography component="div" variant="h3">
                        574 Hrs
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      component="div"
                      variant="body2"
                      gutterBottom
                      fontSize={15}
                      color="black"
                    >
                      {t('WPC')}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
                    >
                      <Typography
                        component="div"
                        variant="h3"
                        sx={{
                          mr: 1
                        }}
                      >
                        56,000
                      </Typography>
                      <Label color="success">1.02%</Label>
                    </Box>
                  </Box>
                </Box>
              }
            />
          </ListItem>
          <Divider
            sx={{
              my: 1
            }}
          />
        </List>
      </CardContent>
    </Card>
  );
}

export default LandingPages;
