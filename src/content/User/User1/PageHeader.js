/* eslint-disable jsx-a11y/label-has-for */
import { Grid, Typography, Button } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Link as RouterLink } from 'react-router-dom';

function PageHeader({ heading, description, buttonHeading, pathname }) {
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {heading}
          </Typography>
          <Typography variant="subtitle2">{description}</Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            component={RouterLink}
            to={pathname}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {buttonHeading}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default PageHeader;
