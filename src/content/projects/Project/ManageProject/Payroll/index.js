import React from 'react';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';

const Payroll = () => {
  return (
    <>
      <Paper>
        <Box p={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4" fontWeight="700" textTransform="uppercase">
              Certified payroll
            </Typography>
          </Stack>
        </Box>
        <Divider />
      </Paper>
    </>
  );
};

export default Payroll;
