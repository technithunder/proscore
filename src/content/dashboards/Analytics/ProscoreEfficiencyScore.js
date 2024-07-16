import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    CardContent,
    CardHeader,
    Divider,
    Card
  } from '@mui/material';

function createData(position, wagerate, fringe, thc, pthc,comp,pwai) {
  return { position, wagerate, fringe, thc, pthc,comp,pwai };
}

const rows = [
  createData('Laborers', '$16.20', '$3.80', '$20.00', '$21.00','Yes', '40%'),
  createData('Skid/Lul l', '$20.22','$4.41', '$24.63', '$45.00','Yes','44%'),
  createData('Pile', '$34.21','$14.25', '$48.46', '$45.00','Yes','44%'),
];

export default function ProscoreEfficiencyScore() {
  return (
    <Card>
      <CardHeader title={('Weekly Total Wotkforce Compliance')} />
      <Divider />
      <CardContent>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Position</TableCell>
            <TableCell align="right">Wage Rate</TableCell>
            <TableCell align="right">Fringe</TableCell>
            <TableCell align="right">Total Hourly Comp</TableCell>
            <TableCell align="right">Proposed Total Hourly Comp</TableCell>
            <TableCell align="right">Compliant</TableCell>
            <TableCell align="right">PW AI % Confidence Match</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.position}
              </TableCell>
              <TableCell align="right">{row.wagerate}</TableCell>
              <TableCell align="right">{row.fringe}</TableCell>
              <TableCell align="right">{row.thc}</TableCell>
              <TableCell align="right">{row.pthc}</TableCell>
              <TableCell align="right">{row.comp}</TableCell>
              <TableCell align="right">{row.pwai}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </CardContent>
    </Card>
  );
}