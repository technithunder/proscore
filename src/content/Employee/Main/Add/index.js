import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Checkbox,
  FormControlLabel,
  FormControl,
  Typography,
  Autocomplete,
  Divider
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  UpdateEmployee,
  addEmployee,
  getAllEmployeeStatus,
  getAllEmployeeTerm,
  getAllFringePaymentMethod,
  getAllLanguageType,
  getAllManagerType,
  getAllNotificationType,
  getProScoreEmployees,
  getUserNameCheck,
  getAllEthnicityTypes,
  getAllVeteranStatusTypes,
  getAllRaceTypes,
  getAllEducationLevelTypes,
  getAllDisabilityTypes,
  getAllRAPInfo,
  getAllApprenticeStatusTypes,
  getAllCareerConnectionTypes
} from 'src/api/employee';
import InputMask from 'react-input-mask';
import Text from 'src/components/Text';
import { AlphaNumeric, OnlyLetters } from 'src/constants/validations';
import { encryptText } from 'src/utils/utils';

const employeementStatus = [
  {
    label: 'New Employee ',
    value: 'New'
  },
  {
    label: 'Current Employee',
    value: 'Current'
  }
];

const sexOptions = [
  {
    label: 'Male',
    value: 'male'
  },
  {
    label: 'Female',
    value: 'female'
  },
  {
    label: 'Participant Did Not SelfIdentify',
    value: 'notIdentify'
  }
];

