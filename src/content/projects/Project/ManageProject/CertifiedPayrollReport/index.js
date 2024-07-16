import {
  // Autocomplete,
  Box,
  // Button,
  // Card,
  CircularProgress,
  // Grid,
  // Stack,
  // TextField,
  Typography
} from '@mui/material';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { DatePicker } from '@mui/lab';
import { GetAllClients } from 'src/api/projects/Project';
import { getFilePreSignedUrl } from 'src/api/projects/PayrollReports';
import DataTable from 'src/components/Table/Table';
import { Link as RouterLink } from 'react-router-dom';
import Text from 'src/components/Text';

const CertifiedPayrollReport = ({ projectId }) => {
  const { t } = useTranslation();
  // const [clientType, setClientType] = useState([]);
  // const [initialValues, setInitialValues] = useState({
  //   ClientTypeId: null,
  //   StartDate: null
  // });
  const [totalRecords, setTotalRecords] = useState(5);

  const staticData = [
    {
      "reportNumber": "05",
      "fileName": "05 Wanzek Construction WE 2-4-24.pdf",
      "partnerName": "Wanzek Construction",
      "weekEndingDate": "2-4-24"
    },
    {
      "reportNumber": "04",
      "fileName": "04 Wanzek Construction WE 1-28-24.pdf",
      "partnerName": "Wanzek Construction",
      "weekEndingDate": "1-28-24"
    },
    {
      "reportNumber": "03",
      "fileName": "03 Wanzek Construction WE 1-21-24.pdf",
      "partnerName": "Wanzek Construction",
      "weekEndingDate": "1-21-24"
    },
    {
      "reportNumber": "02",
      "fileName": "02 Wanzek Construction WE 1-14-24.pdf",
      "partnerName": "Wanzek Construction",
      "weekEndingDate": "1-14-24"
    },
    {
      "reportNumber": "01",
      "fileName": "01 Wanzek Construction WE 1-7-24.pdf",
      "partnerName": "Wanzek Construction",
      "weekEndingDate": "1-7-24"
    }]

  const handleDownload = (path) => {
    const key = `CertifiedPayrollReports/${path}`
    getFilePreSignedUrl(key)
      .then((res) => {
        const file = res.data
        const link = document.createElement('a');
        link.href = file;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      })
      .catch((e) => console.log(e))
      .finally(() => {
      });


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
      field: 'reportNumber',
      headerName: `Certified Report Number`,
      flex: 1.5,
      renderHeader: (params) => (
        <Typography
          variant="h5"
        >
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: 'fileName',
      headerName: `Certified Payroll File Name`,
      flex: 2,
      renderHeader: (params) => (
        <Typography
          variant="h5"
        >
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <Box
          component={RouterLink}
          to={"#"}
          onClick={()=>handleDownload(params.row.fileName)}
        >
          <Text color="darkblue">{params.row.fileName}</Text>
        </Box>
      )
    },

    {
      field: 'weekEndingDate',
      headerName: t('Week Ending Date'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    }
  ];

  // const handleClear = () => {
  //   setInitialValues({
  //     StartDate: null
  //   });
  // };

  const fetchAllClients = async (projectId) => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: '',
      projectId: projectId
    };
    await GetAllClients(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          // setClientType(
          //   res.data.data.map((item) => ({
          //     label: item.clientName,
          //     value: item.clientId
          //   }))
          // );
        } else if (res.data.data == null) {
          // setClientType([]);
        }
        setTotalRecords(3)
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (projectId) {
      fetchAllClients(projectId);
    }
  }, [projectId]);

  return (
    <>
      <Box>
        {projectId ? (
          <>
            {/* <Formik
              initialValues={initialValues}
              validationSchema={Yup.object().shape({
                ClientTypeId: Yup.object().nullable().required('Required'),
                StartDate: Yup.date().nullable().required(t('Required'))
              })}
              onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  if (projectId) {
                    const obj = {
                      projectId: projectId,
                      clientId: _values?.ClientTypeId?.value,
                      weekEndingDate: _values?.StartDate?.toISOString()
                    };

                    await generatePDF(obj)
                      .then((res) => {
                        if (res && res.status === 200) {
                          const binaryData = atob(res.data);
                          const arrayBuffer = new ArrayBuffer(binaryData.length);
                          const view = new Uint8Array(arrayBuffer);
                          for (let i = 0; i < binaryData.length; i++) {
                            view[i] = binaryData.charCodeAt(i);
                          }
                          const blob = new Blob([arrayBuffer], {
                            type: 'application/pdf'
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'CertifiedPayrollReport.pdf';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          resetForm();
                          setStatus({ success: true });
                          setSubmitting(false);
                          handleClear();
                        }
                      })
                      .catch((err) => {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                      });
                  }
                } catch (err) {
                  console.error(err);
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }}
            >
              {({
                errors,
                handleSubmit,
                isSubmitting,
                touched,
                values,
                setFieldValue
              }) => (
                <form onSubmit={handleSubmit}>
                  <Card sx={{ mx: 0, mb: 3 }}>
                    <Box p={2}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Autocomplete
                              id="ClientTypeId"
                              name="ClientTypeId"
                              options={clientType}
                              getOptionLabel={(option) => option.label || ''}
                              getOptionValue={(option) => option.value || ''}
                              value={values.ClientTypeId}
                              onChange={(event, newValue) => {
                                setFieldValue('ClientTypeId', newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Partner"
                                  variant="outlined"
                                  fullWidth
                                  error={Boolean(
                                    touched.ClientTypeId && errors.ClientTypeId
                                  )}
                                  helperText={
                                    touched.ClientTypeId && errors.ClientTypeId
                                  }
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DatePicker
                              value={values.StartDate}
                              onChange={(newValue) => {
                                setFieldValue('StartDate', newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  placeholder={t('Start Date')}
                                  error={Boolean(
                                    touched.StartDate && errors.StartDate
                                  )}
                                  helperText={
                                    touched.StartDate && errors.StartDate
                                  }
                                  InputProps={{
                                    ...params.InputProps,
                                    inputProps: {
                                      ...params.inputProps,
                                      placeholder: 'MM/DD/YYYY',
                                      mask: '__/__/____'
                                    }
                                  }}
                                />
                              )}
                              inputFormat="MM/dd/yyyy"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Stack direction="row" spacing={2} mt={1}>
                              <Button
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                                startIcon={
                                  isSubmitting ? (
                                    <CircularProgress size="1rem" />
                                  ) : null
                                }
                                color="primary"
                              >
                                {t('Generate')}
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>


                      </Stack>
                    </Box>
                  </Card>
                </form>
              )}
            </Formik> */}
            <DataTable
              data={staticData}
              columns={columns}
              totalRecords={totalRecords}
              page={0}
              limit={10}
            />
          </>
        ) : (
          <>
            <CircularProgress
              size="3rem"
              sx={{ display: 'flex', margin: '0 auto', my: 5 }}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default CertifiedPayrollReport;
