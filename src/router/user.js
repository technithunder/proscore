import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';
// import AddUser from 'src/content/User/User1/AddUser';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const User1 = Loader(lazy(() => import('src/content/User/User1')));
// const AddUser = Loader(lazy(() => import('src/content/User/User1/AddUser')));

const userRoutes = [
  {
    path: '',
    element: <Navigate to="user1" replace />
  },
  {
    path: 'user1',
    // element: <User1 />,
    children: [
      {
        path: '',
        element: <Navigate to="user1" replace />
      },
      {
        path: 'user1',
        element: <User1 />
      }
    ]
  },
  {
    path: 'user2',
    element: <User1 />
  }
];

export default userRoutes;
