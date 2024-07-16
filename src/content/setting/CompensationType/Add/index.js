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

const AddCompensation = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    value: ''
  };

  const fields = [
    {
      name: 'value',
      label: t('Compensation Type'),
      validationSchema: Yup.string().max(255).required(t('Required'))
    }
  ];

  const handleSave = (value) => {
    console.log('==>', value);
    navigate('/setting/compensation-type');
  };

  return (
    <>
      <Helmet>
        <title>Add Compensation Type - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Compensation Type')}
          description={'Fill in the below to add compensation type '}
          pathname={'/setting/compensation-type'}
          buttonHeading={t('Go back to all compensation type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <SettingType
        title="Add Compensation Type"
        onCancel={() => navigate('/setting/compensation-type')}
        initialValues={initialValues}
        fields={fields}
        onSave={handleSave}
      />
    </>
  );
};

export default AddCompensation;
