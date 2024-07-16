import { Suspense, lazy } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Analytics = Loader(
  lazy(() => import('src/content/dashboards/Analytics'))
);

const dashboardsRoutes = [
  {
    path: '',
    element: <Analytics />
  }
];

export default dashboardsRoutes;
