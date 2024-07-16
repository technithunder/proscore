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

const AddFringePaymentMethodType = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    value: ''
  };

  const fields = [
    {
      name: 'value',
      label: t('Fringe Payment Method Type'),
      validationSchema: Yup.string().max(255).required(t('Required'))
    }
  ];

  const handleSave = (value) => {
    console.log('==>', value);
    navigate('/setting/fringepaymentmethod-type');
  };

  return (
    <>
      <Helmet>
        <title>Add Fringe Payment Method Type - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Fringe Payment Method Type')}
          description={'Fill in the below to add fringe payment method type '}
          pathname={'/setting/fringepaymentmethod-type'}
          buttonHeading={t('Go back to all fringe payment method type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <SettingType
        onCancel={() => navigate('/setting/fringepaymentmethod-type')}
        initialValues={initialValues}
        fields={fields}
        onSave={handleSave}
      />
    </>
  );
};

export default AddFringePaymentMethodType;
