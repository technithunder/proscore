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

const AddEmployeeTermType = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    value: ''
  };

  const fields = [
    {
      name: 'value',
      label: t('Employee Term Type'),
      validationSchema: Yup.string().max(255).required(t('Required'))
    }
  ];

  const handleSave = (value) => {
    console.log('==>', value);
    navigate('/setting/employeeterm-type');
  };

  return (
    <>
      <Helmet>
        <title>Add Employee Term Type - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Employee Term Type')}
          description={'Fill in the below to add employee term type '}
          pathname={'/setting/employeeterm-type'}
          buttonHeading={t('Go back to all employee term type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <SettingType
        title="Add Employee Term Type"
        onCancel={() => navigate('/setting/employeeterm-type')}
        initialValues={initialValues}
        fields={fields}
        onSave={handleSave}
      />
    </>
  );
};

export default AddEmployeeTermType;
