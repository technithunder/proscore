import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';
import ViewApprentice from 'src/content/RAP/ManageAssignRAP/Apprentice/View/ViewApprentice';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const RAP = Loader(lazy(() => import('src/content/RAP')));

const ManageAssignRAP = Loader(
  lazy(() => import('src/content/RAP/ManageAssignRAP'))
);

const AddRAPWageScale = Loader(
  lazy(() => import('src/content/RAP/ManageAssignRAP/WageScale/Add'))
);

const rapRoutes = [
  {
    path: '',
    element: <Navigate to="RAP" replace />
  },
  {
    path: 'RAP',
    element: <RAP />,
    children: [
      {
        path: 'ManageAssignRAP/:id',
        element: <ManageAssignRAP />,
        children: [
          {
            path: 'wage-scale/add',
            element: <AddRAPWageScale />
          },
          {
            path: 'wage-scale/edit/:id',
            element: <AddRAPWageScale />
          }
        ]
      },
      {
        path: 'view/:id',
        element: <ViewApprentice />
      }
    ]
  }
];

export default rapRoutes;
