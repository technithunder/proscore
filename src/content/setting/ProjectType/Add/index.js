import React from 'react';
import { Helmet } from 'react-helmet-async';
import SettingType from 'src/components/SettingType';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Box } from '@mui/material';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProjectType = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    value: ''
  };

  const fields = [
    {
      name: 'value',
      label: t('Project Type'),
      validationSchema: Yup.string().max(255).required(t('Required'))
    }
  ];

  const handleSave = (value) => {
    console.log('==>', value);
    navigate('/setting/project-type');
  };

  return (
    <>
      <Helmet>
        <title>Add Project Type - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Project Type')}
          description={'Fill in the below to add project type'}
          pathname={'/setting/project-type'}
          buttonHeading={t('Go back to project type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <SettingType
        onCancel={() => navigate('/setting/project-type')}
        initialValues={initialValues}
        fields={fields}
        onSave={handleSave}
      />
    </>
  );
};

export default ProjectType;
