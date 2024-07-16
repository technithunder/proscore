import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Report1 = Loader(lazy(() => import('src/content/report/Report1')));

const reportRoutes = [
  {
    path: '',
    element: <Navigate to="CertifiedPayrollReport" replace />
  },
  {
    path: 'CertifiedPayrollReport',
    element: <Report1 />
  }
];

export default reportRoutes;
