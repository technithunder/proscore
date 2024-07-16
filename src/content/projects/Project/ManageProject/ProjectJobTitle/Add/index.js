import React, { useState, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Box,
  Grid,
  Stack,
  TextField,
  CircularProgress,
  Zoom,
  Typography,
  Divider,
  Autocomplete,
  FormControlLabel,
  Tooltip,
  Switch,
  styled,
  IconButton,
  Modal,
  Alert,
  AlertTitle,
  Checkbox
} from '@mui/material';
import {
  getProjectPerDiem,
  addNewProjectJobTitle,
  updateProjectJobTitle,
  getProjectJobTitle,
  getAllJobTitles,
  getRapidCode,
  getPWCToken,
  getProjectWiseCountryAndState,
  getAllAssignRAPDropDown,
  getAllAssignRAPWageScaleDropDown
} from 'src/api/projects/ProjectJobTitle';
// import { AlphaNumeric } from 'src/constants/validations';
import HelpIcon from '@mui/icons-material/Help';

import Logo from 'src/components/LogoSign';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: '8px 8px 30px ',
  borderRadius: '10px'
};

const AddProjectJobTitle = ({
  id,
  projectJobTitleId,
  onCancelProjectJobTitleForm,
  onClick
}) => {
  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5
        }
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff'
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600]
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
      }
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500
      })
    }
  }));

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState([]);
  const [jobTitleChat, setJobTitleChat] = useState(null);
  const [chatBotFringes, setChatBotFringes] = useState(null);
  const [chatBotRates, setChatBotRates] = useState(null);
  const [chatBotMatchScore, setChatBotMatchScore] = useState(null);
  const [isWagesLoader, setIsWagesLoader] = useState(false);
  const [chatBotAccessToken, setChatBotAccessToken] = useState(null);
  const [chatbotState, setChatbotState] = useState(null);
  const [chatbotCounty, setChatbotCounty] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isShowWarnigMsg, setIsShowWarnigMsg] = useState(false);
  const [chatbotJobTitle, setChatbotJobTitle] = useState({});
  const [marketRates, setMarketRates] = useState({});
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [assignRAPInfoGuids, setAssignRAPInfoGuids] = useState([]);
  const [assignRAPWageScaleGuids, setAssignRAPWageScaleGuids] = useState([]);
  const ws = useRef(null);

  const [initialValues, setInitialValues] = useState({
    projectId: id,
    jobTitleId: null,
    jobDescription: '',
    numberOfPositions: null,
    pWTitle: '',
    wageRate: null,
    fringe: null,
    perDiem: null,
    titleMatch: null,
    pwTotalHourlyComp: null,
    pwAiConfidenceMatchScore: null,
    marketRate: null,
    OnetCode: null,
    Compliant: 'Yes',
    rapidCode: '',
    journeyWorkersWage: null,
    externalJobTitle: null,
    isCraftorTradeLabor: false,
    isAdministrativeRole: false,
    isExternalJobTitle: false,
    payTypePosition: null,
    salaryAmount: null,
    isApprenticeable: false,
    assignRAPInfoGuid: null,
    assignRAPWageScaleGuid: null
  });

  const titleMatchOptions = [
    { label: 'Direct', value: '1' },
    { label: 'Indirect', value: '2' }
  ];

  const payTypePosition = [
    { label: 'Hourly', value: 'Hourly' },
    { label: 'Salary', value: 'Salary' }
  ];

  const fetchJobTitles = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ' '
    };
    let temp = [];
    let marketRates = {};
    await getAllJobTitles(obj)
      .then((res) => {
        if (res) {
          res.data.data.forEach((e) => {
            temp.push({
              label: e.jobTitleName,
              value: e.jobTitleId
            });
          });
          setJobTitle(temp);
          res.data.data.forEach((e) => {
            marketRates[e.jobTitleId] = e.marketRate;
          });
          setMarketRates(marketRates);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllAssignRAPDropDown = async () => {
    let temp = [];
    await getAllAssignRAPDropDown()
      .then((res) => {
        if (res) {
          res.data.data.forEach((e) => {
            temp.push({
              label: e.jobTitleName,
              value: e.assignRAPInfoId
            });
          });
          setAssignRAPInfoGuids(temp);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllAssignRAPWageScaleDropDown = async (rapInfoId) => {
    let temp = [];
    await getAllAssignRAPWageScaleDropDown(rapInfoId)
      .then((res) => {
        if (res) {
          res.data.data.forEach((e) => {
            temp.push({
              label: e.wageScaleTitle,
              value: e.assignRAPWageScaleId
            });
          });
          setAssignRAPWageScaleGuids(temp);
        }
      })
      .catch((e) => console.log(e));
  };

  const handleOpen = (jobTitle) => {
    setOpen(true);
    const chatbotUrl = `wss://pwcapi.proscore.ai/chatbot/${chatBotAccessToken}?state=${chatbotState}&county=${chatbotCounty}&construction_type=heavy&job_title=${jobTitle}&job_description`;
    ws.current = new WebSocket(chatbotUrl);

    ws.current.addEventListener('open', () => {
      console.log('WebSocket connection opened');
    });
    setChatBotFringes(null);
    setChatBotRates(null);
    setIsWagesLoader(true);
    ws.current.addEventListener('message', (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log('Received message:', receivedMessage);
      if (receivedMessage?.response_type === 'options') {
        if (receivedMessage.options.lenght !== 0) {
          let temp = [];
          receivedMessage.options?.forEach((title, index) => {
            if (title !== 'n') {
              temp.push({
                label: title,
                value: (index + 1).toString()
              });
            }
          });
          setMessages(temp);
          setIsWagesLoader(false);
        } else {
          setIsWagesLoader(false);
        }
      } else if (receivedMessage?.response_type === 'final_answer') {
        setChatBotFringes(
          Number(receivedMessage?.final_answer?.wages?.fringes).toFixed(2)
        );
        setChatBotRates(
          Number(receivedMessage?.final_answer?.wages?.rates).toFixed(2)
        );
        setChatBotMatchScore(receivedMessage?.final_answer?.match_confidence);
        setIsWagesLoader(false);
      } else if (receivedMessage?.response_type === 'error') {
        setErrorMsg(receivedMessage?.error);
        setIsWagesLoader(false);
      }
    });

    ws.current.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });
  };

  const handleClose = () => {
    setOpen(false);
    if (ws.current) {
      ws.current.close();
    }
    setChatBotMatchScore(null);
    setMessages([]);
    setJobTitleChat(null);
    setErrorMsg(null);
  };

  const handleChatbotSubmit = () => {
    if (chatBotRates) {
      setLoading(true);
      setInitialValues((prevData) => ({
        ...prevData,
        wageRate: chatBotRates,
        fringe: chatBotFringes,
        jobTitleId: chatbotJobTitle,
        pwAiConfidenceMatchScore: chatBotMatchScore
      }));
      setOpen(false);
      if (ws.current) {
        ws.current.close();
      }
      setChatBotMatchScore(null);
      setMessages([]);
      setErrorMsg(null);
      setJobTitleChat(null);
      setTimeout(() => {
        setLoading(false);
      }, '100');
    } else {
      console.log('Wait for few seconds! Loading Rates.');
    }
  };

  useEffect(() => {
    setLoading(true);
    GetPWCToken();
    GetProjectWiseCountryAndState();
    GetProjectJobTitle();
    fetchJobTitles();
    fetchAllAssignRAPDropDown();
  }, [initialValues.perDiem]);

  const GetProjectJobTitle = async () => {
    if (projectJobTitleId) {
      await getProjectJobTitle(projectJobTitleId.projectJobTitleId)
        .then((res) => {
          if (res) {
            setInitialValues({
              projectId: id,
              jobTitleId: res.data.data.jobTitleDropdown,
              jobDescription: res.data.data.jobDescription,
              numberOfPositions: res.data.data.numberOfPositions,
              pWTitle: res.data.data.pWTitle,
              wageRate: res.data.data.wageRate,
              fringe: res.data.data.fringe,

              perDiem: res.data.data.perDiem,
              titleMatch:
                res.data.data.titleMatch != null
                  ? titleMatchOptions.filter(
                      (x) => x.value === res.data.data.titleMatch
                    )[0]
                  : null,
              pwTotalHourlyComp: res.data.data.pwTotalHourlyComp,
              pwAiConfidenceMatchScore: res.data.data.pwAiConfidenceMatchScore,
              marketRate: res.data.data.marketRate,
              rapidCode: res.data.data.onetCode,
              journeyWorkersWage: res.data.data.journeyWorkersWage,
              externalJobTitle: res.data.data.externalJobTitle,
              isCraftorTradeLabor: res.data.data.isCraftOrTradeLabor,
              isAdministrativeRole: res.data.data.isAdministrativeRole,
              isExternalJobTitle: res.data.data.isExternalJobTitle,
              payTypePosition:
                res.data.data.payTypePosition != null
                  ? payTypePosition.filter(
                      (x) => x.value === res.data.data.payTypePosition
                    )[0]
                  : null,
              salaryAmount: res.data.data.salaryAmount,
              isApprenticeable: res.data.data?.isApprenticeable,
              assignRAPInfoGuid: res.data.data?.assignRAPInfoDropdown,
              assignRAPWageScaleGuid: res.data.data?.assignRAPWageScaleDropdown
            });
            // if (res.data.data.isPWJobTitle === true) {
            //   setShowFields(true);
            // } else {
            //   setShowFields(false);
            // }
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    } else {
      await getProjectPerDiem(id)
        .then((res) => {
          initialValues.perDiem = res.data;
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    console.log(initialValues.rapidCode);
  }, [initialValues.rapidCode]);

  const GetRapidCode = async (obj) => {
    await getRapidCode(obj?.value)
      .then((res) => {
        if (res) {
          let field = { rapidCode: res.data };
          setInitialValues((prevState) => ({
            ...prevState, // Spread the previous state
            field // Apply the changes from newData
          }));
        }
      })
      .catch((e) => console.log(e));
  };

  const GetPWCToken = async () => {
    const payload = {
      UserName: 'ProscoreAI',
      Password: 'XcvMj1Xd'
    };
    await getPWCToken(payload)
      .then((res) => {
        setChatBotAccessToken(res?.data?.access_token);
      })
      .catch((e) => console.log(e));
  };

  const GetProjectWiseCountryAndState = async () => {
    await getProjectWiseCountryAndState(id)
      .then((res) => {
        setChatbotState(res.data.data?.state);
        setChatbotCounty(res.data.data?.county);
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          sx={{ padding: '5px' }}
        >
          <Box sx={style}>
            <Box style={styles.header}>
              <Box>
                <Logo />
              </Box>
            </Box>
            {messages?.length === 0 ? (
              <></>
            ) : (
              <Box sx={{ m: 5, height: 100, align: 'center' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: '12px !important' }}
                    >
                      Please select a detail job title
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Autocomplete
                      id="jobTitleChat"
                      name="jobTitleChat"
                      options={messages}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={jobTitleChat}
                      onChange={(event, newValue) => {
                        setJobTitleChat(newValue);
                        setIsWagesLoader(true);
                        ws.current.send(newValue.value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Job Title Options"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {isWagesLoader ? (
              <Box
                sx={{
                  m: 5,
                  height: 100,
                  textAlign: 'center'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <CircularProgress />
                  </Grid>
                </Grid>
              </Box>
            ) : chatBotFringes ? (
              <Box sx={{ m: 5, height: 100, textAlign: 'center' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: '12px !important' }}
                    >
                      Fringes - ${chatBotFringes}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: '12px !important' }}
                    >
                      Rates - ${chatBotRates}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: '12px !important' }}
                    >
                      AI Match Score - {chatBotMatchScore}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{ m: 5, height: 100, textAlign: 'center' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: '12px !important' }}
                    >
                      {errorMsg || 'No Fringes and Rates!'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ marginRight: '10px' }}
                onClick={handleChatbotSubmit}
              >
                Submit
              </Button>
              <Button variant="outlined" size="small" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>

      <Card sx={{ mx: 0, mb: 3 }}>
        <Box p={2}>
          {loading ? (
            <>
              <CircularProgress
                size="3rem"
                sx={{ display: 'flex', margin: '0 auto', my: 5 }}
              />
            </>
          ) : (
            <>
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                  jobTitleId: Yup.object().nullable().required(t('Required')),
                  // perDiem: Yup.number().required(t('Required')),
                  numberOfPositions: Yup.string()
                    .nullable()
                    .matches('^[1-9][0-9]*$', 'Enter valid number of position'),
                  perDiem: Yup.string()
                    .nullable()
                    .matches(/^(?:\d+|\d+\.\d{1,2})$/, 'Enter valid per diem'),
                  wageRate: Yup.string()
                    .nullable()
                    .matches(/^(?:\d+|\d+\.\d{1,2})$/, 'Enter valid wage rate'),
                  fringe: Yup.string()
                    .nullable()
                    .matches(/^(?:\d+|\d+\.\d{1,2})$/, 'Enter valid fringe'),
                  marketRate: Yup.string()
                    .nullable()
                    .matches(
                      /^(?:\d+|\d+\.\d{1,2})$/,
                      'Enter valid market rate'
                    ),
                  pwTotalHourlyComp: Yup.string()
                    .nullable()
                    .matches(
                      /^(?:\d+|\d+\.\d{1,2})$/,
                      'Enter valid PW total hourly comp'
                    ),
                  salaryAmount: Yup.string()
                    .nullable()
                    .matches(
                      /^(?:\d+|\d+\.\d{1,2})$/,
                      'Enter valid salary amount'
                    ),
                  pwAiConfidenceMatchScore: Yup.string()
                    .nullable()
                    .matches(
                      /^(100|[1-9]?\d(\.\d{1,2})?)$/,
                      'Enter valid AI % confidence score'
                    )
                })}
                onSubmit={async (
                  _values,
                  { resetForm, setErrors, setStatus, setSubmitting }
                ) => {
                  if (
                    chatBotRates === null ||
                    (_values?.wageRate >= chatBotRates &&
                      _values?.fringe >= chatBotFringes)
                  ) {
                    try {
                      const obj = {
                        projectId: id,
                        jobTitleId: _values?.jobTitleId?.value,
                        jobDescription: _values?.jobDescription,
                        numberOfPositions: _values?.numberOfPositions,
                        pWTitle: _values?.pWTitle,
                        wageRate: _values?.wageRate,
                        fringe: _values?.fringe
                          ? _values?.fringe.toString()
                          : null,
                        perDiem:
                          _values?.perDiem === '' ? null : _values?.perDiem,
                        titleMatch: _values?.titleMatch?.value,
                        pwTotalHourlyComp: _values?.pwTotalHourlyComp,
                        pwAiConfidenceMatchScore:
                          _values?.pwAiConfidenceMatchScore,
                        marketRate: _values?.marketRate,
                        onetCode: _values?.rapidCode,
                        compliant: 'Yes',
                        journeyWorkersWage: _values?.journeyWorkersWage,
                        externalJobTitle: _values?.externalJobTitle,
                        isCraftOrTradeLabor: _values?.isCraftorTradeLabor,
                        isAdministrativeRole: _values?.isAdministrativeRole,
                        isExternalJobTitle: _values?.isExternalJobTitle,
                        payTypePosition: _values?.payTypePosition?.value,
                        salaryAmount: _values?.salaryAmount,
                        isApprenticeable: _values?.isApprenticeable,
                        assignRAPInfoGuid: _values?.assignRAPInfoGuid?.value,
                        assignRAPWageScaleGuid:
                          _values?.assignRAPWageScaleGuid?.value
                      };
                      console.log(_values);

                      if (projectJobTitleId) {
                        obj['projectJobTitleId'] =
                          projectJobTitleId.projectJobTitleId;
                        await updateProjectJobTitle(obj)
                          .then((res) => {
                            if (res.data) {
                              onClick();
                              resetForm();
                              setStatus({ success: true });
                              setSubmitting(false);

                              enqueueSnackbar(
                                t('Record updated Successfully'),
                                {
                                  variant: 'success',
                                  anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'right'
                                  },

                                  TransitionComponent: Zoom
                                }
                              );
                            }
                          })
                          .catch((err) => {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                          });
                      } else {
                        await addNewProjectJobTitle(obj)
                          .then((res) => {
                            if (res.data) {
                              onClick();
                              resetForm();
                              setStatus({ success: true });
                              setSubmitting(false);

                              enqueueSnackbar(t('Record added Successfully'), {
                                variant: 'success',
                                anchorOrigin: {
                                  vertical: 'top',
                                  horizontal: 'right'
                                },

                                TransitionComponent: Zoom
                              });
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
                  } else {
                    setSubmitting(false);
                    setIsShowWarnigMsg(true);
                    setTimeout(() => {
                      setIsShowWarnigMsg(false);
                    }, '10000');
                  }
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
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
                          <Typography
                            variant="h4"
                            fontWeight="700"
                            textTransform="uppercase"
                          >
                            Job Detail
                          </Typography>
                        </Stack>
                      </Box>
                      <Divider />
                      <Box p={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={12}>
                            <FormControlLabel
                              value={values.isExternalJobTitle}
                              name="isExternalJobTitle"
                              onChange={(event, newValue) => {
                                setFieldValue('isExternalJobTitle', newValue);
                                if (values.isExternalJobTitle) {
                                  setFieldValue('jobTitleId', null);
                                }
                              }}
                              control={
                                <IOSSwitch
                                  sx={{ m: 1 }}
                                  checked={values.isExternalJobTitle}
                                />
                              }
                              label="External Job Title"
                            />
                          </Grid>
                          {values.isExternalJobTitle === true ? (
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="externalJobTitle"
                                helperText={
                                  touched.externalJobTitle &&
                                  errors.externalJobTitle
                                }
                                error={Boolean(
                                  touched.externalJobTitle &&
                                    errors.externalJobTitle
                                )}
                                value={values.externalJobTitle}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('External Job Title')}
                                placeholder={t('External Job Title')}
                              />
                            </Grid>
                          ) : (
                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="jobTitleId"
                                name="jobTitleId"
                                options={jobTitle}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                value={values.jobTitleId}
                                onChange={(event, newValue) => {
                                  GetRapidCode(newValue);
                                  if (newValue && values.isCraftorTradeLabor) {
                                    handleOpen(newValue.label);
                                  }
                                  setFieldValue('jobTitleId', newValue);
                                  if (newValue) {
                                    setChatbotJobTitle(newValue);
                                    console.log(
                                      'marketRates[newValue?.value]--',
                                      marketRates
                                    );
                                    setFieldValue(
                                      'marketRate',
                                      marketRates[newValue?.value]
                                    );
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Job Title"
                                    variant="outlined"
                                    fullWidth
                                    error={Boolean(
                                      touched.jobTitleId && errors.jobTitleId
                                    )}
                                    helperText={
                                      touched.jobTitleId && errors.jobTitleId
                                    }
                                  />
                                )}
                              />
                            </Grid>
                          )}

                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              name="numberOfPositions"
                              helperText={
                                touched.numberOfPositions &&
                                errors.numberOfPositions
                              }
                              error={Boolean(
                                touched.numberOfPositions &&
                                  errors.numberOfPositions
                              )}
                              value={values.numberOfPositions}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              label={t('Number Of Position')}
                              placeholder={t('Number Of Position')}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              name="jobDescription"
                              helperText={
                                touched.jobDescription && errors.jobDescription
                              }
                              error={Boolean(
                                touched.jobDescription && errors.jobDescription
                              )}
                              type="text"
                              value={values.jobDescription}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              label={t('Job Description')}
                              placeholder={t('Job Description')}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Grid item xs={12} md={12}>
                              <FormControlLabel
                                value={values.isCraftorTradeLabor}
                                name="isCraftorTradeLabor"
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'isCraftorTradeLabor',
                                    newValue
                                  );
                                  if (
                                    newValue &&
                                    values.jobTitleId &&
                                    !values.isExternalJobTitle
                                  ) {
                                    handleOpen(values.jobTitleId.label);
                                  }
                                }}
                                control={
                                  values.isAdministrativeRole ? (
                                    <IOSSwitch
                                      disabled
                                      sx={{ m: 1 }}
                                      checked={values.isCraftorTradeLabor}
                                    />
                                  ) : (
                                    <IOSSwitch
                                      sx={{ m: 1 }}
                                      checked={values.isCraftorTradeLabor}
                                    />
                                  )
                                }
                                label="Is this position a Craft / Trade Labor Position?"
                              />
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <FormControlLabel
                                value={values.isAdministrativeRole}
                                name="isAdministrativeRole"
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'isAdministrativeRole',
                                    newValue
                                  );
                                }}
                                control={
                                  values.isCraftorTradeLabor ? (
                                    <IOSSwitch
                                      disabled
                                      sx={{ m: 1 }}
                                      checked={values.isAdministrativeRole}
                                    />
                                  ) : (
                                    <IOSSwitch
                                      sx={{ m: 1 }}
                                      checked={values.isAdministrativeRole}
                                    />
                                  )
                                }
                                label="Is this an Administrative or Support role?"
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={(event) =>
                                    setFieldValue(
                                      'isApprenticeable',
                                      event.target.checked
                                    )
                                  }
                                  checked={values.IsApprenticeable}
                                  name="isApprenticeable"
                                />
                              }
                              label="Is Apprenticeable"
                            />
                          </Grid>

                          <Grid item xs={12} md={5}>
                            <Autocomplete
                              id="payTypePosition"
                              name="payTypePosition"
                              options={payTypePosition}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                              value={values.payTypePosition}
                              onChange={(event, newValue) => {
                                setFieldValue('payTypePosition', newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Pay Type"
                                  variant="outlined"
                                  fullWidth
                                  error={Boolean(
                                    touched.payTypePosition &&
                                      errors.payTypePosition
                                  )}
                                  helperText={
                                    touched.payTypePosition &&
                                    errors.payTypePosition
                                  }
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={1}>
                            <Tooltip title="Consider creating separate job entries for roles that involve both hourly and salary-based pay structures. This ensures accurate tracking and simplifies payroll management.">
                              <IconButton>
                                <HelpIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          {values.isApprenticeable ? (
                            <>
                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  id="assignRAPInfoGuid"
                                  name="assignRAPInfoGuid"
                                  options={assignRAPInfoGuids}
                                  getOptionLabel={(option) => option.label}
                                  getOptionValue={(option) => option.value}
                                  value={values.assignRAPInfoGuid}
                                  onChange={(event, newValue) => {
                                    setFieldValue(
                                      'assignRAPInfoGuid',
                                      newValue
                                    );
                                    if (newValue) {
                                      fetchAllAssignRAPWageScaleDropDown(
                                        newValue?.value
                                      );
                                    } else {
                                      setAssignRAPWageScaleGuids([]);
                                      setFieldValue(
                                        'assignRAPWageScaleGuid',
                                        null
                                      );
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="RAP"
                                      variant="outlined"
                                      fullWidth
                                      error={Boolean(
                                        touched.assignRAPInfoGuid &&
                                          errors.assignRAPInfoGuid
                                      )}
                                      helperText={
                                        touched.assignRAPInfoGuid &&
                                        errors.assignRAPInfoGuid
                                      }
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  id="assignRAPWageScaleGuid"
                                  name="assignRAPWageScaleGuid"
                                  options={assignRAPWageScaleGuids}
                                  getOptionLabel={(option) => option.label}
                                  getOptionValue={(option) => option.value}
                                  value={values.assignRAPWageScaleGuid}
                                  onChange={(event, newValue) => {
                                    setFieldValue(
                                      'assignRAPWageScaleGuid',
                                      newValue
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Apprentice Wage Rate"
                                      variant="outlined"
                                      fullWidth
                                      error={Boolean(
                                        touched.assignRAPWageScaleGuid &&
                                          errors.assignRAPWageScaleGuid
                                      )}
                                      helperText={
                                        touched.assignRAPWageScaleGuid &&
                                        errors.assignRAPWageScaleGuid
                                      }
                                    />
                                  )}
                                />
                              </Grid>
                            </>
                          ) : null}
                          {values?.payTypePosition?.value === 'Salary' ? (
                            <>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name="salaryAmount"
                                  helperText={
                                    touched.salaryAmount && errors.salaryAmount
                                  }
                                  error={Boolean(
                                    touched.salaryAmount && errors.salaryAmount
                                  )}
                                  value={values.salaryAmount}
                                  defaultValue={0}
                                  onBlur={handleBlur}
                                  onChange={(event) => {
                                    setFieldValue(
                                      'salaryAmount',
                                      event.target.value
                                    );
                                    setFieldValue(
                                      'wageRate',
                                      (event.target.value / 2080).toFixed(2)
                                    );
                                  }}
                                  variant="outlined"
                                  label={t('Salary Amount')}
                                  placeholder={t('Salary Amount')}
                                />
                              </Grid>
                            </>
                          ) : (
                            <></>
                          )}

                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              name="perDiem"
                              helperText={touched.perDiem && errors.perDiem}
                              error={Boolean(touched.perDiem && errors.perDiem)}
                              value={values.perDiem}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              label={t('Per Diem')}
                              placeholder={t('Per Diem')}
                            />
                          </Grid>

                          {/* <Grid item xs={12} md={6}>
                            <Autocomplete
                              id="TitleMatchId"
                              name="titleMatch"
                              options={titleMatchOptions}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                              value={values.titleMatch}
                              onChange={(event, newValue) => {
                                setFieldValue('titleMatch', newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Title Match"
                                  variant="outlined"
                                  fullWidth
                                  error={Boolean(
                                    touched.titleMatch && errors.titleMatch
                                  )}
                                  helperText={
                                    touched.titleMatch && errors.titleMatch
                                  }
                                />
                              )}
                            />
                          </Grid> */}
                          {!values?.isAdministrativeRole ? (
                            <>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name="pwAiConfidenceMatchScore"
                                  helperText={
                                    touched.pwAiConfidenceMatchScore &&
                                    errors.pwAiConfidenceMatchScore
                                  }
                                  error={Boolean(
                                    touched.pwAiConfidenceMatchScore &&
                                      errors.pwAiConfidenceMatchScore
                                  )}
                                  value={values.pwAiConfidenceMatchScore}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  variant="outlined"
                                  label={t('AI % Confidence Score')}
                                  placeholder={t('AI % Confidence Score')}
                                />
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name="wageRate"
                                  helperText={
                                    touched.wageRate && errors.wageRate
                                  }
                                  error={Boolean(
                                    touched.wageRate && errors.wageRate
                                  )}
                                  value={values.wageRate}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  variant="outlined"
                                  label={t('Wage Rate')}
                                  placeholder={t('Wage Rate')}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name="fringe"
                                  helperText={touched.fringe && errors.fringe}
                                  error={Boolean(
                                    touched.fringe && errors.fringe
                                  )}
                                  value={values.fringe}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  variant="outlined"
                                  label={t('Fringe')}
                                  placeholder={t('Fringe')}
                                />
                              </Grid>
                            </>
                          ) : null}
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              name="marketRate"
                              helperText={
                                touched.marketRate && errors.marketRate
                              }
                              error={Boolean(
                                touched.marketRate && errors.marketRate
                              )}
                              value={values.marketRate}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              label={t('Market Rate')}
                              placeholder={t('Market Rate')}
                            />
                          </Grid>
                          {!values?.isAdministrativeRole ? (
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="pwTotalHourlyComp"
                                helperText={
                                  touched.pwTotalHourlyComp &&
                                  errors.pwTotalHourlyComp
                                }
                                error={Boolean(
                                  touched.pwTotalHourlyComp &&
                                    errors.pwTotalHourlyComp
                                )}
                                value={values.pwTotalHourlyComp}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('PW Total Hourly Comp')}
                                placeholder={t('PW Total Hourly Comp')}
                              />
                            </Grid>
                          ) : null}
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              name="rapidCode"
                              helperText={touched.rapidCode && errors.rapidCode}
                              error={Boolean(
                                touched.rapidCode && errors.rapidCode
                              )}
                              value={values.rapidCode || ''}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              label={t('ONET Code')}
                              placeholder={t('ONET Code')}
                            />
                          </Grid>
                          {/* <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              name="journeyWorkersWage"
                              helperText={
                                touched.journeyWorkersWage &&
                                errors.journeyWorkersWage
                              }
                              error={Boolean(
                                touched.journeyWorkersWage &&
                                  errors.journeyWorkersWage
                              )}
                              value={values.journeyWorkersWage || ''}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              label={t("Journey Worker's Wage")}
                              placeholder={t("Journey Worker's Wage")}
                            />
                          </Grid> */}
                        </Grid>
                      </Box>
                    </Card>

                    {isShowWarnigMsg ? (
                      <Alert severity="error" sx={{ mx: 0, mb: 3 }}>
                        <AlertTitle>Error</AlertTitle>
                        The Wage Rate and Fringe value are below compliance
                        standards. You cannot proceed until values are more than
                        prevailing wage.
                      </Alert>
                    ) : null}

                    <Card sx={{ mx: 0, mb: 3 }}>
                      <Box p={2}>
                        <Stack direction="row" spacing={2}>
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
                            {t('Submit')}
                          </Button>
                          <Button
                            variant="outlined"
                            type="submit"
                            onClick={onCancelProjectJobTitleForm}
                            color="primary"
                          >
                            {t('Cancel')}
                          </Button>
                        </Stack>
                      </Box>
                    </Card>
                  </form>
                )}
              </Formik>
            </>
          )}
        </Box>
      </Card>
    </>
  );
};

const styles = {
  header: {
    borderRadius: '10px',
    margin: '-6px',
    padding: '25px',
    background: 'linear-gradient(140deg, #9bc7e6 0%, #4949b9 50%)',
    paddingTop: '10px'
  }
};

export default AddProjectJobTitle;
