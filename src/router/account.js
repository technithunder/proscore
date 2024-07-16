import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Account

const LoginBasic = Loader(
  lazy(() => import('src/content/pages/Auth/Login/Basic'))
);


const accountRoutes = [
  {
    path: 'login-basic',
    element: <LoginBasic />
  }
];

export default accountRoutes;
