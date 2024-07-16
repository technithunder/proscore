import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const AddressType = Loader(
  lazy(() => import('src/content/setting/AddressType'))
);
const BonusType = Loader(lazy(() => import('src/content/setting/BonusType')));
const WorkType = Loader(lazy(() => import('src/content/setting/WorkType')));
const CompensationType = Loader(
  lazy(() => import('src/content/setting/CompensationType'))
);
const ClientDocumentType = Loader(
  lazy(() => import('src/content/setting/ClientDocumentType'))
);
const EmployeeDocumentType = Loader(
  lazy(() => import('src/content/setting/EmployeeDocumentType'))
);
const ProjectType = Loader(
  lazy(() => import('src/content/setting/ProjectType'))
);
const DepartmentType = Loader(
  lazy(() => import('src/content/setting/DepartmentType'))
);
const SocialMediaType = Loader(
  lazy(() => import('src/content/setting/SocialMediaType'))
);
const ClientContractType = Loader(
  lazy(() => import('src/content/setting/ClientContractType'))
);
const IndustryType = Loader(
  lazy(() => import('src/content/setting/IndustryType'))
);

const EmployeeStatusType = Loader(
  lazy(() => import('src/content/setting/EmployeeStatusType'))
);
const FringePaymentMethodType = Loader(
  lazy(() => import('src/content/setting/FringePaymentMethodType'))
);
const JobCategory = Loader(
  lazy(() => import('src/content/setting/JobCategory'))
);
const EmployeeTermType = Loader(
  lazy(() => import('src/content/setting/EmployeeTermType'))
);
const AddAddress = Loader(
  lazy(() => import('src/content/setting/AddressType/Add'))
);
const AddWork = Loader(lazy(() => import('src/content/setting/WorkType/Add')));
const AddBonus = Loader(
  lazy(() => import('src/content/setting/BonusType/Add'))
);
const AddCompensation = Loader(
  lazy(() => import('src/content/setting/CompensationType/Add'))
);
const AddEmployeeDocument = Loader(
  lazy(() => import('src/content/setting/EmployeeDocumentType/Add'))
);
const AddProject = Loader(
  lazy(() => import('src/content/setting/ProjectType/Add'))
);
const AddIndustry = Loader(
  lazy(() => import('src/content/setting/IndustryType/Add'))
);
const AddDepartment = Loader(
  lazy(() => import('src/content/setting/DepartmentType/Add'))
);
const AddSocialMedia = Loader(
  lazy(() => import('src/content/setting/SocialMediaType/Add'))
);
const AddClientContractType = Loader(
  lazy(() => import('src/content/setting/ClientContractType/Add'))
);
const AddClientDocumentType = Loader(
  lazy(() => import('src/content/setting/ClientDocumentType/Add'))
);
const AddEmployeeStatusType = Loader(
  lazy(() => import('src/content/setting/EmployeeStatusType/Add'))
);
const AddEmployeeTermType = Loader(
  lazy(() => import('src/content/setting/EmployeeTermType/Add'))
);
const AddFringePaymentMethodType = Loader(
  lazy(() => import('src/content/setting/FringePaymentMethodType/Add'))
);
const AddJobCategory = Loader(
  lazy(() => import('src/content/setting/JobCategory/Add'))
);
const LanguageType = Loader(
  lazy(() => import('src/content/setting/LanguageType'))
);
const AddLanguage = Loader(
  lazy(() => import('src/content/setting/LanguageType/Add'))
);
const NotificationType = Loader(
  lazy(() => import('src/content/setting/NoficationType'))
);
const AddNotification = Loader(
  lazy(() => import('src/content/setting/NoficationType/Add'))
);
const JobTitle = Loader(lazy(() => import('src/content/setting/JobTitle')));
const AddJobTitle = Loader(
  lazy(() => import('src/content/setting/JobTitle/Add'))
);
const settingRoutes = [
  {
    path: 'address-type',
    element: <AddressType />,
    children: [
      {
        path: 'add',
        element: <AddAddress />
      },
      {
        path: 'edit/:id',
        element: <AddAddress />
      }
    ]
  },
  {
    path: 'bonus-type',
    element: <BonusType />,
    children: [
      {
        path: 'add',
        element: <AddBonus />
      }
    ]
  },
  {
    path: 'compensation-type',
    element: <CompensationType />,
    children: [
      {
        path: 'add',
        element: <AddCompensation />
      }
    ]
  },
  {
    path: 'clientdocument-type',
    element: <ClientDocumentType />,
    children: [
      {
        path: 'add',
        element: <AddClientDocumentType />
      }
    ]
  },
  {
    path: 'employeedocument-type',
    element: <EmployeeDocumentType />,
    children: [
      {
        path: 'add',
        element: <AddEmployeeDocument />
      }
    ]
  },
  {
    path: 'work-type',
    element: <WorkType />,
    children: [
      {
        path: 'add',
        element: <AddWork />
      }
    ]
  },
  {
    path: 'project-type',
    element: <ProjectType />,
    children: [
      {
        path: 'add',
        element: <AddProject />
      }
    ]
  },
  {
    path: 'industry-type',
    element: <IndustryType />,
    children: [
      {
        path: 'add',
        element: <AddIndustry />
      }
    ]
  },
  {
    path: 'department-type',
    element: <DepartmentType />,
    children: [
      {
        path: 'add',
        element: <AddDepartment />
      },
      {
        path: 'edit/:id',
        element: <AddDepartment />
      }
    ]
  },
  {
    path: 'socialMedia-type',
    element: <SocialMediaType />,
    children: [
      {
        path: 'add',
        element: <AddSocialMedia />
      }
    ]
  },
  {
    path: 'clientcontract-type',
    element: <ClientContractType />,
    children: [
      {
        path: 'add',
        element: <AddClientContractType />
      },
      {
        path: 'edit/:id',
        element: <AddClientContractType />
      }
    ]
  },
  {
    path: 'employeestatus-type',
    element: <EmployeeStatusType />,
    children: [
      {
        path: 'add',
        element: <AddEmployeeStatusType />
      }
    ]
  },
  {
    path: 'employeeterm-type',
    element: <EmployeeTermType />,
    children: [
      {
        path: 'add',
        element: <AddEmployeeTermType />
      }
    ]
  },
  {
    path: 'fringepaymentmethod-type',
    element: <FringePaymentMethodType />,
    children: [
      {
        path: 'add',
        element: <AddFringePaymentMethodType />
      }
    ]
  },
  {
    path: 'jobcategory',
    element: <JobCategory />,
    children: [
      {
        path: 'add',
        element: <AddJobCategory />
      }
    ]
  },
  {
    path: 'language-type',
    element: <LanguageType />,
    children: [
      {
        path: 'add',
        element: <AddLanguage />
      },
      {
        path: 'edit/:id',
        element: <AddLanguage />
      }
    ]
  },
  {
    path: 'notification-type',
    element: <NotificationType />,
    children: [
      {
        path: 'add',
        element: <AddNotification />
      }
    ]
  },
  {
    path: 'job-title',
    element: <JobTitle />,
    children: [
      {
        path: 'add',
        element: <AddJobTitle />
      }
    ]
  }
];

export default settingRoutes;
