import React from 'react';
import { Helmet } from 'react-helmet-async';
import SettingType from 'src/components/SettingType';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/material';

const AddEmployeeDocument = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    value: ''
  };

  const fields = [
    {
      name: 'value',
      label: t('Employee Document Type'),
      validationSchema: Yup.string().max(255).required(t('Required'))
    }
  ];

  const handleSave = (value) => {
    console.log('==>', value);
    navigate('/setting/employeedocument-type');
  };

  return (
    <>
      <Helmet>
        <title>Employee Document Type - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Employee Document Type')}
          description={'Fill in the below to add employee document type '}
          pathname={'/setting/employeedocument-type'}
          buttonHeading={t('Go back to all employee document type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <SettingType
        title="Add Employee Document Type"
        onCancel={() => navigate('/setting/employeedocument-type')}
        initialValues={initialValues}
        fields={fields}
        onSave={handleSave}
      />
    </>
  );
};

export default AddEmployeeDocument;
