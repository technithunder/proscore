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

const DepartmentType = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    value: ''
  };

  const fields = [
    {
      name: 'value',
      label: t('Industry Type'),
      validationSchema: Yup.string().max(255).required(t('Required'))
    }
  ];

  const handleSave = (value) => {
    console.log('==>', value);
    navigate('/setting/industry-type');
  };

  return (
    <>
      <Helmet>
        <title>Add Industry Type - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Industry Type')}
          description={'Fill in the below to add industry type'}
          pathname={'/setting/industry-type'}
          buttonHeading={t('Go back to all industry type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <SettingType
        onCancel={() => navigate('/setting/industry-type')}
        initialValues={initialValues}
        fields={fields}
        onSave={handleSave}
      />
    </>
  );
};

export default DepartmentType;
