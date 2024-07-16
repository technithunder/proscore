import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

const EmployeeCertification = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>Calendar - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <Typography variant="h3" component="h3" gutterBottom>
          {t('Certification')}
        </Typography>
      </PageTitleWrapper>
    </>
  );
};

export default EmployeeCertification;
