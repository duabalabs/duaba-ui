import { Outlet, Route, Routes } from 'react-router-dom';

import { ErrorComponent, useNotificationProvider } from '@refinedev/antd';
import { Authenticated, Refine } from '@refinedev/core';
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';

import { useParseConnect } from '@duabalabs/lib-parse';

import { FullScreenLoading, Layout } from './components';
import { authProvider, dataProvider } from './providers';
import { liveProvider } from './providers/liveProvider';
import { resources } from './resources';
import { DashboardPage } from './routes/dashboard';
import { ForgotPasswordPage } from './routes/forgot-password';
import { LoginPage } from './routes/login';
import { RegisterPage } from './routes/register';
import { UpdatePasswordPage } from './routes/update-password';
import { environmentVariables } from './utilities/getEnvironmentVariables';

const Dashboard: React.FC = () => {
  const { loadingParse: initialLoad } = useParseConnect(
    environmentVariables.parseConfig
  );
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly.

  if (initialLoad) {
    return <FullScreenLoading />;
  }

  return (
    <Refine
      authProvider={authProvider}
      dataProvider={dataProvider}
      liveProvider={liveProvider}
      routerProvider={routerProvider}
      resources={resources}
      notificationProvider={useNotificationProvider}
      options={{
        liveMode: 'off',
        syncWithLocation: false,
        warnWhenUnsavedChanges: false,
      }}
    >
      <Routes>
        <Route
          element={
            <Authenticated
              key="authenticated-layout"
              fallback={<CatchAllNavigate to="/login" />}
            >
              <Layout>
                <Outlet />
              </Layout>
            </Authenticated>
          }
        >
          <Route index element={<DashboardPage />} />

          <Route path="*" element={<ErrorComponent />} />
        </Route>
        <Route
          element={
            <Authenticated key="authenticated-auth" fallback={<Outlet />}>
              <NavigateToResource resource="dashboard" />
            </Authenticated>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
        </Route>
      </Routes>
      <UnsavedChangesNotifier />
      <DocumentTitleHandler />
    </Refine>
  );
};

export default Dashboard;
