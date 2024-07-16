import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  Paper,
  Slide,
  Typography,
  styled
} from '@mui/material';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { ReactSpreadsheetImport } from 'react-spreadsheet-import';
import { timeSheetData } from './TimeSheet';
import { SubmitTimeSheetExcel } from 'src/api/projects/Project';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  getProjectPayrollTimeSheet,
  getProjectTimeSheet
} from 'src/api/projects/TimeSheet';
import useRefMounted from 'src/hooks/useRefMounted';
import { useLocation } from 'react-router-dom';
import DataTable from 'src/components/Table/Table';

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

const TimeSheet = ({ projectId }) => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [datass, setData] = useState([]);
  const location = useLocation();
  const isMountedRef = useRefMounted();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoding] = useState(false);
  const [totalRecords, setTotalRecords] = useState();

  const getProjectEmployees = useCallback(async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: false,
      searchString: ''
    };
    await getProjectTimeSheet(obj, projectId)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  }, [isMountedRef]);

  useEffect(() => {
    getProjectEmployees();
  }, [getProjectTimeSheet, location.pathname]);

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

  const [datas, setDatas] = useState(timeSheetData);

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (data, selectedFile) => {
    console.log(data.all);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64String = reader.result.split(',')[1];

      const payload = {
        fileModel: {
          base64String: base64String,
          fileName: selectedFile.name
        },
        excelData: data.all
      };

      await SubmitTimeSheetExcel(payload, projectId)
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleOpenDialog();
            setMessage('Added Excel Data Successfully.');
          } else {
            setMessage(res.data.message);
            handleOpenDialog();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    // Define a function to handle errors if any occur during file reading
    reader.onerror = (error) => {
      console.error('Error occurred while reading the file:', error);
    };

    // Read the contents of the selected file as a data URL (which includes base64 representation)
    reader.readAsDataURL(selectedFile);
  };

  const handlePayrollTimeSheet = async (id) => {
    setLoding(true);
    if (id) {
      let obj = {
        pageIndex: page + 1,
        pageSize: limit,
        orderByAscending: false,
        searchString: query
      };
      await getProjectPayrollTimeSheet(obj, id)
        .then((res) => {
          if (res.data.data == null) {
            setLoding(false);
            setData([]);
          } else {
            setData(res.data.data);
            setLoding(false);
            setTotalRecords(res.data.totalRecords);
          }
        })
        .catch((e) => console.log(e));
    }
  };

  const handleExcelDownload = (event, path) => {
    event.stopPropagation();
    const file = path;
    const link = document.createElement('a');
    link.href = file;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const columns = [
    {
      field: 'firstName',
      headerName: t('First Name'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'lastName',
      headerName: t('Last Name'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'position',
      headerName: t('Position'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'regularHours',
      headerName: t('Regular Hours'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'regularTotal',
      headerName: t('Regular Total'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'overTimePayRate',
      headerName: t('Over Time Pay Rate'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'overTimeHours',
      headerName: t('Over Time Hours'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'perDiem',
      headerName: t('PerDiem'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'totalHours',
      headerName: t('Total Hours'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'totalPay',
      headerName: t('Total Pay'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    }
  ];

  return (
    <>
      <Card sx={{ mx: 0, mb: 3 }}>
        <Box p={2}>
          <Button className="primary" onClick={handleOpenDialogpopup}>
            Import Excel
          </Button>
        </Box>
        <Divider />
        <ReactSpreadsheetImport
          isOpen={isOpen}
          onClose={handleCloseDialogpopup}
          onSubmit={handleSubmit}
          fields={fields}
        />
      </Card>
      <Paper>
        {users?.map((data, ind) => {
          return (
            <Accordion key={ind}>
              <AccordionSummary
                onClick={() =>
                  handlePayrollTimeSheet(data?.payrollTimeSheetReportId)
                }
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  color="darkblue"
                  sx={{ textDecorationLine: 'underline' }}
                  onClick={(event) => handleExcelDownload(event, data?.path)}
                >
                  {data?.fileName}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DataTable
                  data={datass}
                  columns={columns}
                  totalRecords={totalRecords}
                  page={page}
                  limit={limit}
                  query={query}
                  loading={loading}
                  onQueryChange={handleQueryChange}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Paper>
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

export default TimeSheet;
