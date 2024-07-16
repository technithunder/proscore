import React, { } from 'react';
import { Box, Button, Card, Divider } from '@mui/material';

const PayrollSummaryReport = () => {

  const handleDownload = () => {
    const filePath = '/static/images/Excel/EmployeePayrollsheet.xlsx';
    const downloadUrl = process.env.PUBLIC_URL + filePath;
    window.open(downloadUrl, '_blank');
  };

  

  return (
    <>
      <Card sx={{ mx: 0, mb: 3 }}>
        <Box p={2}>
          <Button className="primary" onClick={handleDownload}>
            Download Sample Excel
          </Button>
          <Button className="primary">
            Import Excel
          </Button>
          
        </Box>
        <Divider />
      </Card>
    </>
  );
};

export default PayrollSummaryReport;
