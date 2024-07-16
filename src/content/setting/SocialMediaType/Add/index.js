import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import * as Yup from 'yup';
import SettingType from 'src/components/SettingType';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SocialMediaType = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    value: ''
  };

  const fields = [
    {
      name: 'value',
      label: t('Social Media Type'),
      validationSchema: Yup.string().max(255).required(t('Required'))
    }
  ];

  const handleSave = (value) => {
    console.log('==>', value);
    navigate('/setting/socialMedia-type');
  };

  return (
    <>
      <Helmet>
        <title>Add Address Type - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Social Media Type')}
          description={'Fill in the below to add social media type'}
          pathname={'/setting/socialMedia-type'}
          buttonHeading={t('Go back to social media type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <SettingType
        title="Add ScocialMedia Type"
        onCancel={() => navigate('/setting/socialMedia-type')}
        initialValues={initialValues}
        fields={fields}
        onSave={handleSave}
      />
    </>
  );
};

export default SocialMediaType;
