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
import {addWork} from 'src/api/settings/WorkType'

const AddWork = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    value: ''
  };

  const fields = [
    {
      name: 'value',
      label: t('Work Type'),
      validationSchema: Yup.string().max(255).required(t('Required'))
    }
  ];

  const handleSave = (value) => {
    addWork(value);
    console.log('==>', value);
  };

  return (
    <>
      <Helmet>
        <title>Add Work Type - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Work Type')}
          description={'Fill in the below to add work type '}
          pathname={'/setting/work-type'}
          buttonHeading={t('Go back to all work type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <SettingType
        title="Add work Type"
        onCancel={() => navigate('/setting/work-type')}
        initialValues={initialValues}
        fields={fields}
        onSave={handleSave}
      />
    </>
  );
};

export default AddWork;
