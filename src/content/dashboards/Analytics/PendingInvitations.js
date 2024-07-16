import {
  CardContent,
  Avatar,
  Typography,
  ListItemAvatar,
  Card,
  ListItemText,
  ListItem,
  styled
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone';

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.primary.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const CardContentWrapper = styled(CardContent)(
  ({ theme }) => `
     padding: ${theme.spacing(2.5, 3, 3)};
  
     &:last-child {
     padding-bottom: 0;
     }
`
);

function PendingInvitations() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContentWrapper>
        <Typography variant="overline" fontSize={18} color="text.primary">
          {t(`Current `)}
          {t(`Status`)}
        </Typography>
        <ListItem
          disableGutters
          sx={{
            my: 1
          }}
          component="div"
        >
          <ListItemAvatar>
            <AvatarError variant="rounded">
              <BusinessTwoToneIcon fontSize="large" />
            </AvatarError>
          </ListItemAvatar>

          <ListItemText
            primary="Compliant"
            sx={{ color: 'green' }}
            primaryTypographyProps={{
              variant: 'h2',
              sx: {
                ml: 2
              },
              noWrap: true
            }}
          />
        </ListItem>
        {/* <ListItem
          disableGutters
          sx={{
            mt: 0.5,
            mb: 1.5
          }}
          component="div"
        >
          <ListItemText
            primary={
              <>
                <Link fontWeight="bold" href="#">
                  {t('See all invitations')}
                </Link>
                <Box
                  component="span"
                  sx={{
                    pl: 0.5
                  }}
                >
                  {t('not opened yet.')}
                </Box>
              </>
            }
            primaryTypographyProps={{ variant: 'body2', noWrap: true }}
          />
        </ListItem> */}
      </CardContentWrapper>
    </Card>
  );
}

export default PendingInvitations;
