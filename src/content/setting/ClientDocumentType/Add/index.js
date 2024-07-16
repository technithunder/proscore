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

const AddClientDocument = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    value: ''
  };

  const fields = [
    {
      name: 'value',
      label: t('Client Document Type'),
      validationSchema: Yup.string().max(255).required(t('Required'))
    }
  ];

  const handleSave = (value) => {
    console.log('==>', value);
    navigate('/setting/clientdocument-type');
  };

  return (
    <>
      <Helmet>
        <title>Client Document Type - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Client Document Type')}
          description={'Fill in the below to add client document type '}
          pathname={'/setting/clientdocument-type'}
          buttonHeading={t('Go back to all client document type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <SettingType
        title="Add Client Document Type"
        onCancel={() => navigate('/setting/clientdocument-type')}
        initialValues={initialValues}
        fields={fields}
        onSave={handleSave}
      />
    </>
  );
};

export default AddClientDocument;
