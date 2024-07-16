import React, { useCallback, useEffect, useState, forwardRef } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  Grid,
  Slide,
  TextField,
  Typography,
  styled
} from '@mui/material';
import DataTable from 'src/components/Table/Table';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useRefMounted from 'src/hooks/useRefMounted';
import { getPayrollSummaryReport } from 'src/api/projects/PayrollReports';
import { ReactSpreadsheetImport } from 'react-spreadsheet-import';
import { fieldsName } from './Data';
import { SubmitExcel } from 'src/api/projects/Project';
import { getAllClients } from 'src/api/project/projectEmployee';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const PayrollSummaryReport = ({ projectId }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoding] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const location = useLocation();
  const isMountedRef = useRefMounted();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [clients, setClients] = useState([]);
  const [isButton, setIsButton] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  // const [openAlert] = useState(true);
  const [message, setMessage] = useState('');

  const fetchAllPayrollReports = useCallback(async () => {
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getPayrollSummaryReport(obj, projectId)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
          console.log(res.data.data);
          setTotalRecords(res.data.totalRecords);
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoding(false);
      });
  }, [isMountedRef, page, limit, query]);

  useEffect(() => {
    setLoding(true);
    fetchAllPayrollReports();
    fetchAllClients();
  }, [getPayrollSummaryReport, page, limit, query, location.pathname]);

  const fetchAllClients = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllClients(obj, projectId)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setClients(
            res.data.data.map((item) => ({
              label: item.label,
              value: item.value
            }))
          );
        } else if (res.data.data == null) {
          setClients([]);
        }
      })
      .catch((e) => console.log(e));
  };

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

  const columns = [
    {
      field: 'partnerName',
      headerName: t('Partner Name'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'payrollNumber',
      headerName: `Payroll Number`,
      flex: 1,
      minWidth: 50,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'ref',
      headerName: `Payroll File Name`,
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box component={RouterLink} to={'#'}>
          <a href={params.row.path} color="darkblue" download>
            {params.row.ref}
          </a>
        </Box>
      )
    },
    {
      field: 'weekEndDate',
      headerName: t('Payroll Week Ending'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    }
  ];
  const handleDownload = () => {
    const filePath = '/static/images/Excel/EmployeePayrollsheet.xlsx';
    const downloadUrl = process.env.PUBLIC_URL + filePath;
    window.open(downloadUrl, '_blank');
  };

  const [datas, setDatas] = useState(fieldsName);

  console.log(setDatas);

  const fields = datas?.map((fieldName) => ({
    label: fieldName,
    key: fieldName,
    fieldType: {
      type: 'input'
    }
  }));
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialogpopup = () => {
    setIsOpen(true);
  };

  const handleCloseDialogpopup = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (data) => {
    console.log('Imported data:', data);
    console.log(data.all);
    const payload = {
      excelData: data.all
    };

    await SubmitExcel(payload, projectId, value?.value)
      .then((res) => {
        console.log(res);
        if (res.data.statusCode === 200) {
          setValue(null);
          handleOpenDialog();
          setMessage('Added Excel Data Successfully.');
        } else {
          setValue(null);
          setMessage(res.data.message);
          handleOpenDialog();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card sx={{ mx: 0, mb: 3 }}>
        <Box p={2}>
          <Grid container>
            <Grid item xs={12} md={4}>
              <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                  setIsButton(newValue !== null);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                options={clients}
                renderInput={(params) => (
                  <TextField {...params} label="Patners" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              {isButton && value !== null && (
                <>
                  <Button className="primary" onClick={handleDownload}>
                    Download Sample Excel
                  </Button>
                  <Button className="primary" onClick={handleOpenDialogpopup}>
                    Import Excel
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <ReactSpreadsheetImport
          isOpen={isOpen}
          onClose={handleCloseDialogpopup}
          onSubmit={handleSubmit}
          fields={fields}
        />
      </Card>
      <Card sx={{ mx: 0, mb: 3 }}>
        <Box p={2} />
        <Divider />
        <DataTable
          data={users}
          columns={columns}
          page={page}
          limit={limit}
          query={query}
          loading={loading}
          onQueryChange={handleQueryChange}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          totalRecords={totalRecords}
        />
      </Card>

      <DialogWrapper
        open={openDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
      >
        <Box
          sx={{
            px: 4,
            pb: 4,
            pt: 4
          }}
        >
          <Typography variant="h4">{message}</Typography>

          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleCloseDialog}
          >
            {t('Close')}
          </Button>
        </Box>
      </DialogWrapper>
    </>
  );
};

export default PayrollSummaryReport;
