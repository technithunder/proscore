import React, { useCallback,useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { Formik } from 'formik';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  CircularProgress,
  Grid,
  Autocomplete
} from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {updateProjectClientContractor,getAllClientContractorType, getAllClientList, addNewProjectClientContractor, getProjectClientContractor} from 'src/api/projects/ProjectClientContractor'
import {getAllProjects} from 'src/api/projects/Project'
import { useParams } from 'react-router-dom';

import useRefMounted from 'src/hooks/useRefMounted';



const AddClientContractor = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const[contractType,setContractType]=useState([])
  const[projects,setProjects]=useState([])
  const[clients,setClients]=useState([])
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    client:null,
    project: null,
    contractType: null
  });
  const isMountedRef = useRefMounted();

  const getClientContractorType=async()=>{
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllClientContractorType(obj)
      .then((res) => {
        if (res.data.data == null) {
          setContractType([]);
        } else {
          setContractType(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
      });
  }

  const getProjectList=async()=>{
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllProjects(obj)
      .then((res) => {
        if (res.data.data == null) {
          setProjects([]);
        } else {
          setProjects(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
      });
  }

  const getClientList=useCallback(async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllClientList(obj)
      .then((res) => {
        if (res.data.data == null) {
          setClients([]);
        } else {
          setClients(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
      });
  }, [isMountedRef]);
  
  const filterArray = (array, field, value) => {
    console.log(array)
    console.log(field)
    console.log(value)
    return array.filter(function (item) {
        return item[field] === value
    })
}

  useEffect(async() => {
    setLoading(true);
    await getClientContractorType();
    await getProjectList();
    await getClientList();

    if (id) {
      getProjectClientContractor(id)
        .then((res) => {
          if (res) {
            setInitialValues({
              client:filterArray(clients,'clientId',res.data.data.clientId),
              project:filterArray(projects,'projectId',res.data.data.projectId) ,
              contractType:filterArray(contractType,'clientContractTypeId',res.data.data.clientContractTypeId) 
            });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);


  return (
    <>
      <Helmet>
        <title>{id ? 'Edit Client Contractor' : 'Add Client Contractor'}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={id ? t('Edit Client Contractor') : t('Add Client Contractor')}
          description={
            id
              ? t('Fill in the below to edit client contractor')
              : t('Fill in the below to add client contractor')
          }
          pathname={'/projects/client-contractor'}
          buttonHeading={t('Go back to all client contractor')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <Card sx={{ mx: 3 }}>
        <Box p={2}>
          {loading && id?(
            <>
              <CircularProgress
                size="3rem"
                sx={{ display: 'flex', margin: '0 auto', my: 5 }}
              />
            </>
          ):(<Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              project: Yup.object().nullable().required(t('Required')),
              contractType: Yup.object().nullable().required(t('Required')),
              client: Yup.object().nullable().required(t('Required'))
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              console.log(_values)
              let obj={
                "projectId": _values.project.projectId,
                "clientId": _values.client.clientId,
                "clientContractTypeId": _values.contractType.clientContractTypeId
              }
              try {
                console.log(obj)
                if(id){
                  obj["projectClientContractId"]=id;
                  await updateProjectClientContractor(obj)
                  .then((res) => {
                    if (res.data) {
                      resetForm();
                      setStatus({ success: true });
                      setSubmitting(false);
                      navigate('/projects/client-contractor', { state: { action: "updated" } })
                    }
                  })
                  .catch((err) => {
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                  });
                }else{
                  await addNewProjectClientContractor(obj)
                  .then((res) => {
                    if (res.data) {
                      resetForm();
                      setStatus({ success: true });
                      setSubmitting(false);
                      navigate('/projects/client-contractor', { state: { action: "added" } })
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
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="project"
                      name="project"
                      options={projects}
                      getOptionLabel={(option) => option.projectName}
                      getOptionValue={(option) => option.projectId}
                      value={values.project}
                      onChange={(event, newValue) => {
                        setFieldValue('project', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Project"
                          variant="outlined"
                          fullWidth
                          error={Boolean(touched.project && errors.project)}
                          helperText={touched.project && errors.project}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="contractType"
                      name="contractType"
                      options={contractType}
                      getOptionLabel={(option) => option.clientContractType}
                      getOptionValue={(option) => option.clientContractTypeId}
                      value={values.contractType}
                      onChange={(event, newValue) => {
                        setFieldValue('contractType', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Contract Type"
                          variant="outlined"
                          fullWidth
                          error={Boolean(
                            touched.contractType && errors.contractType
                          )}
                          helperText={
                            touched.contractType && errors.contractType
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="client"
                      name="client"
                      options={clients}
                      getOptionLabel={(option) => option.contactFirstName+" "+option.contactLastName }
                      getOptionValue={(option) => option.clientId}
                      value={values.client}
                      onChange={(event, newValue) => {
                        setFieldValue('client', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Client"
                          variant="outlined"
                          fullWidth
                          error={Boolean(
                            touched.client && errors.client
                          )}
                          helperText={
                            touched.client && errors.client
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2} mt={5}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    color="primary"
                  >
                    {t('Submit')}
                  </Button>
                  <Button
                    variant="outlined"
                    type="submit"
                    onClick={() => navigate('/projects/client-contractor')}
                    color="primary"
                  >
                    {t('Cancel')}
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>)}
          
        </Box>
      </Card>
    </>
  );
};

export default AddClientContractor;
