import React, { useState } from 'react';
import {
  Button,
  Grid,
  TextField,
  Box,
  IconButton,
  Typography,
  Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

import DataTable from 'src/components/Table/Table';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

function WageRate() {
  // const navigation = useNavigate();
  // const formData = new FormData();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [totalRecords] = useState(3);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const [errors] = useState({});
  const [isSubmit] = useState(false);
  const [inputFields, setInputFields] = useState({
    start: '',
    end: '',
    wageRate: ''
  });

  const staticData = [
    {
      start: '0',
      end: '1000',
      wageRate: '$17.50'
    },
    {
      start: '1001',
      end: '2000',
      wageRate: '$19.50'
    },
    {
      start: '2001',
      end: '3000',
      wageRate: '$21.50'
    }
  ];

  const columns = [
    {
      field: 'start',
      headerName: t('Start'),
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'end',
      headerName: t('End'),
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'wageRate',
      headerName: t('Wage Rate'),
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'projectEmployeeId',
      headerName: 'Actions',
      flex: 1,
      disableColumnMenu: true,
      hideSortIcons: true,
      sortingOrder: false,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Tooltip title={t('Delete')} arrow>
            <IconButton
              onClick={() => handleConfirmDelete(params)}
              color="error"
            >
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const handleConfirmDelete = (params) => {
    console.log(params?.row?.employmentTermId);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    setDeleteLoading(true);
  };

  const handleChange = (e) => {
    console.log(e.target.name);
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  return (
    <>
      <form autoComplete="off">
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              name="start"
              helperText={errors.start}
              error={Boolean(errors.start)}
              value={inputFields['start']}
              onChange={handleChange}
              variant="outlined"
              label={t('Start')}
              placeholder={t('Start')}
              type="number"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              name="end"
              helperText={errors.end}
              error={Boolean(errors.end)}
              value={inputFields['end']}
              onChange={handleChange}
              variant="outlined"
              label={t('End')}
              placeholder={t('End')}
              type="number"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              name="wageRate"
              helperText={errors.wageRate}
              error={Boolean(errors.wageRate)}
              value={inputFields['wageRate']}
              onChange={handleChange}
              variant="outlined"
              label={t('Wage Rate')}
              placeholder={t('Wage Rate')}
              type="number"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              disableElevation
              disabled={isSubmit}
              type="submit"
              variant="contained"
              color="primary"
            >
              <AddIcon />
            </Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <DataTable
              data={staticData}
              columns={columns}
              page={page}
              limit={limit}
              query={query}
              onQueryChange={handleQueryChange}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              deleteLoading={deleteLoading}
              openConfirmDelete={openConfirmDelete}
              closeConfirmDelete={closeConfirmDelete}
              handleDeleteCompleted={handleDeleteCompleted}
              handleDeleteSelected={() => setOpenConfirmDelete(true)}
              totalRecords={totalRecords}
            />
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default WageRate;
