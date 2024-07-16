import React from 'react';
import {
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const data = [
  {
    postion: 'Laborer',
    rate: '$17.20',
    fringe: '$2.19',
    totalHour: '$19.39',
    proposedHour: '$22.00',
    complaint: 'Yes',
    confidenceMatch: '90%'
  },
  {
    postion: 'Installer',
    rate: '$17.32',
    fringe: '$3.15',
    totalHour: '$20.47',
    proposedHour: '$23.00',
    complaint: 'Yes',
    confidenceMatch: '75%'
  },
  {
    postion: 'Equipment Operator',
    rate: '$18.27',
    fringe: '$2.50',
    totalHour: '$20.77',
    proposedHour: '$25.00',
    complaint: 'Yes',
    confidenceMatch: '65%'
  },
  {
    postion: 'PD-10 Operator',
    rate: '$18.27',
    fringe: '$2.50',
    totalHour: '$20.77',
    proposedHour: '$28.50',
    complaint: 'Yes',
    confidenceMatch: '55%'
  },
  {
    postion: 'Foreman',
    rate: 'N/A',
    fringe: 'N/A',
    totalHour: 'CLR Filed w/DOL',
    proposedHour: '$26.00',
    complaint: 'InProcess',
    confidenceMatch: '25% - CLR Pending'
  },
  {
    postion: 'Superintendent',
    rate: 'N/A',
    fringe: 'N/A',
    totalHour: 'CLR Filed w/DOL',
    proposedHour: '$42.00',
    complaint: 'InProcess',
    confidenceMatch: '18% - CLR Pending'
  },
  {
    postion: 'Safety Manager',
    rate: 'N/A',
    fringe: 'N/A',
    totalHour: 'CLR Filed w/DOL',
    proposedHour: '$39.00',
    complaint: 'InProcess',
    confidenceMatch: '26% - CLR Pending'
  }
];

const WoktForceTable = () => {
  const { t } = useTranslation();

  return (
    <Paper>
      <Stack
        p={2}
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
        alignItems="flex-start"
      >
        <Typography fontWeight="700" fontSize={18}>
          {t('Project Compliance: Confidence Match Score (%)')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography fontWeight="700" fontSize={16}>
            Working Hours: 253,440
          </Typography>
          <Typography fontWeight="700" fontSize={16}>
            Class Room Hours: 8,696
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: '100%' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '900', color: 'black' }}>
                Position
              </TableCell>
              <TableCell
                sx={{ fontWeight: '900', color: 'black' }}
                align="center"
              >
                PW Wage rate
              </TableCell>
              <TableCell
                sx={{ fontWeight: '900', color: 'black' }}
                align="center"
              >
                PW fringe
              </TableCell>
              <TableCell
                sx={{ fontWeight: '900', color: 'black' }}
                align="center"
              >
                PW total hourly comp
              </TableCell>
              <TableCell
                sx={{ fontWeight: '900', color: 'black' }}
                align="center"
              >
                market rate
              </TableCell>
              <TableCell
                sx={{ fontWeight: '900', color: 'black' }}
                align="center"
              >
                compliant
              </TableCell>
              <TableCell
                sx={{ fontWeight: '900', color: 'black' }}
                align="center"
              >
                <b>PW ai % confidence match</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.postion}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.postion}
                </TableCell>
                <TableCell align="center">{row.rate}</TableCell>
                <TableCell align="center">{row.fringe}</TableCell>
                <TableCell align="center">{row.totalHour}</TableCell>
                <TableCell align="center">{row.proposedHour}</TableCell>
                <TableCell align="center">{row.complaint}</TableCell>
                <TableCell align="center">
                  <b>{row.confidenceMatch}</b>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default WoktForceTable;