const EmployeeAdd = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [languageType, setLanguageType] = useState([]);
  const [notificationType, setNotificationType] = useState([]);
  const [employeeStausType, setEmployeeStausType] = useState([]);
  const [employeeTermType, setEmployeeTermType] = useState([]);
  const [managerType, setManagerType] = useState([]);
  const [fringePaymentMethod, setFringePaymentMethod] = useState([]);
  const [ethiniCity, setEthiniCity] = useState([]);
  const [veteranStatus, setVeteranStatus] = useState([]);
  const [race, setRace] = useState([]);
  const [educationLevel, setEducationLevel] = useState([]);
  const [disability, setDisability] = useState([]);
  const [apprenticeshipsProgram, setApprenticeshipsProgram] = useState([]);
  const [apprenticeStatus, setApprenticeStatus] = useState([]);
  const [careerConnections, setCareerConnections] = useState([]);
  const [userNameCheck, setUserNameCheck] = useState('');
  const [initialValues, setInitialValues] = useState({
    middleName: '',
    fname: '',
    lname: '',
    jobTitle: '',
    Department: '',
    CellPhone: '',
    OfficePhone: '',
    Email: '',
    Address: '',
    Address2: '',
    City: '',
    State: '',
    Zip: '',
    MailingAddress: '',
    MailingAddress2: '',
    MailingCity: '',
    MailingState: '',
    MailingZip: '',
    UserName: '',
    ProfilePicture: null,
    ProfilePictureUrl: '',
    WhatsApp: '',
    ssn: '',
    sex: null,
    ManagerId: null,
    StartDate: null,
    EndDate: null,
    LanguageTypeId: null,
    NotificationTypeId: null,
    Last4ofSSN: '',
    IsApprentice: false,
    YearsOfExperience: '',
    EmployeeStatusTypeId: null,
    EmploymentTermTypeId: null,
    HourlyRateAmount: null,
    FringeRateAmount: null,
    FringePaymentMethodTypeId: null,
    EmployeeStatus: null,
    CareerConnection: null,
    Ethnicity: null,
    VeteranStatus: [],
    Race: [],
    EducationLevel: null,
    Disability: null,
    DateApprenticeship: null,
    ApprenticeshipsProgram: null,
    LearningExperience: null,
    InstructionExperience: null,
    ApprenticeStatus: null,
    birthDate: null,
    ApprenticeshipNumber: null
  });

  useEffect(() => {
    fetchAllLanguageType();
    fetchAllNotificationType();
    fetchAllEmployeeStatusType();
    fetchAllEmployeeTermType();
    fetchAllFringePaymentMethod();
    fetchAllManager();
    fetchAllEthnicityTypes();
    fetchAllVeteranStatusTypes();
    fetchAllRaceTypes();
    fetchAllEducationLevelTypes();
    fetchAllDisabilityTypes();
    fetchAllRAPInfo();
    fetchAllApprenticeStatusTypes();
    fetchAllCareerConnectionTypes();
  }, []);

  const fetchAllEthnicityTypes = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllEthnicityTypes(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setEthiniCity(
            res.data.data.map((item) => ({
              label: item.label,
              value: item.value
            }))
          );
        } else if (res.data.data == null) {
          setEthiniCity([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllVeteranStatusTypes = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllVeteranStatusTypes(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setVeteranStatus(
            res.data.data.map((item) => ({
              label: item.label,
              value: item.value
            }))
          );
        } else if (res.data.data == null) {
          setVeteranStatus([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllRaceTypes = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllRaceTypes(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setRace(
            res.data.data.map((item) => ({
              label: item.label,
              value: item.value
            }))
          );
        } else if (res.data.data == null) {
          setRace([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllEducationLevelTypes = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllEducationLevelTypes(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setEducationLevel(
            res.data.data.map((item) => ({
              label: item.label,
              value: item.value
            }))
          );
        } else if (res.data.data == null) {
          setEducationLevel([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllDisabilityTypes = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllDisabilityTypes(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setDisability(
            res.data.data.map((item) => ({
              label: item.label,
              value: item.value
            }))
          );
        } else if (res.data.data == null) {
          setDisability([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllRAPInfo = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllRAPInfo(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setApprenticeshipsProgram(
            res.data.data.map((item) => ({
              label: item.label,
              value: item.value
            }))
          );
        } else if (res.data.data == null) {
          setApprenticeshipsProgram([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllApprenticeStatusTypes = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllApprenticeStatusTypes(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setApprenticeStatus(
            res.data.data.map((item) => ({
              label: item.label,
              value: item.value
            }))
          );
        } else if (res.data.data == null) {
          setApprenticeStatus([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllCareerConnectionTypes = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllCareerConnectionTypes(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setCareerConnections(
            res.data.data.map((item) => ({
              label: item.label,
              value: item.value
            }))
          );
        } else if (res.data.data == null) {
          setCareerConnections([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllLanguageType = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllLanguageType(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setLanguageType(
            res.data.data.map((item) => ({
              label: item.languageType,
              value: item.languageTypeId
            }))
          );
        } else if (res.data.data == null) {
          setLanguageType([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllNotificationType = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllNotificationType(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setNotificationType(
            res.data.data.map((item) => ({
              label: item.notificationType,
              value: item.notificationTypeId
            }))
          );
        } else if (res.data.data == null) {
          setNotificationType([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllEmployeeStatusType = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllEmployeeStatus(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setEmployeeStausType(
            res.data.data.map((item) => ({
              label: item.employeeStatusType,
              value: item.employeeStatusTypeId
            }))
          );
        } else if (res.data.data == null) {
          setEmployeeStausType([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllEmployeeTermType = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllEmployeeTerm(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setEmployeeTermType(
            res.data.data.map((item) => ({
              label: item.employmentTermType,
              value: item.employmentTermTypeId
            }))
          );
        } else if (res.data.data == null) {
          setEmployeeTermType([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllFringePaymentMethod = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllFringePaymentMethod(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setFringePaymentMethod(
            res.data.data.map((item) => ({
              label: item.fringePaymentMethodType,
              value: item.fringePaymentMethodTypeId
            }))
          );
        } else if (res.data.data == null) {
          setFringePaymentMethod([]);
        }
      })
      .catch((e) => console.log(e));
  };
  const fetchAllManager = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllManagerType(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setManagerType(
            res.data.data.map((item) => ({
              label: item.employeeName,
              value: item.employeeId
            }))
          );
        } else if (res.data.data == null) {
          setManagerType([]);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    setLoading(true);
    if (id) {
      const obj = {
        employeeId: id
      };
      getProScoreEmployees(obj)
        .then((res) => {
          if (res) {
            setInitialValues({
              middleName: res.data.data.middleName,
              fname: res.data.data.firstName,
              lname: res.data.data.lastName,
              jobTitle: res.data.data.jobTitle,
              Department: res.data.data.department,
              CellPhone: res.data.data.cellPhone,
              OfficePhone: res.data.data.officePhone,
              Email: res.data.data.email,
              Address: res.data.data.address,
              Address2: res.data.data.address2,
              City: res.data.data.city,
              State: res.data.data.state,
              Zip: res.data.data.zip,
              MailingAddress: res.data.data.mailingAddress,
              MailingAddress2: res.data.data.mailingAddress2,
              MailingCity: res.data.data.mailingCity,
              MailingState: res.data.data.mailingState,
              MailingZip: res.data.data.mailingZip,
              UserName: res.data.data.userName,
              // InvitationVerificationCode:
              //   res.data.data.invitationVerificationCode,
              ProfilePicture: res.data?.data?.profileMediaModel?.path,
              WhatsApp: res.data.data.whatsApp,
              ManagerId: res.data.data.managerIds,
              StartDate: res.data.data.startDate,
              EndDate: res.data.data.endDate,
              LanguageTypeId: res.data.data.languageTypeIds,
              NotificationTypeId: res.data.data.notificationTypeIds,
              Last4ofSSN: res.data.data.last4ofSSN,
              IsApprentice: res.data.data.isAppentice,
              YearsOfExperience: res.data.data.yearsOfExperience,
              EmployeeStatusTypeId: res.data.data.employeeStatusTypeIds,
              EmploymentTermTypeId: res.data.data.employmentTermTypeIds,
              HourlyRateAmount: res.data.data.hourlyRateAmount,
              FringeRateAmount: res.data.data.fringeRateAmount,
              FringePaymentMethodTypeId:
                res.data.data?.fringePaymentMethodTypeIds,
              EmployeeStatus:
                res.data?.data?.employmentStatus === 'New'
                  ? {
                      label: 'New Employee ',
                      value: 'New'
                    }
                  : {
                      label: 'Current Employee',
                      value: 'Current'
                    },
              sex:
                res.data?.data?.sex === 'male'
                  ? {
                      label: 'Male',
                      value: 'male'
                    }
                  : res.data?.data?.sex === 'female'
                  ? {
                      label: 'Female',
                      value: 'female'
                    }
                  : res.data?.data?.sex === 'notIdentify'
                  ? {
                      label: 'Participant Did Not SelfIdentify',
                      value: 'notIdentify'
                    }
                  : null,
              Ethnicity: res.data.data?.ethnicityTypeModel,
              VeteranStatus: res.data.data?.veteranStatusTypeModel || [],
              Race: res.data.data?.raceTypeModel || [],
              EducationLevel: res.data.data?.educationLevelTypeModel,
              Disability: res.data.data?.disabilityTypeModel,
              DateApprenticeship: res.data.data?.dateApprenticeshipBegins,
              ApprenticeshipsProgram: res.data.data?.rapInfoModel,
              LearningExperience: res.data.data?.anyCredit,
              InstructionExperience: res.data.data?.rti,
              ssn: res.data.data?.ssn,
              ApprenticeStatus: res.data.data?.apprenticeStatusTypeModel,
              CareerConnection: res.data.data?.careerConnectionTypeModel,
              birthDate: res.data.data?.birthDate,
              ApprenticeshipNumber: res.data.data?.apprenticeshipRegNumber
            });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleCheckUser = async (event) => {
    if (event.target.defaultValue) {
      let obj = {
        userName: event.target.defaultValue
      };
      await getUserNameCheck(obj)
        .then((res) => {
          if (res.data.message == null) {
            setUserNameCheck('');
          } else {
            setUserNameCheck(res.data.message);
          }
        })
        .catch((e) => console.log(e));
    }
  };

  function generateRandomPassword(specialChars, minLength) {
    const numbers = '0123456789';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const allChars =
      numbers + lowerCaseLetters + upperCaseLetters + specialChars;

    let password = '';
    password += specialChars.charAt(
      Math.floor(Math.random() * specialChars.length)
    );
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += lowerCaseLetters.charAt(
      Math.floor(Math.random() * lowerCaseLetters.length)
    );
    password += upperCaseLetters.charAt(
      Math.floor(Math.random() * upperCaseLetters.length)
    );
    for (let i = password.length; i < minLength; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    password = password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');

    return password;
  }

  return (
    <>
      {!id ? (
        <>
          <Helmet>
            <title>
              {id ? 'Edit Employee - Employee' : 'Add Employee - Employee'}
            </title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Box}
              heading={id ? t('Edit Employee') : t('Add Employee')}
              description={
                id
                  ? t('Fill in the below to edit employee')
                  : t('Fill in the below to add employee')
              }
              pathname={'/employee/employee'}
              buttonHeading={t('Go back to all employee')}
              Icon={ArrowBackIcon}
            />
          </PageTitleWrapper>
        </>
      ) : (
        <Outlet />
      )}

      <>
        {loading && id ? (
          <>
            <CircularProgress
              size="3rem"
              sx={{ display: 'flex', margin: '0 auto', my: 5 }}
            />
          </>
        ) : (
          <>
            <Box>
              {loading && id ? (
                <>
                  <CircularProgress
                    size="3rem"
                    sx={{ display: 'flex', margin: '0 auto', my: 5 }}
                  />
                </>
              ) : (
                <Formik
                  initialValues={initialValues}
                  onSubmit={async (
                    _values,
                    { resetForm, setErrors, setStatus, setSubmitting }
                  ) => {
                    try {
                      if (id) {
                        const obj = {
                          employeeId: id,
                          firstName: _values?.fname,
                          middleName: _values?.middleName,
                          lastName: _values?.lname,
                          jobTitle: _values?.jobTitle,
                          department: _values?.Department,
                          cellPhone: _values?.CellPhone,
                          officePhone: _values?.OfficePhone,
                          email: _values?.Email,
                          address: _values?.Address,
                          address2: _values?.Address2,
                          city: _values?.City,
                          state: _values?.State,
                          zip: _values?.Zip.toString(),
                          mailingAddress: _values?.MailingAddress,
                          mailingAddress2: _values?.MailingAddress,
                          mailingCity: _values?.MailingCity,
                          mailingState: _values?.MailingState,
                          mailingZip: _values?.MailingZip.toString(),
                          userName: _values?.UserName,
                          invitationVerificationCode: null,
                          profilePicture: _values?.ProfilePictureUrl,
                          whatsApp: _values?.WhatsApp,
                          interalEmployeeID: null,
                          // managerId: _values?.ManagerId.value ?? null,
                          startDate: _values?.StartDate,
                          endDate: _values?.EndDate,
                          // languageTypeId: _values?.LanguageTypeId?.value ?? null,
                          notificationTypeId:
                            _values?.NotificationTypeId?.value,
                          last4ofSSN: _values?.Last4ofSSN,
                          isAppentice: _values?.IsApprentice,
                          yearsOfExperience: _values?.YearsOfExperience,
                          employeeStatusTypeId:
                            _values?.EmployeeStatusTypeId?.value,
                          employmentTermTypeId:
                            _values?.EmploymentTermTypeId?.value,
                          hourlyRateAmount: _values?.HourlyRateAmount,
                          fringeRateAmount: _values?.FringeRateAmount,
                          fringePaymentMethodTypeId:
                            _values?.FringePaymentMethodTypeId?.value,
                          managerId: _values?.ManagerId?.value,
                          languageTypeId: _values?.LanguageTypeId?.value,
                          employmentStatus: _values?.EmployeeStatus?.value,
                          ethnicityTypeId: _values?.Ethnicity?.value,
                          veteranStatusTypeId:
                            _values?.VeteranStatus?.length > 0
                              ? _values?.VeteranStatus?.map(
                                  (item) => item.value
                                )
                              : null,
                          raceTypeId:
                            _values?.Race?.length > 0
                              ? _values?.Race?.map((item) => item.value)
                              : null,
                          educationLevelTypeId: _values?.EducationLevel?.value,
                          disabilityTypeId: _values?.Disability?.value,
                          dateApprenticeshipBegins: _values?.DateApprenticeship,
                          rapInfoId: _values?.ApprenticeshipsProgram?.value,
                          anyCredit: _values?.LearningExperience,
                          rti: _values?.InstructionExperience,
                          ssn: _values?.ssn,
                          sex: _values?.sex?.value,
                          apprenticeStatusTypeId:
                            _values?.ApprenticeStatus?.value,
                          careerConnectionTypeId:
                            _values?.CareerConnection?.value,
                          birthDate: _values?.birthDate,
                          apprenticeshipRegNumber: _values?.ApprenticeshipNumber
                        };
                        if (_values?.ProfilePictureUrl) {
                          obj.profileMediaModel = {
                            base64String: _values.ProfilePictureUrl,
                            fileName: _values.ProfilePicture.name
                          };
                        } else {
                          obj.profileMediaModel = null;
                        }
                        if (
                          _values.ManagerId === null ||
                          _values.ManagerId === undefined
                        ) {
                          obj.managerId = null;
                        }
                        if (
                          _values.LanguageTypeId === null ||
                          _values.LanguageTypeId === undefined
                        ) {
                          obj.languageTypeId = null;
                        }

                        await UpdateEmployee(obj)
                          .then((res) => {
                            if (res.data) {
                              resetForm();
                              setStatus({ success: true });
                              setSubmitting(false);
                              navigate('/employee/employee', {
                                state: { action: 'updated' }
                              });
                            }
                          })
                          .catch((err) => {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                          });
                      } else if (!_values.id) {
                        const password = generateRandomPassword('@#$%', 8);
                        _values.password = password;
                        const obj = {
                          firstName: _values?.fname,
                          middleName: _values?.middleName,
                          password: password,
                          passwordRef: encryptText(password),
                          lastName: _values?.lname,
                          jobTitle: _values?.jobTitle,
                          department: _values?.Department,
                          cellPhone: _values?.CellPhone,
                          officePhone: _values?.OfficePhone,
                          email: _values?.Email,
                          address: _values?.Address,
                          address2: _values?.Address2,
                          city: _values?.City,
                          state: _values?.State,
                          zip: _values?.Zip.toString(),
                          mailingAddress: _values?.MailingAddress,
                          mailingAddress2: _values?.MailingAddress,
                          mailingCity: _values?.MailingCity,
                          mailingState: _values?.MailingState,
                          mailingZip: _values?.MailingZip.toString(),
                          userName: _values?.UserName,
                          invitationVerificationCode: null,
                          profilePicture: _values.ProfilePictureUrl,
                          whatsApp: _values?.WhatsApp,
                          interalEmployeeID: null,
                          managerId: _values?.ManagerId?.value,
                          startDate: _values?.StartDate,
                          endDate: _values?.EndDate,
                          languageTypeId: _values?.LanguageTypeId?.value,
                          notificationTypeId:
                            _values?.NotificationTypeId?.value,
                          last4ofSSN: _values?.Last4ofSSN.toString(),
                          isAppentice: _values?.IsApprentice,
                          yearsOfExperience: _values?.YearsOfExperience,
                          employeeStatusTypeId:
                            _values?.EmployeeStatusTypeId?.value,
                          employmentTermTypeId:
                            _values?.EmploymentTermTypeId?.value,

                          hourlyRateAmount: _values?.HourlyRateAmount,
                          fringeRateAmount: _values?.FringeRateAmount,
                          fringePaymentMethodTypeId:
                            _values?.FringePaymentMethodTypeId?.value,
                          employmentStatus: _values?.EmployeeStatus?.value,
                          ethnicityTypeId: _values?.Ethnicity?.value,
                          veteranStatusTypeId:
                            _values?.VeteranStatus?.length > 0
                              ? _values?.VeteranStatus?.map(
                                  (item) => item.value
                                )
                              : null,
                          raceTypeId:
                            _values?.Race?.length > 0
                              ? _values?.Race?.map((item) => item.value)
                              : null,
                          educationLevelTypeId: _values?.EducationLevel?.value,
                          disabilityTypeId: _values?.Disability?.value,
                          dateApprenticeshipBegins: _values?.DateApprenticeship,
                          rapInfoId: _values?.ApprenticeshipsProgram?.value,
                          anyCredit: _values?.LearningExperience,
                          rti: _values?.InstructionExperience,
                          ssn: _values?.ssn,
                          sex: _values?.sex?.value,
                          apprenticeStatusTypeId:
                            _values?.ApprenticeStatus?.value,
                          careerConnectionTypeId:
                            _values?.CareerConnection?.value,
                          birthDate: _values?.birthDate,
                          apprenticeshipRegNumber: _values?.ApprenticeshipNumber
                        };
                        if (
                          _values?.ProfilePicture === null ||
                          _values?.ProfilePicture === undefined
                        ) {
                          obj.profileMediaModel = null;
                        } else {
                          obj.profileMediaModel = {
                            base64String: _values.ProfilePictureUrl,
                            fileName: _values.ProfilePicture.name
                          };
                        }
                        console.log('addEmployee--', obj);
                        await addEmployee(obj)
                          .then((res) => {
                            if (res) {
                              if (res.status === 200) {
                                resetForm();
                                setStatus({ success: true });
                                setSubmitting(false);
                                navigate('/employee/employee');
                              }
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
                  validationSchema={Yup.object().shape({
                    fname: Yup.string()
                      .max(255)
                      .required(t('Required'))
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    middleName: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    lname: Yup.string()
                      .max(255)
                      .required(t('Required'))
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    jobTitle: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    Department: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    Email: Yup.string()
                      .email(t('The email should be a valid'))
                      .trim()
                      .required(t('Required')),
                    UserName: Yup.string()
                      .max(255)
                      .required(t('Required'))
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    Address: Yup.string().max(255).required(t('Required')),
                    Address2: Yup.string().nullable(),
                    City: Yup.string()
                      .max(255)
                      .required(t('Required'))
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    State: Yup.string()
                      .max(255)
                      .required(t('Required'))
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    Zip: Yup.string().required(t('Required')).min(5).max(5),
                    MailingAddress: Yup.string().nullable(),
                    MailingState: Yup.string().nullable(),
                    MailingCity: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    MailingZip: Yup.string()
                      .max(5, t('Mailing-Zip Number must be 5 digits'))
                      .notRequired()
                      .test(
                        'is-ten-digits',
                        t('Mailing-Zip Number must be 5 digits'),
                        (value) =>
                          !value ||
                          (value && value.replace(/\D/g, '').length === 5)
                      ),

                    FringePaymentMethodTypeId: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    Last4ofSSN: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),

                    StartDate: Yup.date().nullable(),
                    EndDate: Yup.date()
                      .nullable()
                      .min(
                        Yup.ref('EndDate'),
                        'End date must be greater than start date.'
                      ),
                    CellPhone: Yup.string()
                      .trim()
                      .required(t('Required'))
                      .test(
                        'is-ten-digits',
                        t('Cell Phone Number must be 10 digits'),
                        (value) =>
                          value ? value.replace(/\D/g, '').length === 10 : false
                      ),
                    OfficePhone: Yup.string()
                      .trim()
                      .required(t('Required'))
                      .test(
                        'is-ten-digits',
                        t('Office Phone Number must be 10 digits'),
                        (value) =>
                          value ? value.replace(/\D/g, '').length === 10 : false
                      ),
                    WhatsApp: Yup.string()
                      .trim()
                      .test(
                        'is-ten-digits',
                        t('WhatsApp Phone Number must be 10 digits'),
                        (value) =>
                          value ? value.replace(/\D/g, '').length === 10 : false
                      )
                  })}
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
                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Box p={2}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography
                              variant="h4"
                              textTransform="uppercase"
                              fontWeight="700"
                            >
                              Basic Information
                            </Typography>
                          </Stack>
                        </Box>
                        <Divider />
                        <Box p={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="fname"
                                helperText={touched.fname && errors.fname}
                                error={Boolean(touched.fname && errors.fname)}
                                value={values.fname}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  handleChange({
                                    target: { name: 'fname', value: newValue }
                                  });
                                }}
                                variant="outlined"
                                label={t('First Name ')}
                                placeholder={t('First Name ')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="middleName"
                                value={values.middleName}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  handleChange({
                                    target: {
                                      name: 'middleName',
                                      value: newValue
                                    }
                                  });
                                }}
                                variant="outlined"
                                label={t('Middle Name')}
                                placeholder={t('Middle Name')}
                                helperText={
                                  touched.middleName && errors.middleName
                                }
                                error={Boolean(
                                  touched.middleName && errors.middleName
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="lname"
                                value={values.lname}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  handleChange({
                                    target: { name: 'lname', value: newValue }
                                  });
                                }}
                                helperText={touched.lname && errors.lname}
                                error={Boolean(touched.lname && errors.lname)}
                                variant="outlined"
                                label={t('Last Name')}
                                placeholder={t('Last Name ')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="jobTitle"
                                value={values.jobTitle}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  handleChange({
                                    target: {
                                      name: 'jobTitle',
                                      value: newValue
                                    }
                                  });
                                }}
                                variant="outlined"
                                label={t('Job Title')}
                                placeholder={t('Job Title')}
                                helperText={touched.jobTitle && errors.jobTitle}
                                error={Boolean(
                                  touched.jobTitle && errors.jobTitle
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="Department"
                                value={values.Department}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  handleChange({
                                    target: {
                                      name: 'Department',
                                      value: newValue
                                    }
                                  });
                                }}
                                variant="outlined"
                                label={t('Department')}
                                placeholder={t('Department')}
                                helperText={
                                  touched.Department && errors.Department
                                }
                                error={Boolean(
                                  touched.Department && errors.Department
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <InputMask
                                mask="(999) 999-9999"
                                maskChar=""
                                value={values.CellPhone}
                                onBlur={handleBlur}
                                onChange={handleChange}
                              >
                                {() => (
                                  <TextField
                                    fullWidth
                                    name="CellPhone"
                                    helperText={
                                      touched.CellPhone && errors.CellPhone
                                    }
                                    error={Boolean(
                                      touched.CellPhone && errors.CellPhone
                                    )}
                                    variant="outlined"
                                    label={t('Cell Phone')}
                                    placeholder={t('Cell Phone ')}
                                    type="tel"
                                    inputProps={{ maxLength: 14 }}
                                  />
                                )}
                              </InputMask>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <InputMask
                                mask="(999) 999-9999"
                                maskChar=""
                                value={values.OfficePhone}
                                onBlur={handleBlur}
                                onChange={handleChange}
                              >
                                {() => (
                                  <TextField
                                    fullWidth
                                    name="OfficePhone"
                                    variant="outlined"
                                    helperText={
                                      touched.OfficePhone && errors.OfficePhone
                                    }
                                    error={Boolean(
                                      touched.OfficePhone && errors.OfficePhone
                                    )}
                                    label={t('Office Phone')}
                                    placeholder={t('Office Phone ')}
                                    type="tel"
                                    inputProps={{ maxLength: 14 }}
                                  />
                                )}
                              </InputMask>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="Email"
                                helperText={touched.Email && errors.Email}
                                error={Boolean(touched.Email && errors.Email)}
                                value={values.Email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Email')}
                                placeholder={t('Email')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="UserName"
                                value={values.UserName}
                                onBlur={(event) => {
                                  handleBlur(event);
                                  handleCheckUser(event);
                                }}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('User Name')}
                                placeholder={t('User Name')}
                                helperText={touched.UserName && errors.UserName}
                                error={Boolean(
                                  touched.UserName && errors.UserName
                                )}
                              />
                              {userNameCheck === 'Exists' ? (
                                <Text color="error">
                                  Username already {userNameCheck}
                                </Text>
                              ) : (
                                ''
                              )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <InputMask
                                mask="(999) 999-9999"
                                maskChar=""
                                value={values.WhatsApp}
                                onBlur={handleBlur}
                                onChange={handleChange}
                              >
                                {() => (
                                  <TextField
                                    fullWidth
                                    name="WhatsApp"
                                    variant="outlined"
                                    label={t('WhatsApp')}
                                    helperText={
                                      touched.WhatsApp && errors.WhatsApp
                                    }
                                    error={Boolean(
                                      touched.WhatsApp && errors.WhatsApp
                                    )}
                                    placeholder={t('WhatsApp')}
                                    type="tel"
                                    inputProps={{ maxLength: 14 }}
                                  />
                                )}
                              </InputMask>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <InputMask
                                mask="999-99-9999"
                                maskChar=""
                                value={values.ssn}
                                onBlur={handleBlur}
                                onChange={handleChange}
                              >
                                {() => (
                                  <TextField
                                    fullWidth
                                    name="ssn"
                                    variant="outlined"
                                    label="SSN"
                                    helperText={touched.ssn && errors.ssn}
                                    error={Boolean(touched.ssn && errors.ssn)}
                                    placeholder="SSN"
                                    type="tel"
                                    inputProps={{ maxLength: 14 }}
                                  />
                                )}
                              </InputMask>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <DatePicker
                                label="Date of Birth"
                                value={values.birthDate}
                                onChange={(newValue) => {
                                  setFieldValue('birthDate', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    placeholder={t('Date of Birth')}
                                    error={Boolean(
                                      touched.birthDate && errors.birthDate
                                    )}
                                    helperText={
                                      touched.birthDate && errors.birthDate
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
                              <Autocomplete
                                id="sex"
                                name="sex"
                                options={sexOptions}
                                value={values.sex}
                                onChange={(event, newValue) => {
                                  setFieldValue('sex', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={t('Sex')}
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                marginBottom={1}
                              >
                                <Typography variant="subtitle1">
                                  Profile Picture
                                </Typography>
                                <TextField
                                  type="file"
                                  accept=".jpeg, .jpg, .png"
                                  onChange={(event) => {
                                    const file = event.currentTarget.files[0];
                                    setFieldValue('ProfilePicture', file);

                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const dataUrl = reader.result;
                                      const cleanedDataUrl =
                                        dataUrl.split(',')[1];
                                      setFieldValue(
                                        'ProfilePictureUrl',
                                        cleanedDataUrl
                                      );
                                    };
                                    if (file) {
                                      reader.readAsDataURL(file);
                                    } else {
                                      setFieldValue('ProfilePictureUrl', '');
                                    }
                                  }}
                                  onBlur={handleBlur}
                                />

                                <img
                                  src={initialValues?.ProfilePicture}
                                  alt=""
                                  style={{ height: 30, width: 'auto' }}
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="YearsOfExperience"
                                value={values.YearsOfExperience}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Years of Experience')}
                                placeholder={t('Years of Experience')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <FormControl
                                component="fieldset"
                                error={Boolean(
                                  touched.IsApprentice && errors.IsApprentice
                                )}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={values.IsApprentice}
                                      onChange={(event) =>
                                        setFieldValue(
                                          'IsApprentice',
                                          event.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label={t('Is Apprentice?')}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                      {values.IsApprentice && (
                        <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                          <Box p={2}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography
                                textTransform="uppercase"
                                variant="h4"
                                fontWeight="700"
                              >
                                Apprentice Information
                              </Typography>
                            </Stack>
                          </Box>
                          <Divider />
                          <Box p={2}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  id="Ethnicity"
                                  name="Ethnicity"
                                  options={ethiniCity}
                                  value={values.Ethnicity}
                                  onChange={(event, newValue) => {
                                    setFieldValue('Ethnicity', newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={t('Ethnicity')}
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  multiple
                                  id="VeteranStatus"
                                  name="VeteranStatus"
                                  options={veteranStatus}
                                  value={values.VeteranStatus}
                                  onChange={(event, newValue) => {
                                    setFieldValue('VeteranStatus', newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={t('Veteran Status')}
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  multiple
                                  id="Race"
                                  name="Race"
                                  options={race}
                                  value={values.Race}
                                  onChange={(event, newValue) => {
                                    setFieldValue('Race', newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={t('Race')}
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  id="EducationLevel"
                                  name="EducationLevel"
                                  options={educationLevel}
                                  value={values.EducationLevel}
                                  onChange={(event, newValue) => {
                                    setFieldValue('EducationLevel', newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={t('Education Level')}
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  id="Disability"
                                  name="Disability"
                                  options={disability}
                                  value={values.Disability}
                                  onChange={(event, newValue) => {
                                    setFieldValue('Disability', newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={t('Disability')}
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  id="EmployeeStatus"
                                  name="EmployeeStatus"
                                  options={employeementStatus}
                                  value={values.EmployeeStatus}
                                  onChange={(event, newValue) => {
                                    setFieldValue('EmployeeStatus', newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={t('Employeement Status')}
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <DatePicker
                                  label="Date Apprenticeship Begins"
                                  value={values.DateApprenticeship}
                                  onChange={(newValue) => {
                                    setFieldValue(
                                      'DateApprenticeship',
                                      newValue
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      placeholder={t(
                                        'Date Apprenticeship Begins'
                                      )}
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
                              <Grid item xs={12} md={6} mt={3}>
                                <Autocomplete
                                  id="CareerConnection"
                                  name="CareerConnection"
                                  options={careerConnections}
                                  value={values.CareerConnection}
                                  onChange={(event, newValue) => {
                                    setFieldValue('CareerConnection', newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={t('Career Connection')}
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  id="ApprenticeshipsProgram"
                                  name="ApprenticeshipsProgram"
                                  options={apprenticeshipsProgram}
                                  value={values.ApprenticeshipsProgram}
                                  onChange={(event, newValue) => {
                                    setFieldValue(
                                      'ApprenticeshipsProgram',
                                      newValue
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={t('Apprenticeships Program')}
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name="LearningExperience"
                                  value={values.LearningExperience}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  variant="outlined"
                                  label={t(
                                    'Any credit for Previous On-the-job Learning Experience?(Term Length total is 4000 Hours)'
                                  )}
                                  placeholder={t(
                                    'Any credit for Previous On-the-job Learning Experience?(Term Length total is 4000 Hours)'
                                  )}
                                  type="number"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name="InstructionExperience"
                                  value={values.InstructionExperience}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  variant="outlined"
                                  label={t(
                                    'RIL or Related Instruction, any Credit for Previous Instruction Experience?'
                                  )}
                                  placeholder={t(
                                    'RIL or Related Instruction, any Credit for Previous Instruction Experience?'
                                  )}
                                  type="number"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  id="ApprenticeStatus"
                                  name="ApprenticeStatus"
                                  options={apprenticeStatus}
                                  value={values.ApprenticeStatus}
                                  onChange={(event, newValue) => {
                                    setFieldValue('ApprenticeStatus', newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={t('Apprentice Status')}
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name="ApprenticeshipNumber"
                                  value={values.ApprenticeshipNumber}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  variant="outlined"
                                  label={t('Apprenticeship Number')}
                                  placeholder={t('Apprenticeship Number')}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </Card>
                      )}
                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Box p={2}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography
                              textTransform="uppercase"
                              variant="h4"
                              fontWeight="700"
                            >
                              Address Information
                            </Typography>
                          </Stack>
                        </Box>
                        <Divider />
                        <Box p={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="Address"
                                helperText={touched.Address && errors.Address}
                                error={Boolean(
                                  touched.Address && errors.Address
                                )}
                                value={values.Address}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Address')}
                                placeholder={t('Address ')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="Address2"
                                value={values.Address2}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Address 2')}
                                placeholder={t('Address 2 ')}
                                helperText={touched.Address2 && errors.Address2}
                                error={Boolean(
                                  touched.Address2 && errors.Address2
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="State"
                                helperText={touched.State && errors.State}
                                error={Boolean(touched.State && errors.State)}
                                value={values.State}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('State')}
                                placeholder={t('State ')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="City"
                                helperText={touched.City && errors.City}
                                error={Boolean(touched.City && errors.City)}
                                value={values.City}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('City')}
                                placeholder={t('City ')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="Zip"
                                helperText={touched.Zip && errors.Zip}
                                error={Boolean(touched.Zip && errors.Zip)}
                                value={values.Zip}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Zip')}
                                placeholder={t('Zip ')}
                                type="text"
                                inputProps={{ maxLength: 5, tabIndex: '15' }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Box p={2}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography
                              textTransform="uppercase"
                              variant="h4"
                              fontWeight="700"
                            >
                              Mailing Address Information
                            </Typography>
                          </Stack>
                        </Box>
                        <Divider />
                        <Box p={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="MailingAddress"
                                value={values.MailingAddress}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Mailing Address')}
                                placeholder={t('Mailing Address ')}
                                helperText={
                                  touched.MailingAddress &&
                                  errors.MailingAddress
                                }
                                error={Boolean(
                                  touched.MailingAddress &&
                                    errors.MailingAddress
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="MailingState"
                                value={values.MailingState}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Mailing State')}
                                placeholder={t('Mailing State ')}
                                helperText={
                                  touched.MailingState && errors.MailingState
                                }
                                error={Boolean(
                                  touched.MailingState && errors.MailingState
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="MailingCity"
                                value={values.MailingCity}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Mailing City')}
                                placeholder={t('Mailing City ')}
                                helperText={
                                  touched.MailingCity && errors.MailingCity
                                }
                                error={Boolean(
                                  touched.MailingCity && errors.MailingCity
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="MailingZip"
                                value={values.MailingZip}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Mailing Zip')}
                                placeholder={t('Mailing Zip')}
                                type="text"
                                helperText={
                                  touched.MailingZip && errors.MailingZip
                                }
                                error={Boolean(
                                  touched.MailingZip && errors.MailingZip
                                )}
                                inputProps={{ maxLength: 5, tabIndex: '15' }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Box p={2}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography
                              textTransform="uppercase"
                              variant="h4"
                              fontWeight="700"
                            >
                              Additional Information
                            </Typography>
                          </Stack>
                        </Box>
                        <Divider />
                        <Box p={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="FringePaymentMethodTypeId"
                                name="FringePaymentMethodTypeId"
                                options={fringePaymentMethod}
                                value={values.FringePaymentMethodTypeId}
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'FringePaymentMethodTypeId',
                                    newValue
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={t('Fringe Payment Method')}
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>
                            {/* <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="InvitationVerificationCode"
                                value={values.InvitationVerificationCode.trim()}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Invitation Verification Code')}
                                placeholder={t('Invitation Verification Code')}
                              />
                            </Grid> */}
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="HourlyRateAmount"
                                value={values.HourlyRateAmount}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Hourly Rate Amount')}
                                placeholder={t('Hourly Rate Amount')}
                                type="number"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <DatePicker
                                label="Start Date"
                                value={values.StartDate}
                                onChange={(newValue) => {
                                  setFieldValue('StartDate', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    placeholder={t('Start Date')}
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
                                minDate={values.StartDate || new Date()}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <DatePicker
                                label="End Date"
                                value={values.EndDate}
                                onChange={(newValue) => {
                                  setFieldValue('EndDate', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    placeholder={t('End Date')}
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
                                minDate={values.StartDate || new Date()}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="Last4ofSSN"
                                value={values.Last4ofSSN}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  handleChange({
                                    target: {
                                      name: 'Last4ofSSN',
                                      value: newValue
                                    }
                                  });
                                }}
                                variant="outlined"
                                label={t('Last 4 of SSN')}
                                placeholder={t('Last 4 of SSN')}
                                inputProps={{ maxLength: 4, tabIndex: '15' }}
                                helperText={
                                  touched.Last4ofSSN && errors.Last4ofSSN
                                }
                                error={Boolean(
                                  touched.Last4ofSSN && errors.Last4ofSSN
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="ManagerId"
                                name="ManagerId"
                                options={managerType}
                                value={values.ManagerId}
                                onChange={(event, newValue) => {
                                  setFieldValue('ManagerId', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={t('Manager')}
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="LanguageTypeId"
                                name="LanguageTypeId"
                                options={languageType}
                                value={values.LanguageTypeId}
                                onChange={(event, newValue) => {
                                  setFieldValue('LanguageTypeId', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={t('Language')}
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="NotificationTypeId"
                                name="NotificationTypeId"
                                options={notificationType}
                                value={values.NotificationTypeId}
                                onChange={(event, newValue) => {
                                  setFieldValue('NotificationTypeId', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={t('Notification')}
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="EmployeeStatusTypeId"
                                name="EmployeeStatusTypeId"
                                options={employeeStausType}
                                value={values.EmployeeStatusTypeId}
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'EmployeeStatusTypeId',
                                    newValue
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={t('Employee Status')}
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="EmploymentTermTypeId"
                                name="EmploymentTermTypeId"
                                options={employeeTermType}
                                value={values.EmploymentTermTypeId}
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'EmploymentTermTypeId',
                                    newValue
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={t('Employment Term')}
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="FringeRateAmount"
                                value={values.FringeRateAmount}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t('Fringe Rate Amount')}
                                placeholder={t('Fringe Rate Amount')}
                                type="number"
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Box p={2}>
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
                              {t('Submit')}
                            </Button>
                            <Button
                              variant="outlined"
                              type="submit"
                              onClick={() => navigate('/employee/employee')}
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
              )}
            </Box>
          </>
        )}
      </>
    </>
  );
};

export default EmployeeAdd;
