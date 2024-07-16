import { Suspense, lazy, useContext } from 'react';
import Authenticated from 'src/components/Authenticated';
import { Navigate } from 'react-router-dom';
import BaseLayout from 'src/layouts/BaseLayout';
import AccentSidebarLayout from 'src/layouts/AccentSidebarLayout';
import SuspenseLoader from 'src/components/SuspenseLoader';
import dashboardsRoutes from './dashboards';
import accountRoutes from './account';
import baseRoutes from './base';
import projectRoutes from './project';
// import clientRoutes from './client';
import employeeRoutes from './employee';
import rapRoutes from './rap';
// import userRoutes from './user';
import reportRoutes from './report';
import settingRoutes from './setting';
import useAuth from 'src/hooks/useAuth';
import { SidebarContext } from 'src/contexts/SidebarContext';
import CollapsedSidebarLayout from 'src/layouts/CollapseSidebarLayout';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const User1 = Loader(lazy(() => import('src/content/User/User1')));
const AddUser = Loader(lazy(() => import('src/content/User/User1/AddUser')));
const MyAccount = Loader(lazy(() => import('src/content/account/MyAccount')));
const ForgotPassword = Loader(
  lazy(() => import('src/content/pages/Auth/ForgotPassword'))
);
const Otp = Loader(lazy(() => import('src/content/pages/Auth/Otp')));
const ResetPassword = Loader(
  lazy(() => import('src/content/pages/Auth/ResetPassword'))
);
const Client = Loader(lazy(() => import('src/content/client/Client')));
const AddClient = Loader(lazy(() => import('src/content/client/Client/Add')));
const ClientView = Loader(lazy(() => import('src/content/client/Client/View')));
const Test = Loader(lazy(() => import('src/content/test')));

const AddClientDocument = Loader(
  lazy(() => import('src/content/client/Document/Add'))
);
const AddClientNotes = Loader(
  lazy(() => import('src/content/client/Notes/Add'))
);
const AddContact = Loader(lazy(() => import('src/content/client/Contact/Add')));

const ForgotPasswordWrapper = () => {
  const auth = useAuth();
  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return <ForgotPassword />;
};

const OtpWrapper = () => {
  const auth = useAuth();
  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return <Otp />;
};

const PasswordWrapper = () => {
  const auth = useAuth();
  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return <ResetPassword />;
};

const CollapeSidebarWrapper = () => {
  const { collapseSidebar } = useContext(SidebarContext);

  return (
    <div>
      {collapseSidebar ? <CollapsedSidebarLayout /> : <AccentSidebarLayout />}
    </div>
  );
};

const router = [
  {
    path: 'account',
    children: accountRoutes
  },

  {
    path: 'forgot-password',
    element: <ForgotPasswordWrapper />
  },

  {
    path: 'resetpassword-otp',
    element: <OtpWrapper />
  },

  {
    path: 'reset-password',
    element: <PasswordWrapper />
  },

  {
    path: '',
    element: <BaseLayout />,
    children: baseRoutes
  },

  // AccentSidebarLayout Sidebar Layout

  {
    path: '/',
    element: (
      <Authenticated>
        <CollapeSidebarWrapper />
      </Authenticated>
    ),
    children: [
      {
        path: 'dashboard',
        children: dashboardsRoutes
      },
      {
        path: 'myaccount',
        element: <MyAccount />
      },
      {
        path: 'test',
        element: <Test />
      },
      {
        path: 'partner',
        element: <Client />,
        children: [
          {
            path: 'add',
            element: <AddClient />
          },
          {
            path: 'edit/:id',
            element: <AddClient />
          },
          {
            path: 'view/:id',
            element: <ClientView />,
            children: [
              {
                path: 'contact/add',
                element: <AddContact />
              },
              {
                path: 'contact/edit/:clientcontactId',
                element: <AddContact />
              },
              {
                path: 'document/add',
                element: <AddClientDocument />
              },
              {
                path: 'document/edit/:clientDocumentId',
                element: <AddClientDocument />
              },
              {
                path: 'notes/add',
                element: <AddClientNotes />
              },
              {
                path: 'notes/edit/:clientNoteId',
                element: <AddContact />
              }
            ]
          }
        ]
      },
      {
        path: 'projects',
        children: projectRoutes
      },
      {
        path: 'RAP',
        children: rapRoutes
      },
      {
        path: 'employee',
        children: employeeRoutes
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            element: <Navigate to="user1" replace />
          },
          {
            path: 'user1',
            element: <User1 />,
            children: [
              {
                path: 'add-user',
                element: <AddUser />
              }
            ]
          }
        ]
      },
      {
        path: 'report',
        children: reportRoutes
      },
      {
        path: 'setting',
        children: settingRoutes
      }
    ]
  }
];

export default router;
