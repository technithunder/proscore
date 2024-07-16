import React, {  useState } from 'react';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { Formik } from 'formik';
import { useNavigate } from 'react-router';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  CircularProgress,
  Grid,
  Divider,
  Autocomplete,
  Typography,
  FormControlLabel,
  Checkbox
  // Radio,
  // RadioGroup
} from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  addNewProject,
  getProject,
  updateProject,
  getAllWorkType,
  getAllProjectDocumentTypes
} from 'src/api/projects/Project';
import { getAllClientList } from 'src/api/projects/ProjectClientContractor';
import { getAllContact } from 'src/api/client/client/contact';
import DatePicker from '@mui/lab/DatePicker';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';

import ClientContractor from 'src/content/projects/Project/ManageProject/ProjectClientContractor';
import ProjectScheduling from 'src/content/projects/Project/ManageProject/ProjectSchedule';
import {
  AlphaNumeric,
  OnlyLetters,
  RealNumber
} from 'src/constants/validations';

const AddProject = ({ id, onClick }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isTimekeepingPeriod, setTimekeepingPeriod] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [newProjectId, setNewProjectId] = useState('');
  const [workTypeList, setWorkTypeList] = useState([]);
  const [projectDocumentTypeList, setProjectDocumentTypeList] = useState([]);
  const [typicalShiftArray, setTypicalShiftArray] = useState([]);
  const [timeKeepingPeriodArray, setTimeKeepingPeriodArray] = useState([]);
  const [clients, setClients] = useState([]);
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentFileName, setDocumentFileName] = useState('');
  const [documentPath, setDocumentPath] = useState('');
  const [mobileAppTimeKeepingObj, setMobileAppTimeKeepingObj] = useState({
    mobileAppTimeKeepingManagement_QC: false,
    mobileAppTimeKeepingManagement_FC: false,
    mobileAppTimeKeepingManagement_MO: false
  });
  const [typicalShiftObj] = useState({
    TypicalShiftDaySun: false,
    TypicalShiftDayMon: false,
    TypicalShiftDayTue: false,
    TypicalShiftDayWed: false,
    TypicalShiftDayThu: false,
    TypicalShiftDayFri: false,
    TypicalShiftDaySat: false
  });
  const [expandedValues, setExpandedValues] = React.useState({
    projectNameAndAddress: true,
    projectOwnership: true,
    projectPartners: true,
    projectDetails: true,
    projectDetailsRequested: true,
    moduleInfo: false,
    structureInfo: false,
    inverterDetail: false,
    materialInfo: false,
    interconnectionInfo: false,
    permittingDetail: false
  });

  const [initialValues, setInitialValues] = useState({
    projectName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    internalProjectId: '',
    lat: '',
    long: '',
    certifiedPayrollEmailAddress: '',
    MoreThanFourEmployees: false,
    EmployeeCount: null,
    TypicalShiftDay: '',
    shiftStartTime: null,
    shiftEndTime: null,
    startDate: null,
    endDate: null,
    workType: null,
    totalWorkforceHours: null,
    workShift: '',
    payPeriodBegin: '',
    payPeriodEnd: '',
    projectMegawattSize: '',
    projectAcresSize: '',
    constructionSiteCounties: '',
    projectPrimaryCounty: '',
    useProscoreMobileApp: null,
    mobileAppTimeKeepingManagement: null,
    provideTimeKeepingOn: null,
    IsAllowMoreThanOneSiteLocation: false,
    IsAllowWorkerToAddMoreThanOneOccupation: false,
    IsSubContractor: false,
    projectEPC: null,
    projectOwner: null,
    projectDeveloper: null,
    PayrollOn: null,
    timeKeepingSystem: '',
    targetConstructionStartDate: null,
    actualConstructionStartDate: null,
    targetCODDate: null,
    totalConstructionDays: null,
    projectKickoff: null,
    projectCapacityAC: null,
    projectCapacityDC: null,
    moduleSelected: null,
    moduleType: null,
    modulQuantity: null,
    stringSizes: null,
    structureSelected: null,
    structureManufacturer: null,
    rowCount: null,
    pileAmount: null,
    pileType: null,
    pileEmbedmentDepth: null,
    blowMinCountRange: null,
    blowMaxCountRange: null,
    inverterSelected: null,
    inverterType: null,
    inverterQuantity: null,
    DCRatio: null,
    ACRatio: null,
    materialProcurement: null,
    interconnectingUtility: null,
    interconnectionApproval: null,
    interconnectionTiming: null,
    interconnectionVoltage: null,
    interconnectPoint: null,
    interconnectDistance: null,
    ROWRequired: null,
    interconnectQueueStatus: null,
    substationCongestion: null,
    interconnectionUtilityProcess: null,
    interconnectNetworkUpgrades: null,
    dataConnectionAvailability: null,
    permittingAuthority: null,
    heightLimit: null,
    projectDocumentType: null,
    // projectOwnerContact: null,
    // projectDeveloperContact: null,
    // projectEPCContact: null,
    isoTerritory: null,
    nercRegion: null,
    country: null,
    projectType: null,
    projectStatus: null,
    eiaId: null,
    dockets: null,
    batteryType: null,
    communitySolar: null,
    coLocatedProject: null,
    projectCapacityMW: null,
    projectClassification: null,
    powerPurchaser: null,
    powerPurchaseAgreementCapacityMW: null,
    powerPurchaseAgreementYears: null,
    supplier: null,
    unitType: null,
    unitSupplied: null,
    firstPowerDate: null,
    firstPowerYear: null,
    projectLastUpdatedDate: null
  });
  const timeKeeping = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  const communitySolarOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  const coLocatedProjectOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  const timeKeepingPeriod = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' }
  ];
  const payrollOn = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'BiWeekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' }
  ];
  const projectKickoff = [
    { label: 'Fall', value: 'Fall' },
    { label: 'Winter', value: 'Winter' },
    { label: 'Spring', value: 'Spring' },
    { label: 'Summer', value: 'Summer' }
  ];
  const interconnectionApproval = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Pending', value: 'Pending' }
  ];

  const getClientList =  () => {
    let temp = [];
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
     getAllClientList(obj)
      .then((res) => {
        if (res) {
          res.data.data.forEach((e) => {
            temp.push({
              label: e.companyName,
              value: e.clientId
            });
          });
          setClients(temp);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => { });
  };

  const getWorkTypeList =  () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
     getAllWorkType(obj)
      .then((res) => {
        if (res.data.data == null) {
          setWorkTypeList([]);
        } else {
          setWorkTypeList(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        // setLoading(false);
      });
  };

  const getAllProjectDocumentType =  () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
     getAllProjectDocumentTypes(obj)
      .then((res) => {
        if (res.data.data == null) {
          setProjectDocumentTypeList([]);
        } else {
          setProjectDocumentTypeList(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        // setLoading(false);
      });
  };


  
  const getProjectData =  async (obj) => {
    
    await getProject(obj)
    .then((res) => {
      if (res) {
        console.log(res);
        setNewProjectId(obj);
        setInitialValues({
          projectName: res.data.data.projectName,
          address1: res.data.data.address1,
          address2: res.data.data.address2,
          city: res.data.data.city,
          state: res.data.data.state,
          zipcode: res.data.data.zipCode,
          internalProjectId: res.data.data.internalProjectId,
          lat: res.data.data.lat,
          long: res.data.data.long,
          certifiedPayrollEmailAddress:
            res.data.data.ownerCertifiedEmailAddress === null
              ? ''
              : res.data.data.ownerCertifiedEmailAddress,
          MoreThanFourEmployees: res.data.data.moreThanFourEmployees,
          EmployeeCount: res.data.data.employeeCount,
          TypicalShiftDay: res.data.data.typicalShiftDay,
          shiftStartTime:
            res.data.data.shiftStartTime === null
              ? null
              : new Date(res.data.data.shiftStartTime),
          shiftEndTime:
            res.data.data.shiftEndTime === null
              ? null
              : new Date(res.data.data.shiftEndTime),
          startDate: res.data.data.startDate,
          endDate: res.data.data.endDate,
          workType: res.data.data.workType,
          totalWorkforceHours: res.data.data.percentageApprenticeWork,
          payPeriodBegin: res.data.data.payPeriodBegin,
          payPeriodEnd: res.data.data.payPeriodEnd,
          projectMegawattSize: res.data.data.projectMegaWattSize,
          projectAcresSize: res.data.data.projectAcres,
          constructionSiteCounties:
            res.data.data.countiesInConstructionSite,
          projectPrimaryCounty: res.data.data.primaryCounties,
          useProscoreMobileApp: timeKeeping.filter(
            (x) => x.value === res.data.data.useProscoreMobileApp
          )[0],
          mobileAppTimeKeepingManagement:
            res.data.data.mobileAppTimeKeepingManagement,
          provideTimeKeepingOn:
            res.data.data.provideTimeKeepingOn !== null
              ? timeKeepingPeriod.filter(
                (x) => x.value === res.data.data.provideTimeKeepingOn
              )[0]
              : null,
          timekeepingSystem: res.data.data.timeKeepingSystem,
          IsAllowMoreThanOneSiteLocation:
            res.data.data.isAllowMoreThanOneSiteLocation,
          IsAllowWorkerToAddMoreThanOneOccupation:
            res.data.data.isAllowWorkerToAddMoreThanOneOccupation,
          IsSubContractor: res.data.data.isSubContractor,
          PayrollOn:
            res.data.data.payrollOn !== null
              ? payrollOn.filter(
                (x) => x.value === res.data.data.payrollOn
              )[0]
              : null,
          targetConstructionStartDate:
            res.data.data.targetConstructionStartDate,
          actualConstructionStartDate:
            res.data.data.actualConstructionStartDate,
          targetCODDate: res.data.data.targetCODDate,
          totalConstructionDays: res.data.data.totalConstructionDays,
          projectKickoff:
            res.data.data.kickoffSeason !== null
              ? projectKickoff.filter(
                (x) => x.value === res.data.data.kickoffSeason
              )[0]
              : null,
          projectCapacityAC: res.data.data.acCapacity,
          projectCapacityDC: res.data.data.dcCapacity,
          moduleSelected: res.data.data.moduleSelected,
          moduleType: res.data.data.moduleType,
          modulQuantity: res.data.data.modulQuantity,
          stringSizes: res.data.data.stringSizes,
          structureSelected: res.data.data.structureSelected,
          structureManufacturer: res.data.data.structureManufacturer,
          rowCount: res.data.data.tableOrRowCount,
          pileAmount: res.data.data.pileAmount,
          pileType: res.data.data.pileType,
          pileEmbedmentDepth: res.data.data.pileEmbedmentDepth,
          blowMinCountRange: res.data.data.blowMinCountRange,
          blowMaxCountRange: res.data.data.blowMaxCountRange,
          inverterSelected: res.data.data.inverterSelected,
          inverterType: res.data.data.inverterType,
          inverterQuantity: res.data.data.inverterQuantity,
          DCRatio: res.data.data.dcRatio,
          ACRatio: res.data.data.acRatio,
          materialProcurement: res.data.data.materialProcurement,
          interconnectingUtility: res.data.data.interconnectingUtility,
          interconnectionApproval:
            res.data.data.interconnectionApproval !== null
              ? interconnectionApproval.filter(
                (x) => x.value === res.data.data.interconnectionApproval
              )[0]
              : null,
          interconnectionTiming: res.data.data.interconnectionTiming,
          interconnectionVoltage: res.data.data.interconnectionVoltage,
          interconnectPoint: res.data.data.interconnectPoint,
          interconnectDistance: res.data.data.interconnectDistance,
          ROWRequired:
            res.data.data.isRowRequired !== null
              ? timeKeeping.filter(
                (x) => x.value === res.data.data.isRowRequired
              )[0]
              : null,
          interconnectQueueStatus: res.data.data.interconnectQueueStatus,
          substationCongestion: res.data.data.substationCongestion,
          interconnectionUtilityProcess:
            res.data.data.interconnectionUtilityProcess,
          interconnectNetworkUpgrades:
            res.data.data.interconnectNetworkUpgrades,
          dataConnectionAvailability:
            res.data.data.dataConnectionAvailability,
          permittingAuthority: res.data.data.permittingAuthority,
          heightLimit: res.data.data.heightLimit,
          projectDocumentType: res.data.data.projectDocumentType,
          projectEPC: res.data.data.projectEPCItem,
          projectOwner: res.data.data.projectOwnerItem,
          projectDeveloper: res.data.data.projectDevelperItem,
          // projectEPCContact: res.data.data.projectEPCContactItem,
          // projectOwnerContact: res.data.data.projectOwnerContactItem,
          // projectDeveloperContact: res.data.data.projectDevelperContactItem
          isoTerritory: res.data.data.isoTerritory,
          nercRegion: res.data.data.nercRegion,
          country: res.data.data.country,
          projectType: res.data.data.projectType,
          projectStatus: res.data.data.projectStatus,
          eiaId: res.data.data.eiaId,
          dockets: res.data.data.dockets,
          batteryType: res.data.data.batteryType,
          communitySolar:
            res.data.data.communitySolar !== null
              ? communitySolarOptions.filter(
                (x) => x.value === res.data.data.communitySolar
              )[0]
              : null,
          coLocatedProject:
            res.data.data.coLocatedProject !== null
              ? coLocatedProjectOptions.filter(
                (x) => x.value === res.data.data.coLocatedProject
              )[0]
              : null,
          projectCapacityMW: res.data.data.projectCapacityMW,
          projectClassification: res.data.data.projectClassification,
          powerPurchaser: res.data.data.powerPurchaser,
          powerPurchaseAgreementCapacityMW:
            res.data.data.powerPurchaseAgreementCapacityMW,
          powerPurchaseAgreementYears:
            res.data.data.powerPurchaseAgreementYears,
          supplier: res.data.data.supplier,
          unitType: res.data.data.unitType,
          unitSupplied: res.data.data.unitSupplied,
          firstPowerDate: res.data.data.firstPowerDate,
          firstPowerYear: res.data.data.firstPowerYear,
          projectLastUpdatedDate: res.data.data.projectLastUpdatedDate
        });
      }
      if (res.data.data.projectEPCItem !== null) {
        getClientContact(res.data.data.projectEPCItem);
      }
      if (res.data.data.projectOwnerItem !== null) {
        getClientContact(res.data.data.projectOwnerItem);
      }
      if (res.data.data.projectDevelperItem !== null) {
        getClientContact(res.data.data.projectDevelperItem);
      }
      if (res.data.data.documentMediaModel !== null) {
        setDocumentUrl(res.data.data.documentMediaModel.base64String);
        setDocumentFileName(res.data.data.documentMediaModel.fileName);
        setDocumentPath(res.data.data.documentMediaModel.path);
      }

      onClick(res.data.data.projectName);
      if (res.data.data.isSubContractor === true) {
        // setShowSubContractor(true);
      } else {
        // setShowSubContractor(false);
      }

      if (res.data.data.MoreThanFourEmployees === true) {
        // setShowEmployeeCount(true);
      } else {
        // setShowEmployeeCount(true);
      }
      if (res.data.data.useProscoreMobileApp === true) {
        setTimekeepingPeriod(true);
        // setTimekeepingProscore(false);
      } else {
        // setTimekeepingProscore(true);
        setTimekeepingPeriod(false);
      }
      const objArray = res.data.data.typicalShiftDay?.split(',');
      if (objArray?.filter((x) => x === 'Sun').length > 0) {
        typicalShiftObj.TypicalShiftDaySun = true;
      } else {
        typicalShiftObj.TypicalShiftDaySun = false;
      }
      if (objArray?.filter((x) => x === 'Mon').length > 0) {
        typicalShiftObj.TypicalShiftDayMon = true;
      } else {
        typicalShiftObj.TypicalShiftDayMon = false;
      }
      if (objArray?.filter((x) => x === 'Tue').length > 0) {
        typicalShiftObj.TypicalShiftDayTue = true;
      } else {
        typicalShiftObj.TypicalShiftDayTue = false;
      }
      if (objArray?.filter((x) => x === 'Wed').length > 0) {
        typicalShiftObj.TypicalShiftDayWed = true;
      } else {
        typicalShiftObj.TypicalShiftDayWed = false;
      }
      if (objArray?.filter((x) => x === 'Sun').length > 0) {
        typicalShiftObj.TypicalShiftDaySun = true;
      } else {
        typicalShiftObj.TypicalShiftDaySun = false;
      }
      if (objArray?.filter((x) => x === 'Thu').length > 0) {
        typicalShiftObj.TypicalShiftDayThu = true;
      } else {
        typicalShiftObj.TypicalShiftDayThu = false;
      }
      if (objArray?.filter((x) => x === 'Fri').length > 0) {
        typicalShiftObj.TypicalShiftDayFri = true;
      } else {
        typicalShiftObj.TypicalShiftDayFri = false;
      }
      if (objArray?.filter((x) => x === 'Sat').length > 0) {
        typicalShiftObj.TypicalShiftDaySat = true;
      } else {
        typicalShiftObj.TypicalShiftDaySat = false;
      }

      setTypicalShiftArray(objArray);

      // For keeping management
      const objArrayKeepingManagement =
        res.data.data.mobileAppTimeKeepingManagement?.split(',');
      if (objArrayKeepingManagement?.filter((x) => x === 'QC').length > 0) {
        mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_QC = true;
      } else {
        mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_QC = false;
      }
      if (objArrayKeepingManagement?.filter((x) => x === 'FC').length > 0) {
        mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_FC = true;
      } else {
        mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_FC = false;
      }
      if (objArrayKeepingManagement?.filter((x) => x === 'MO').length > 0) {
        mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_MO = true;
      } else {
        mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_MO = false;
      }
      setTimeKeepingPeriodArray(objArrayKeepingManagement);
    })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
      });
  };
  React.useEffect(  () => {
    console.log(id);
    setLoading(true);

    if (id) {
         getProjectData(id)
        
    }

     getWorkTypeList();
     getAllProjectDocumentType();
     getClientList();
  }, [id]);

  const handleTimekeepingPeriod = (event) => {
    if (event.target.checked) {
      setTimeKeepingPeriodArray([
        ...timeKeepingPeriodArray,
        event.target.value
      ]);
    } else {
      const array = filterArray(timeKeepingPeriodArray, event.target.value);
      setTimeKeepingPeriodArray(array);
    }
    BindMobileAppTimeKeeping(event.target.name, event.target.checked);
  };

  const filterArray = (array, toRemove) => {
    const index = array.indexOf(toRemove);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  };

  const AddNewProjectName =  (item) => {
    console.log('calling');
    if (item.target.value !== '' && projectId === '' && !id) {
      console.log('called');
      const obj = {
        projectName: item.target.value
      };
       addNewProject(obj)
        .then((res) => {
          if (res.data) {
            setNewProjectId(res.data.data);
            setProjectId(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const BindMobileAppTimeKeeping = (item, val) => {
    setMobileAppTimeKeepingObj({ ...mobileAppTimeKeepingObj, [item]: val });
  };

  const handleDownload = () => {
    const file = documentPath;
    const link = document.createElement('a');
    link.href = file;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const getClientContact = (option) => {
    let temp = [];
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
     getAllContact(obj, option.value)
      .then((res) => {
        if (res) {
          res.data.data.forEach((e) => {
            temp.push({
              label: e.firstName + ' ' + e.lastName,
              value: e.clientContactId
            });
          });
        }
      })
      .catch((e) => console.log(e))
      .finally(() => { });
  };

  return (
    <>
      {!id ? (
        <>
          <Helmet>
            <title>{id ? 'Edit project' : 'Add project'}</title>
          </Helmet>
          <PageTitleWrapper>
            <PageHeader
              Component={Box}
              heading={id ? t('Edit project') : t('Add project')}
              description={
                id
                  ? t('Fill in the below to edit project')
                  : t('Fill in the below to add project')
              }
              pathname={'/projects/project'}
              buttonHeading={t('Go back to all project')}
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
                  validationSchema={Yup.object().shape({
                    projectName: Yup.string()
                      .max(255)
                      .required(t('Required'))
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    internalProjectId: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    address1: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    address2: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    city: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    country: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    nercRegion: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    zipcode: Yup.string().nullable().min(5).max(5),
                    projectType: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    projectStatus: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    batteryType: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    unitType: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    projectClassification: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    moduleSelected: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    moduleType: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    stringSizes: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    inverterSelected: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    inverterType: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    materialProcurement: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    structureSelected: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    structureManufacturer: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    pileType: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    interconnectPoint: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    substationCongestion: Yup.string()
                      .nullable()
                      .matches(
                        OnlyLetters.regexPattern,
                        OnlyLetters.errorMessage
                      ),
                    interconnectionUtilityProcess: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    interconnectNetworkUpgrades: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    dataConnectionAvailability: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    permittingAuthority: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    lat: Yup.string()
                      .nullable()
                      .matches(
                        RealNumber.regexPattern,
                        RealNumber.errorMessage
                      ),
                    long: Yup.string()
                      .nullable()
                      .matches(RealNumber.regexPattern, RealNumber.errorMessage)
                  })}
                  onSubmit={ (
                    _values,
                    { resetForm, setErrors, setStatus, setSubmitting }
                  ) => {
                    try {
                      console.log(_values);
                      const obj = {
                        projectName: _values?.projectName,
                        address1: _values?.address1,
                        address2: _values?.address2,
                        city: _values?.city,
                        state: _values?.state,
                        zipCode:
                          _values?.zipcode !== null
                            ? _values?.zipcode.toString()
                            : null,
                        internalProjectId: _values?.internalProjectId,
                        ownerCertifiedEmailAddress:
                          _values?.certifiedPayrollEmailAddress,
                        lat: _values?.lat,
                        long: _values?.long,
                        percentageApprenticeWork: _values?.totalWorkforceHours,
                        moreThanFourEmployees: _values?.MoreThanFourEmployees,
                        employeeCount: _values?.EmployeeCount,
                        typicalShiftDay:
                          typicalShiftArray?.length > 0
                            ? Array.from(new Set(typicalShiftArray)).toString()
                            : '',
                        timeKeepingSystem: _values?.timeKeepingSystem,
                        startTime:
                          _values?.shiftStartTime !== null
                            ? _values?.shiftStartTime
                              .toTimeString()
                              .split(' ')[0]
                            : null,
                        endTime:
                          _values?.shiftEndTime !== null
                            ? _values?.shiftEndTime.toTimeString().split(' ')[0]
                            : null,
                        payPeriodBegin: _values?.payPeriodBegin,
                        payPeriodEnd: _values?.payPeriodEnd,
                        projectMegaWattSize: _values?.projectMegawattSize,
                        projectAcres: _values?.projectAcresSize,
                        countiesInConstructionSite:
                          _values?.constructionSiteCounties,
                        primaryCounties: _values?.projectPrimaryCounty,
                        startDate: _values?.startDate,
                        endDate: _values?.endDate,
                        workId:
                          _values?.workType !== null
                            ? _values?.workType?.workTypeId
                            : null,
                        useProscoreMobileApp:
                          _values?.useProscoreMobileApp !== null
                            ? _values?.useProscoreMobileApp?.value
                            : null,
                        mobileAppTimeKeepingManagement:
                          timeKeepingPeriodArray?.length > 0
                            ? Array.from(
                              new Set(timeKeepingPeriodArray)
                            ).toString()
                            : '',
                        provideTimeKeepingOn:
                          _values?.provideTimeKeepingOn?.value === undefined
                            ? ''
                            : _values?.provideTimeKeepingOn?.value,
                        isAllowMoreThanOneSiteLocation:
                          _values?.IsAllowMoreThanOneSiteLocation,
                        isAllowWorkerToAddMoreThanOneOccupation:
                          _values?.IsAllowWorkerToAddMoreThanOneOccupation,
                        isSubContractor: _values?.IsSubContractor,
                        payrollOn:
                          _values?.PayrollOn !== null
                            ? _values?.PayrollOn?.value
                            : null,
                        targetConstructionStartDate:
                          _values?.targetConstructionStartDate,
                        actualConstructionStartDate:
                          _values?.actualConstructionStartDate,
                        targetCODDate: _values?.targetCODDate,
                        totalConstructionDays: _values?.totalConstructionDays,
                        kickoffSeason:
                          _values?.projectKickoff !== null
                            ? _values?.projectKickoff?.value
                            : null,
                        acCapacity: _values?.projectCapacityAC,
                        dcCapacity: _values?.projectCapacityDC,
                        moduleSelected: _values?.moduleSelected,
                        moduleType: _values?.moduleType,
                        modulQuantity: _values?.modulQuantity,
                        stringSizes: _values?.stringSizes,
                        structureSelected: _values?.structureSelected,
                        structureManufacturer: _values?.structureManufacturer,
                        tableOrRowCount: _values?.rowCount,
                        pileAmount: _values?.pileAmount,
                        pileType: _values?.pileType,
                        pileEmbedmentDepth: _values?.pileEmbedmentDepth,
                        blowMinCountRange: _values?.blowMinCountRange,
                        blowMaxCountRange: _values?.blowMaxCountRange,
                        inverterSelected: _values?.inverterSelected,
                        inverterType: _values?.inverterType,
                        inverterQuantity: _values?.inverterQuantity,
                        dcRatio: _values?.DCRatio,
                        acRatio: _values?.ACRatio,
                        materialProcurement: _values?.materialProcurement,
                        interconnectingUtility: _values?.interconnectingUtility,
                        interconnectionApproval:
                          _values?.interconnectionApproval !== null
                            ? _values?.interconnectionApproval?.value
                            : null,
                        interconnectionTiming: _values?.interconnectionTiming,
                        interconnectionVoltage: _values?.interconnectionVoltage,
                        interconnectPoint: _values?.interconnectPoint,
                        interconnectDistance: _values?.interconnectDistance,
                        isRowRequired:
                          _values?.ROWRequired !== null
                            ? _values?.ROWRequired?.value
                            : null,
                        interconnectQueueStatus:
                          _values?.interconnectQueueStatus,
                        substationCongestion: _values?.substationCongestion,
                        interconnectionUtilityProcess:
                          _values?.interconnectionUtilityProcess,
                        interconnectNetworkUpgrades:
                          _values?.interconnectNetworkUpgrades,
                        dataConnectionAvailability:
                          _values?.dataConnectionAvailability,
                        permittingAuthority: _values?.permittingAuthority,
                        heightLimit: _values?.heightLimit,
                        projectDocumentTypeId:
                          _values?.projectDocumentType !== null
                            ? _values?.projectDocumentType
                              ?.projectDocumentTypeId
                            : null,
                        projectEPC:
                          _values?.projectEPC !== null
                            ? _values?.projectEPC?.value
                            : null,
                        projectOwner:
                          _values?.projectOwner !== null
                            ? _values?.projectOwner?.value
                            : null,
                        projectDeveloper:
                          _values?.projectDeveloper !== null
                            ? _values?.projectDeveloper?.value
                            : null,
                        isoTerritory: _values?.isoTerritory,
                        nercRegion: _values?.nercRegion,
                        country: _values?.country,
                        projectType: _values?.projectType,
                        projectStatus: _values?.projectStatus,
                        eiaId: _values?.eiaId,
                        dockets: _values?.dockets,
                        batteryType: _values?.batteryType,
                        communitySolar:
                          _values?.communitySolar !== null
                            ? _values?.communitySolar?.value
                            : null,
                        coLocatedProject:
                          _values?.coLocatedProject !== null
                            ? _values?.coLocatedProject?.value
                            : null,
                        projectCapacityMW: _values?.projectCapacityMW,
                        projectClassification: _values?.projectClassification,
                        powerPurchaser: _values?.powerPurchaser,
                        powerPurchaseAgreementCapacityMW:
                          _values?.powerPurchaseAgreementCapacityMW,
                        powerPurchaseAgreementYears:
                          _values?.powerPurchaseAgreementYears,
                        supplier: _values?.supplier,
                        unitType: _values?.unitType,
                        unitSupplied: _values?.unitSupplied,
                        firstPowerDate: _values?.firstPowerDate,
                        firstPowerYear: _values?.firstPowerYear,
                        projectLastUpdatedDate: _values?.projectLastUpdatedDate
                        // projectOwnerContact:
                        //   _values?.projectOwnerContact !== null
                        //     ? _values?.projectOwnerContact?.value
                        //     : null,
                        // projectDeveloperContact:
                        //   _values?.projectDeveloperContact !== null
                        //     ? _values?.projectDeveloperContact?.value
                        //     : null,
                        // projectEPCContact:
                        //   _values?.projectEPCContact !== null
                        //     ? _values?.projectEPCContact?.value
                        //     : null
                      };
                      console.log(obj);

                      if (documentFileName !== '') {
                        obj['documentMediaModel'] = {
                          base64String: documentUrl,
                          fileName: documentFileName
                        };
                      }

                      if (id) {
                        obj['projectId'] = id;
                      } else {
                        obj['projectId'] = projectId;
                      }

                       updateProject(obj)
                        .then((res) => {
                          if (res.data) {
                            resetForm();
                            setStatus({ success: true });
                            setSubmitting(false);
                            navigate('/projects/project', {
                              state: { action: 'updated' }
                            });
                          }
                        })
                        .catch((err) => {
                          setStatus({ success: false });
                          setErrors({ submit: err.message });
                          setSubmitting(false);
                        });
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
                        <Accordion
                          expanded={expandedValues.projectNameAndAddress}
                          onChange={() => {
                            setExpandedValues((prevState) => ({
                              ...prevState,
                              projectNameAndAddress:
                                !expandedValues.projectNameAndAddress
                            }));
                          }}
                          slots={{ transition: Fade }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={{
                            '& .MuiAccordion-region': {
                              height: expandedValues.projectNameAndAddress
                                ? 'auto'
                                : 0
                            },
                            '& .MuiAccordionDetails-root': {
                              display: expandedValues.projectNameAndAddress
                                ? 'block'
                                : 'none'
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
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
                                  Project Name & Address
                                </Typography>
                              </Stack>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider />
                            <Box p={2}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="projectName"
                                    helperText={
                                      touched.projectName && errors.projectName
                                    }
                                    error={Boolean(
                                      touched.projectName && errors.projectName
                                    )}
                                    value={values.projectName}
                                    onBlur={AddNewProjectName}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Project Name')}
                                    placeholder={t('Project Name')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="internalProjectId"
                                    helperText={
                                      touched.internalProjectId &&
                                      errors.internalProjectId
                                    }
                                    error={Boolean(
                                      touched.internalProjectId &&
                                      errors.internalProjectId
                                    )}
                                    value={values.internalProjectId}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Project ID No ')}
                                    placeholder={t('Project ID No ')}
                                  />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="address1"
                                    helperText={
                                      touched.address1 && errors.address1
                                    }
                                    error={Boolean(
                                      touched.address1 && errors.address1
                                    )}
                                    value={values.address1}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Address Line 1')}
                                    placeholder={t('Address Line 1')}
                                  />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="address2"
                                    helperText={
                                      touched.address2 && errors.address2
                                    }
                                    error={Boolean(
                                      touched.address2 && errors.address2
                                    )}
                                    value={values.address2}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Address Line 2')}
                                    placeholder={t('Address Line 2')}
                                  />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="city"
                                    helperText={touched.city && errors.city}
                                    error={Boolean(touched.city && errors.city)}
                                    value={values.city}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('City')}
                                    placeholder={t('City')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="state"
                                    helperText={touched.state && errors.state}
                                    error={Boolean(
                                      touched.state && errors.state
                                    )}
                                    value={values.state}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('State/Province')}
                                    placeholder={t('State/Province')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="zipcode"
                                    helperText={
                                      touched.zipcode && errors.zipcode
                                    }
                                    error={Boolean(
                                      touched.zipcode && errors.zipcode
                                    )}
                                    value={values.zipcode}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Zip')}
                                    placeholder={t('Zip')}
                                    type="number"
                                    inputProps={{ maxLength: 6 }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="projectPrimaryCounty"
                                    helperText={
                                      touched.projectPrimaryCounty &&
                                      errors.projectPrimaryCounty
                                    }
                                    error={Boolean(
                                      touched.projectPrimaryCounty &&
                                      errors.projectPrimaryCounty
                                    )}
                                    value={values.projectPrimaryCounty}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Primary County')}
                                    placeholder={t('Primary County')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="country"
                                    helperText={
                                      touched.country && errors.country
                                    }
                                    error={Boolean(
                                      touched.country && errors.country
                                    )}
                                    value={values.country}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Country')}
                                    placeholder={t('Country')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="nercRegion"
                                    helperText={
                                      touched.nercRegion && errors.nercRegion
                                    }
                                    error={Boolean(
                                      touched.nercRegion && errors.nercRegion
                                    )}
                                    value={values.nercRegion}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('NERC Region')}
                                    placeholder={t('NERC Region')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="isoTerritory"
                                    helperText={
                                      touched.isoTerritory &&
                                      errors.isoTerritory
                                    }
                                    error={Boolean(
                                      touched.isoTerritory &&
                                      errors.isoTerritory
                                    )}
                                    value={values.isoTerritory}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('ISO Territory')}
                                    placeholder={t('ISO Territory')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="lat"
                                    helperText={touched.lat && errors.lat}
                                    error={Boolean(touched.lat && errors.lat)}
                                    value={values.lat}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t(
                                      'Latitude Coordinate (GPS Location)'
                                    )}
                                    placeholder={t(
                                      'Latitude Coordinate (GPS Location)'
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="long"
                                    helperText={touched.long && errors.long}
                                    error={Boolean(touched.long && errors.long)}
                                    value={values.long}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t(
                                      'Longitude Coordinate (GPS Location)'
                                    )}
                                    placeholder={t(
                                      'Longitude Coordinate (GPS Location)'
                                    )}
                                  />
                                </Grid>

                                {/* <Grid item xs={12} md={6} /> */}

                                {/* <Grid item xs={12} md={6}>
                              <FormControlLabel
                                disabled={!newProjectId}
                                control={
                                  <Checkbox
                                    checked={values.IsSubContractor}
                                    onChange={(event) => {
                                      setFieldValue(
                                        'IsSubContractor',
                                        event.target.checked
                                      );
                                      setShowSubContractor(
                                        event.target.checked
                                      );
                                    }}
                                  />
                                }
                                label="What is your companies role on this Project? (drop down list showing Project Owner, Developer, EPC, SubContractor) when choice is selected that data field is autopopulated in the page below"
                              />
                            </Grid> */}
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Card>

                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Accordion
                          expanded={expandedValues.projectOwnership}
                          onChange={() => {
                            setExpandedValues((prevState) => ({
                              ...prevState,
                              projectOwnership: !expandedValues.projectOwnership
                            }));
                          }}
                          slots={{ transition: Fade }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={{
                            '& .MuiAccordion-region': {
                              height: expandedValues.projectOwnership
                                ? 'auto'
                                : 0
                            },
                            '& .MuiAccordionDetails-root': {
                              display: expandedValues.projectOwnership
                                ? 'block'
                                : 'none'
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
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
                                  Project Ownership (Partners)
                                </Typography>
                              </Stack>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider />
                            <Box p={2}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="projectOwner"
                                    name="projectOwner"
                                    options={clients}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={values.projectOwner}
                                    onChange={(event, newValue) => {
                                      setFieldValue('projectOwner', newValue);
                                      getClientContact(newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Who is the Project Owner (Tax Payer/Incentive(s))?"
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} />
                                {/* <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="projectOwnerContact"
                                name="projectOwnerContact"
                                options={projectOwnerContact}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                value={values.projectOwnerContact}
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'projectOwnerContact',
                                    newValue
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Project Owner Contact"
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid> */}
                                {/* <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="certifiedPayrollEmailAddress"
                                    helperText={
                                      touched.certifiedPayrollEmailAddress &&
                                      errors.certifiedPayrollEmailAddress
                                    }
                                    error={Boolean(
                                      touched.certifiedPayrollEmailAddress &&
                                        errors.certifiedPayrollEmailAddress
                                    )}
                                    value={values.certifiedPayrollEmailAddress}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t(
                                      'Owner Certified Payroll Email Address'
                                    )}
                                    placeholder={t(
                                      'Owner Certified Payroll Email Address'
                                    )}
                                  />
                                </Grid> */}

                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="projectDeveloper"
                                    name="projectDeveloper"
                                    options={clients}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={values.projectDeveloper}
                                    onChange={(event, newValue) => {
                                      setFieldValue(
                                        'projectDeveloper',
                                        newValue
                                      );
                                      getClientContact(newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Who is the  Project Developer (if different than Owner)?"
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} />
                                {/* <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="projectDeveloperContact"
                                name="projectDeveloperContact"
                                options={projectDeveloperContact}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                value={values.projectDeveloperContact}
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'projectDeveloperContact',
                                    newValue
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Project Developer Contact"
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid> */}
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="projectEPC"
                                    name="projectEPC"
                                    options={clients}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={values.projectEPC}
                                    onChange={(event, newValue) => {
                                      setFieldValue('projectEPC', newValue);
                                      getClientContact(newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Who is the  Project EPC (if different than Owner & Developer)?"
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} />
                                {/* <Autocomplete
                                id="projectEPCContact"
                                name="projectEPCContact"
                                options={projectEPCContact}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                value={values.projectEPCContact}
                                onChange={(event, newValue) => {
                                  setFieldValue('projectEPCContact', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Project EPC Contact"
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid> */}
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Card>

                      {newProjectId ? (
                        <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                          <Accordion
                            expanded={expandedValues.projectPartners}
                            onChange={() => {
                              setExpandedValues((prevState) => ({
                                ...prevState,
                                projectPartners: !expandedValues.projectPartners
                              }));
                            }}
                            slots={{ transition: Fade }}
                            slotProps={{ transition: { timeout: 400 } }}
                            sx={{
                              '& .MuiAccordion-region': {
                                height: expandedValues.projectPartners
                                  ? 'auto'
                                  : 0
                              },
                              '& .MuiAccordionDetails-root': {
                                display: expandedValues.projectPartners
                                  ? 'block'
                                  : 'none'
                              }
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                            >
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
                                    Project Partners
                                  </Typography>
                                </Stack>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Divider />
                              <Box p={2}>
                                <Grid container spacing={2} mb={4}>
                                  <Grid item xs={12} md={12}>
                                    <ClientContractor
                                      projectId={newProjectId}
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </Card>
                      ) : (
                        ''
                      )}

                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Accordion
                          expanded={expandedValues.projectDetails}
                          onChange={() => {
                            setExpandedValues((prevState) => ({
                              ...prevState,
                              projectDetails: !expandedValues.projectDetails
                            }));
                          }}
                          slots={{ transition: Fade }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={{
                            '& .MuiAccordion-region': {
                              height: expandedValues.projectDetails ? 'auto' : 0
                            },
                            '& .MuiAccordionDetails-root': {
                              display: expandedValues.projectDetails
                                ? 'block'
                                : 'none'
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
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
                                  Project Details
                                </Typography>
                              </Stack>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider />
                            <Box p={2}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="workType"
                                    name="workType"
                                    options={workTypeList}
                                    getOptionLabel={(option) => option.workType}
                                    getOptionValue={(option) =>
                                      option.workTypeId
                                    }
                                    value={values.workType}
                                    onChange={(event, newValue) => {
                                      setFieldValue('workType', newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select Work Type"
                                        variant="outlined"
                                        fullWidth
                                        error={Boolean(
                                          touched.workType && errors.workType
                                        )}
                                        helperText={
                                          touched.workType && errors.workType
                                        }
                                      />
                                    )}
                                  />
                                </Grid>

                                {isTimekeepingPeriod ? (
                                  <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          onChange={handleTimekeepingPeriod}
                                          name="mobileAppTimeKeepingManagement_QC"
                                          checked={
                                            mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_QC
                                          }
                                          value="QC"
                                        />
                                      }
                                      label="QR Code"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          onChange={handleTimekeepingPeriod}
                                          name="mobileAppTimeKeepingManagement_FC"
                                          checked={
                                            mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_FC
                                          }
                                          value="FC"
                                        />
                                      }
                                      label="Facial Recognisation"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          onChange={handleTimekeepingPeriod}
                                          name="mobileAppTimeKeepingManagement_MO"
                                          checked={
                                            mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_MO
                                          }
                                          value="MO"
                                        />
                                      }
                                      label="Multiple Occupation"
                                    />
                                  </Grid>
                                ) : (
                                  <></>
                                )}
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="projectKickoff"
                                    name="projectKickoff"
                                    options={projectKickoff}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={values.projectKickoff}
                                    onChange={(event, newValue) => {
                                      setFieldValue('projectKickoff', newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Project Kickoff (Season)? "
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <DatePicker
                                    label="Actual Construction Start Date"
                                    value={values.actualConstructionStartDate}
                                    onChange={(newValue) => {
                                      setFieldValue(
                                        'actualConstructionStartDate',
                                        newValue
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        placeholder={t(
                                          'Actual Construction Start Date'
                                        )}
                                        error={Boolean(
                                          touched.actualConstructionStartDate &&
                                          errors.actualConstructionStartDate
                                        )}
                                        helperText={
                                          touched.actualConstructionStartDate &&
                                          errors.actualConstructionStartDate
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
                                  <TextField
                                    fullWidth
                                    name="projectType"
                                    helperText={
                                      touched.projectType && errors.projectType
                                    }
                                    error={Boolean(
                                      touched.projectType && errors.projectType
                                    )}
                                    value={values.projectType}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Project Type')}
                                    placeholder={t('Project Type')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="projectStatus"
                                    helperText={
                                      touched.projectStatus &&
                                      errors.projectStatus
                                    }
                                    error={Boolean(
                                      touched.projectStatus &&
                                      errors.projectStatus
                                    )}
                                    value={values.projectStatus}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Project Status')}
                                    placeholder={t('Project Status')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="eiaId"
                                    helperText={touched.eiaId && errors.eiaId}
                                    error={Boolean(
                                      touched.eiaId && errors.eiaId
                                    )}
                                    value={values.eiaId}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('EIA ID')}
                                    placeholder={t('EIA ID')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="dockets"
                                    helperText={
                                      touched.dockets && errors.dockets
                                    }
                                    error={Boolean(
                                      touched.dockets && errors.dockets
                                    )}
                                    value={values.dockets}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Dockets')}
                                    placeholder={t('Dockets')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="batteryType"
                                    helperText={
                                      touched.batteryType && errors.batteryType
                                    }
                                    error={Boolean(
                                      touched.batteryType && errors.batteryType
                                    )}
                                    value={values.batteryType}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Battery Type')}
                                    placeholder={t('Battery Type')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="communitySolar"
                                    name="communitySolar"
                                    options={communitySolarOptions}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={values.communitySolar}
                                    onChange={(event, newValue) => {
                                      setFieldValue('communitySolar', newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select Community Solar?"
                                        variant="outlined"
                                        fullWidth
                                        error={Boolean(
                                          touched.communitySolar &&
                                          errors.communitySolar
                                        )}
                                        helperText={
                                          touched.communitySolar &&
                                          errors.communitySolar
                                        }
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="coLocatedProject"
                                    name="coLocatedProject"
                                    options={coLocatedProjectOptions}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={values.coLocatedProject}
                                    onChange={(event, newValue) => {
                                      setFieldValue(
                                        'coLocatedProject',
                                        newValue
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select Co Located Project?"
                                        variant="outlined"
                                        fullWidth
                                        error={Boolean(
                                          touched.coLocatedProject &&
                                          errors.coLocatedProject
                                        )}
                                        helperText={
                                          touched.coLocatedProject &&
                                          errors.coLocatedProject
                                        }
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="projectCapacityMW"
                                    helperText={
                                      touched.projectCapacityMW &&
                                      errors.projectCapacityMW
                                    }
                                    error={Boolean(
                                      touched.projectCapacityMW &&
                                      errors.projectCapacityMW
                                    )}
                                    value={values.projectCapacityMW}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Project Capacity MW')}
                                    placeholder={t('Project Capacity MW')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="projectClassification"
                                    helperText={
                                      touched.projectClassification &&
                                      errors.projectClassification
                                    }
                                    error={Boolean(
                                      touched.projectClassification &&
                                      errors.projectClassification
                                    )}
                                    value={values.projectClassification}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Project Classification')}
                                    placeholder={t('Project Classification')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="powerPurchaser"
                                    helperText={
                                      touched.powerPurchaser &&
                                      errors.powerPurchaser
                                    }
                                    error={Boolean(
                                      touched.powerPurchaser &&
                                      errors.powerPurchaser
                                    )}
                                    value={values.powerPurchaser}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Power Purchaser')}
                                    placeholder={t('Power Purchaser')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="powerPurchaseAgreementCapacityMW"
                                    helperText={
                                      touched.powerPurchaseAgreementCapacityMW &&
                                      errors.powerPurchaseAgreementCapacityMW
                                    }
                                    error={Boolean(
                                      touched.powerPurchaseAgreementCapacityMW &&
                                      errors.powerPurchaseAgreementCapacityMW
                                    )}
                                    value={
                                      values.powerPurchaseAgreementCapacityMW
                                    }
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t(
                                      'Power Purchase Agreement Capacity MW'
                                    )}
                                    placeholder={t(
                                      'Power Purchase Agreement Capacity MW'
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="powerPurchaseAgreementYears"
                                    helperText={
                                      touched.powerPurchaseAgreementYears &&
                                      errors.powerPurchaseAgreementYears
                                    }
                                    error={Boolean(
                                      touched.powerPurchaseAgreementYears &&
                                      errors.powerPurchaseAgreementYears
                                    )}
                                    value={values.powerPurchaseAgreementYears}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Power Purchase Agreement Years')}
                                    placeholder={t(
                                      'Power Purchase Agreement Years'
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="supplier"
                                    helperText={
                                      touched.supplier && errors.supplier
                                    }
                                    error={Boolean(
                                      touched.supplier && errors.supplier
                                    )}
                                    value={values.supplier}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Supplier')}
                                    placeholder={t('Supplier')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="unitType"
                                    helperText={
                                      touched.unitType && errors.unitType
                                    }
                                    error={Boolean(
                                      touched.unitType && errors.unitType
                                    )}
                                    value={values.unitType}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Unit Type')}
                                    placeholder={t('Unit Type')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="unitSupplied"
                                    helperText={
                                      touched.unitSupplied &&
                                      errors.unitSupplied
                                    }
                                    error={Boolean(
                                      touched.unitSupplied &&
                                      errors.unitSupplied
                                    )}
                                    value={values.unitSupplied}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Unit Supplied')}
                                    placeholder={t('Unit Supplied')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <DatePicker
                                    label="First Power Date"
                                    value={values.firstPowerDate}
                                    onChange={(newValue) => {
                                      setFieldValue('firstPowerDate', newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        placeholder={t('First Power Date')}
                                        error={Boolean(
                                          touched.firstPowerDate &&
                                          errors.firstPowerDate
                                        )}
                                        helperText={
                                          touched.firstPowerDate &&
                                          errors.firstPowerDate
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
                                  <TextField
                                    fullWidth
                                    name="firstPowerYear"
                                    helperText={
                                      touched.firstPowerYear &&
                                      errors.firstPowerYear
                                    }
                                    error={Boolean(
                                      touched.firstPowerYear &&
                                      errors.firstPowerYear
                                    )}
                                    value={values.firstPowerYear}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('First Power Year')}
                                    placeholder={t('First Power Year')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <DatePicker
                                    label="Project Last Updated Date"
                                    value={values.projectLastUpdatedDate}
                                    onChange={(newValue) => {
                                      setFieldValue(
                                        'projectLastUpdatedDate',
                                        newValue
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        placeholder={t(
                                          'Project Last Updated Date'
                                        )}
                                        error={Boolean(
                                          touched.projectLastUpdatedDate &&
                                          errors.projectLastUpdatedDate
                                        )}
                                        helperText={
                                          touched.projectLastUpdatedDate &&
                                          errors.projectLastUpdatedDate
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
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Card>

                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Accordion
                          expanded={expandedValues.projectDetailsRequested}
                          onChange={() => {
                            setExpandedValues((prevState) => ({
                              ...prevState,
                              projectDetailsRequested:
                                !expandedValues.projectDetailsRequested
                            }));
                          }}
                          slots={{ transition: Fade }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={{
                            '& .MuiAccordion-region': {
                              height: expandedValues.projectDetailsRequested
                                ? 'auto'
                                : 0
                            },
                            '& .MuiAccordionDetails-root': {
                              display: expandedValues.projectDetailsRequested
                                ? 'block'
                                : 'none'
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
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
                                  Project Details (Requested Info)
                                </Typography>
                              </Stack>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider />
                            <Box p={2}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="projectAcresSize"
                                    helperText={
                                      touched.projectAcresSize &&
                                      errors.projectAcresSize
                                    }
                                    error={Boolean(
                                      touched.projectAcresSize &&
                                      errors.projectAcresSize
                                    )}
                                    value={values.projectAcresSize}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('How many acres is the project?')}
                                    placeholder={t(
                                      'How many acres is the project?'
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="constructionSiteCounties"
                                    helperText={
                                      touched.constructionSiteCounties &&
                                      errors.constructionSiteCounties
                                    }
                                    error={Boolean(
                                      touched.constructionSiteCounties &&
                                      errors.constructionSiteCounties
                                    )}
                                    value={values.constructionSiteCounties}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t(
                                      'How many counties fall within the construction site?'
                                    )}
                                    placeholder={t(
                                      'How many counties fall within the construction site?'
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="totalConstructionDays"
                                    helperText={
                                      touched.totalConstructionDays &&
                                      errors.totalConstructionDays
                                    }
                                    error={Boolean(
                                      touched.totalConstructionDays &&
                                      errors.totalConstructionDays
                                    )}
                                    value={values.totalConstructionDays}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Total Construction Days (Est.)?')}
                                    placeholder={t(
                                      'Total Construction Days (Est.)?'
                                    )}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <DatePicker
                                    label="Target Construction Start Date"
                                    value={values.targetConstructionStartDate}
                                    onChange={(newValue) => {
                                      setFieldValue(
                                        'targetConstructionStartDate',
                                        newValue
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        placeholder={t(
                                          'Target Construction Start Date'
                                        )}
                                        error={Boolean(
                                          touched.targetConstructionStartDate &&
                                          errors.targetConstructionStartDate
                                        )}
                                        helperText={
                                          touched.targetConstructionStartDate &&
                                          errors.targetConstructionStartDate
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
                                  <TextField
                                    fullWidth
                                    name="projectCapacityAC"
                                    helperText={
                                      touched.projectCapacityAC &&
                                      errors.projectCapacityAC
                                    }
                                    error={Boolean(
                                      touched.projectCapacityAC &&
                                      errors.projectCapacityAC
                                    )}
                                    value={values.projectCapacityAC}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Project Capacity AC (MW)?')}
                                    placeholder={t('Project Capacity AC (MW)?')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="projectCapacityDC"
                                    helperText={
                                      touched.projectCapacityDC &&
                                      errors.projectCapacityDC
                                    }
                                    error={Boolean(
                                      touched.projectCapacityDC &&
                                      errors.projectCapacityDC
                                    )}
                                    value={values.projectCapacityDC}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Project Capacity DC (MW)?')}
                                    placeholder={t('Project Capacity DC (MW)?')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <DatePicker
                                    label="Target COD Date?"
                                    value={values.targetCODDate}
                                    onChange={(newValue) => {
                                      setFieldValue('targetCODDate', newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        placeholder={t('Target COD Date?')}
                                        error={Boolean(
                                          touched.targetCODDate &&
                                          errors.targetCODDate
                                        )}
                                        helperText={
                                          touched.targetCODDate &&
                                          errors.targetCODDate
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
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Card>

                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Accordion
                          expanded={expandedValues.moduleInfo}
                          onChange={() => {
                            setExpandedValues((prevState) => ({
                              ...prevState,
                              moduleInfo: !expandedValues.moduleInfo
                            }));
                          }}
                          slots={{ transition: Fade }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={{
                            '& .MuiAccordion-region': {
                              height: expandedValues.moduleInfo ? 'auto' : 0
                            },
                            '& .MuiAccordionDetails-root': {
                              display: expandedValues.moduleInfo
                                ? 'block'
                                : 'none'
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
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
                                  Project Site: Module Info
                                </Typography>
                              </Stack>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider />
                            <Box p={2}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="moduleSelected"
                                    helperText={
                                      touched.moduleSelected &&
                                      errors.moduleSelected
                                    }
                                    error={Boolean(
                                      touched.moduleSelected &&
                                      errors.moduleSelected
                                    )}
                                    value={values.moduleSelected}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Module Selected')}
                                    placeholder={t('Module Selected')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="moduleType"
                                    helperText={
                                      touched.moduleType && errors.moduleType
                                    }
                                    error={Boolean(
                                      touched.moduleType && errors.moduleType
                                    )}
                                    value={values.moduleType}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Module Type')}
                                    placeholder={t('Module Type')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="modulQuantity"
                                    helperText={
                                      touched.modulQuantity &&
                                      errors.modulQuantity
                                    }
                                    error={Boolean(
                                      touched.modulQuantity &&
                                      errors.modulQuantity
                                    )}
                                    value={values.modulQuantity}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Module Quantity')}
                                    placeholder={t('Module Quantity')}
                                    type="number"
                                  />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="stringSizes"
                                    helperText={
                                      touched.stringSizes && errors.stringSizes
                                    }
                                    error={Boolean(
                                      touched.stringSizes && errors.stringSizes
                                    )}
                                    value={values.stringSizes}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('String Sizes')}
                                    placeholder={t('String Sizes')}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Card>

                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Accordion
                          expanded={expandedValues.structureInfo}
                          onChange={() => {
                            setExpandedValues((prevState) => ({
                              ...prevState,
                              structureInfo: !expandedValues.structureInfo
                            }));
                          }}
                          slots={{ transition: Fade }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={{
                            '& .MuiAccordion-region': {
                              height: expandedValues.structureInfo ? 'auto' : 0
                            },
                            '& .MuiAccordionDetails-root': {
                              display: expandedValues.structureInfo
                                ? 'block'
                                : 'none'
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
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
                                  Project Site: Structure Info
                                </Typography>
                              </Stack>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider />
                            <Box p={2}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="structureSelected"
                                    helperText={
                                      touched.structureSelected &&
                                      errors.structureSelected
                                    }
                                    error={Boolean(
                                      touched.structureSelected &&
                                      errors.structureSelected
                                    )}
                                    value={values.structureSelected}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Structure Selected')}
                                    placeholder={t('Structure Selected')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="structureManufacturer"
                                    helperText={
                                      touched.structureManufacturer &&
                                      errors.structureManufacturer
                                    }
                                    error={Boolean(
                                      touched.structureManufacturer &&
                                      errors.structureManufacturer
                                    )}
                                    value={values.structureManufacturer}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Structure Manufacturer')}
                                    placeholder={t('Structure Manufacturer')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="rowCount"
                                    helperText={
                                      touched.rowCount && errors.rowCount
                                    }
                                    error={Boolean(
                                      touched.rowCount && errors.rowCount
                                    )}
                                    value={values.rowCount}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Table or Row Count')}
                                    placeholder={t('Table or Row Count')}
                                  />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="pileAmount"
                                    helperText={
                                      touched.pileAmount && errors.pileAmount
                                    }
                                    error={Boolean(
                                      touched.pileAmount && errors.pileAmount
                                    )}
                                    value={values.pileAmount}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Pile Amount')}
                                    placeholder={t('Pile Amount')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="pileType"
                                    helperText={
                                      touched.pileType && errors.pileType
                                    }
                                    error={Boolean(
                                      touched.pileType && errors.pileType
                                    )}
                                    value={values.pileType}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Pile Type')}
                                    placeholder={t('Pile Type')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="pileEmbedmentDepth"
                                    helperText={
                                      touched.pileEmbedmentDepth &&
                                      errors.pileEmbedmentDepth
                                    }
                                    error={Boolean(
                                      touched.pileEmbedmentDepth &&
                                      errors.pileEmbedmentDepth
                                    )}
                                    value={values.pileEmbedmentDepth}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Pile Embedment Depth')}
                                    placeholder={t('Pile Embedment Depth')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="blowMinCountRange"
                                    helperText={
                                      touched.blowMinCountRange &&
                                      errors.blowMinCountRange
                                    }
                                    error={Boolean(
                                      touched.blowMinCountRange &&
                                      errors.blowMinCountRange
                                    )}
                                    value={values.blowMinCountRange}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Blow Min Count Range')}
                                    placeholder={t('Blow Min Count Range')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="blowMaxCountRange"
                                    helperText={
                                      touched.blowMaxCountRange &&
                                      errors.blowMaxCountRange
                                    }
                                    error={Boolean(
                                      touched.blowMaxCountRange &&
                                      errors.blowMaxCountRange
                                    )}
                                    value={values.blowMaxCountRange}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Blow Max Count Range')}
                                    placeholder={t('Blow Max Count Range')}
                                    type="number"
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Card>

                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Accordion
                          expanded={expandedValues.inverterDetail}
                          onChange={() => {
                            setExpandedValues((prevState) => ({
                              ...prevState,
                              inverterDetail: !expandedValues.inverterDetail
                            }));
                          }}
                          slots={{ transition: Fade }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={{
                            '& .MuiAccordion-region': {
                              height: expandedValues.inverterDetail ? 'auto' : 0
                            },
                            '& .MuiAccordionDetails-root': {
                              display: expandedValues.inverterDetail
                                ? 'block'
                                : 'none'
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
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
                                  Project Site: Inverter Detail
                                </Typography>
                              </Stack>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider />
                            <Box p={2}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="inverterSelected"
                                    helperText={
                                      touched.inverterSelected &&
                                      errors.inverterSelected
                                    }
                                    error={Boolean(
                                      touched.inverterSelected &&
                                      errors.inverterSelected
                                    )}
                                    value={values.inverterSelected}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Inverter Selected')}
                                    placeholder={t('Inverter Selected')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="inverterType"
                                    helperText={
                                      touched.inverterType &&
                                      errors.inverterType
                                    }
                                    error={Boolean(
                                      touched.inverterType &&
                                      errors.inverterType
                                    )}
                                    value={values.inverterType}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Inverter Type')}
                                    placeholder={t('Inverter Type')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="inverterQuantity"
                                    helperText={
                                      touched.inverterQuantity &&
                                      errors.inverterQuantity
                                    }
                                    error={Boolean(
                                      touched.inverterQuantity &&
                                      errors.inverterQuantity
                                    )}
                                    value={values.inverterQuantity}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Inverter Quantity')}
                                    placeholder={t('Inverter Quantity')}
                                    type="number"
                                  />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="DCRatio"
                                    helperText={
                                      touched.DCRatio && errors.DCRatio
                                    }
                                    error={Boolean(
                                      touched.DCRatio && errors.DCRatio
                                    )}
                                    value={values.DCRatio}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('DC Ratio')}
                                    placeholder={t('DC Ratio')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="ACRatio"
                                    helperText={
                                      touched.ACRatio && errors.ACRatio
                                    }
                                    error={Boolean(
                                      touched.ACRatio && errors.ACRatio
                                    )}
                                    value={values.ACRatio}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('AC Ratio')}
                                    placeholder={t('AC Ratio')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="materialProcurement"
                                    helperText={
                                      touched.materialProcurement &&
                                      errors.materialProcurement
                                    }
                                    error={Boolean(
                                      touched.materialProcurement &&
                                      errors.materialProcurement
                                    )}
                                    value={values.materialProcurement}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Material Procurement')}
                                    placeholder={t('Material Procurement')}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Card>

                      {newProjectId ? (
                        <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                          <Accordion
                            expanded={expandedValues.materialInfo}
                            onChange={() => {
                              setExpandedValues((prevState) => ({
                                ...prevState,
                                materialInfo: !expandedValues.materialInfo
                              }));
                            }}
                            slots={{ transition: Fade }}
                            slotProps={{ transition: { timeout: 400 } }}
                            sx={{
                              '& .MuiAccordion-region': {
                                height: expandedValues.materialInfo ? 'auto' : 0
                              },
                              '& .MuiAccordionDetails-root': {
                                display: expandedValues.materialInfo
                                  ? 'block'
                                  : 'none'
                              }
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                            >
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
                                    Project Site: Material & Equipment
                                    Scheduling Info
                                  </Typography>
                                </Stack>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Divider />
                              <Box p={2}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={12}>
                                    <ProjectScheduling
                                      projectId={newProjectId}
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </Card>
                      ) : (
                        <></>
                      )}

                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Accordion
                          expanded={expandedValues.interconnectionInfo}
                          onChange={() => {
                            setExpandedValues((prevState) => ({
                              ...prevState,
                              interconnectionInfo:
                                !expandedValues.interconnectionInfo
                            }));
                          }}
                          slots={{ transition: Fade }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={{
                            '& .MuiAccordion-region': {
                              height: expandedValues.interconnectionInfo
                                ? 'auto'
                                : 0
                            },
                            '& .MuiAccordionDetails-root': {
                              display: expandedValues.interconnectionInfo
                                ? 'block'
                                : 'none'
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
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
                                  Project Site: Interconnection Info
                                </Typography>
                              </Stack>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider />
                            <Box p={2}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="interconnectingUtility"
                                    helperText={
                                      touched.interconnectingUtility &&
                                      errors.interconnectingUtility
                                    }
                                    error={Boolean(
                                      touched.interconnectingUtility &&
                                      errors.interconnectingUtility
                                    )}
                                    value={values.interconnectingUtility}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Interconnecting Utility')}
                                    placeholder={t('Interconnecting Utility')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="interconnectionApproval"
                                    name="interconnectionApproval"
                                    options={interconnectionApproval}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={values.interconnectionApproval}
                                    onChange={(event, newValue) => {
                                      setFieldValue(
                                        'interconnectionApproval',
                                        newValue
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select Interconnection Approval"
                                        variant="outlined"
                                        fullWidth
                                        error={Boolean(
                                          touched.interconnectionApproval &&
                                          errors.interconnectionApproval
                                        )}
                                        helperText={
                                          touched.interconnectionApproval &&
                                          errors.interconnectionApproval
                                        }
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="interconnectionTiming"
                                    helperText={
                                      touched.interconnectionTiming &&
                                      errors.interconnectionTiming
                                    }
                                    error={Boolean(
                                      touched.interconnectionTiming &&
                                      errors.interconnectionTiming
                                    )}
                                    value={values.interconnectionTiming}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Interconnection Timing')}
                                    placeholder={t('Interconnection Timing')}
                                  />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="interconnectionVoltage"
                                    helperText={
                                      touched.interconnectionVoltage &&
                                      errors.interconnectionVoltage
                                    }
                                    error={Boolean(
                                      touched.interconnectionVoltage &&
                                      errors.interconnectionVoltage
                                    )}
                                    value={values.interconnectionVoltage}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Interconnection Voltage')}
                                    placeholder={t('Interconnection Voltage')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="interconnectPoint"
                                    helperText={
                                      touched.interconnectPoint &&
                                      errors.interconnectPoint
                                    }
                                    error={Boolean(
                                      touched.interconnectPoint &&
                                      errors.interconnectPoint
                                    )}
                                    value={values.interconnectPoint}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Interconnect Point / Substation')}
                                    placeholder={t(
                                      'Interconnect Point / Substation'
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="interconnectDistance"
                                    helperText={
                                      touched.interconnectDistance &&
                                      errors.interconnectDistance
                                    }
                                    error={Boolean(
                                      touched.interconnectDistance &&
                                      errors.interconnectDistance
                                    )}
                                    value={values.interconnectDistance}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Interconnect Distance')}
                                    placeholder={t('Interconnect Distance')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="ROWRequired"
                                    name="ROWRequired"
                                    options={timeKeeping}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={values.ROWRequired}
                                    onChange={(event, newValue) => {
                                      setFieldValue('ROWRequired', newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select ROW Required?"
                                        variant="outlined"
                                        fullWidth
                                        error={Boolean(
                                          touched.ROWRequired &&
                                          errors.ROWRequired
                                        )}
                                        helperText={
                                          touched.ROWRequired &&
                                          errors.ROWRequired
                                        }
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="interconnectQueueStatus"
                                    helperText={
                                      touched.interconnectQueueStatus &&
                                      errors.interconnectQueueStatus
                                    }
                                    error={Boolean(
                                      touched.interconnectQueueStatus &&
                                      errors.interconnectQueueStatus
                                    )}
                                    value={values.interconnectQueueStatus}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Status of Interconnect Queue')}
                                    placeholder={t(
                                      'Status of Interconnect Queue'
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="substationCongestion"
                                    helperText={
                                      touched.substationCongestion &&
                                      errors.substationCongestion
                                    }
                                    error={Boolean(
                                      touched.substationCongestion &&
                                      errors.substationCongestion
                                    )}
                                    value={values.substationCongestion}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Substation Congestion/ Capacity')}
                                    placeholder={t(
                                      'Substation Congestion/ Capacity'
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="interconnectionUtilityProcess"
                                    helperText={
                                      touched.interconnectionUtilityProcess &&
                                      errors.interconnectionUtilityProcess
                                    }
                                    error={Boolean(
                                      touched.interconnectionUtilityProcess &&
                                      errors.interconnectionUtilityProcess
                                    )}
                                    value={values.interconnectionUtilityProcess}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Utility Interconnection Process')}
                                    placeholder={t(
                                      'Utility Interconnection Process'
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="interconnectNetworkUpgrades"
                                    helperText={
                                      touched.interconnectNetworkUpgrades &&
                                      errors.interconnectNetworkUpgrades
                                    }
                                    error={Boolean(
                                      touched.interconnectNetworkUpgrades &&
                                      errors.interconnectNetworkUpgrades
                                    )}
                                    value={values.interconnectNetworkUpgrades}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t(
                                      'Existing Interconnect Network Upgrades'
                                    )}
                                    placeholder={t(
                                      'Existing Interconnect Network Upgrades'
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="dataConnectionAvailability"
                                    helperText={
                                      touched.dataConnectionAvailability &&
                                      errors.dataConnectionAvailability
                                    }
                                    error={Boolean(
                                      touched.dataConnectionAvailability &&
                                      errors.dataConnectionAvailability
                                    )}
                                    value={values.dataConnectionAvailability}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t(
                                      'Data Connection Hardline Availability'
                                    )}
                                    placeholder={t(
                                      'Data Connection Hardline Availability'
                                    )}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Card>

                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Accordion
                          expanded={expandedValues.permittingDetail}
                          onChange={() => {
                            setExpandedValues((prevState) => ({
                              ...prevState,
                              permittingDetail: !expandedValues.permittingDetail
                            }));
                          }}
                          slots={{ transition: Fade }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={{
                            '& .MuiAccordion-region': {
                              height: expandedValues.permittingDetail
                                ? 'auto'
                                : 0
                            },
                            '& .MuiAccordionDetails-root': {
                              display: expandedValues.permittingDetail
                                ? 'block'
                                : 'none'
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
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
                                  Project Site: Permitting & Entitlement Detail
                                </Typography>
                              </Stack>
                            </Box>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Divider />
                            <Box p={2}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="permittingAuthority"
                                    helperText={
                                      touched.permittingAuthority &&
                                      errors.permittingAuthority
                                    }
                                    error={Boolean(
                                      touched.permittingAuthority &&
                                      errors.permittingAuthority
                                    )}
                                    value={values.permittingAuthority}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Permitting Authority')}
                                    placeholder={t('Permitting Authority')}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="heightLimit"
                                    helperText={
                                      touched.heightLimit && errors.heightLimit
                                    }
                                    error={Boolean(
                                      touched.heightLimit && errors.heightLimit
                                    )}
                                    value={values.heightLimit}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t('Height Limit')}
                                    placeholder={t('Height Limit')}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="projectDocumentType"
                                    name="projectDocumentType"
                                    options={projectDocumentTypeList}
                                    getOptionLabel={(option) =>
                                      option.projectDocumentType
                                    }
                                    getOptionValue={(option) =>
                                      option.projectDocumentTypeId
                                    }
                                    value={values.projectDocumentType}
                                    onChange={(event, newValue) => {
                                      setFieldValue(
                                        'projectDocumentType',
                                        newValue
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select Project Document Type"
                                        variant="outlined"
                                        fullWidth
                                        error={Boolean(
                                          touched.projectDocumentType &&
                                          errors.projectDocumentType
                                        )}
                                        helperText={
                                          touched.projectDocumentType &&
                                          errors.projectDocumentType
                                        }
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    type="file"
                                    accept=".jpeg, .jpg, .png, .webp"
                                    onChange={(event) => {
                                      const file = event.currentTarget.files[0];
                                      setDocumentFileName(file.name);

                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        const dataUrl = reader.result;
                                        const cleanedDataUrl =
                                          dataUrl.split(',')[1];
                                        setDocumentUrl(cleanedDataUrl);
                                      };
                                      if (file) {
                                        reader.readAsDataURL(file);
                                      } else {
                                        setDocumentUrl('');
                                      }
                                    }}
                                    onBlur={handleBlur}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  {documentPath === '' ? null : (
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                    >
                                      <Typography variant="subtitle1">
                                        Download File:
                                      </Typography>
                                      <Typography
                                        onClick={handleDownload}
                                        sx={{
                                          cursor: 'pointer',
                                          color: 'blue'
                                        }}
                                        variant="body1"
                                      >
                                        {documentFileName}
                                      </Typography>
                                    </Stack>
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Card>

                      <Card sx={id ? { mx: 0, mb: 3 } : { mx: 3, mb: 3 }}>
                        <Box p={2}>
                          <Stack direction="row" spacing={2} mt={1}>
                            <Button
                              variant="contained"
                              type="submit"
                              disabled={newProjectId ? isSubmitting : true}
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
                              onClick={() => navigate('/projects/project')}
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

export default AddProject;
