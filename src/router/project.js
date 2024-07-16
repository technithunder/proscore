import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Project = Loader(lazy(() => import('src/content/projects/Project')));

const AddProject = Loader(
  lazy(() => import('src/content/projects/Project/Add'))
);


const ManageProject = Loader(
  lazy(() => import('src/content/projects/Project/ManageProject'))
);

const AddClientContractor = Loader(
  lazy(() => import('src/content/projects/Project/ManageProject/ProjectClientContractor/Add'))
);


const AddProjectEmployee = Loader(
  lazy(() => import('src/content/projects/Project/ManageProject/ProjectEmployee/Add'))
);

const AddProjectJobTitle = Loader(
  lazy(() => import('src/content/projects/Project/ManageProject/ProjectJobTitle/Add'))
);

const projectRoutes = [
  {
    path: '',
    element: <Navigate to="project" replace />
  },
  {
    path: 'project',
    element: <Project />,
    children: [
      {
        path: 'add',
        element: <AddProject />
      },
      {
        path: 'edit/:id',
        element: <AddProject />
      },
      {
        path: 'ManageProject/:id',
        element: <ManageProject />,
        children: [
          {
            path: 'client-contractor/add',
            element: <AddClientContractor />
          },
          {
            path: 'client-contractor/edit/:id',
            element: <AddClientContractor />
          },
          {
            path: 'project-employee/add',
            element: <AddProjectEmployee />
          },
          {
            path: 'project-employee/edit/:id',
            element: <AddProjectEmployee />
          },
          {
            path: 'project-job-title/add',
            element: <AddProjectJobTitle />
          },
          {
            path: 'project-job-title/edit/:id',
            element: <AddProjectJobTitle />
          }
        ]
      }
    ]
  },
];

export default projectRoutes;
