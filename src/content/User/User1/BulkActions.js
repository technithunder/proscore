import { Box, Button, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

function BulkActions({ onClick }) {
  const { t } = useTranslation();

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ButtonError
          sx={{
            ml: 1
          }}
          startIcon={<DeleteTwoToneIcon />}
          variant="contained"
          onClick={onClick}
        >
          {t('Delete')}
        </ButtonError>
      </Box>
    </>
  );
}

export default BulkActions;
