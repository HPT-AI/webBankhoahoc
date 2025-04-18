import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import RevenueDashboard from './pages/analytics/RevenueDashboard';
import CommissionReportPage from './pages/analytics/CommissionReportPage';
import ExportPage from './pages/analytics/ExportPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/analytics/revenue',
    element: <RevenueDashboard />,
  },
  {
    path: '/analytics/commission',
    element: <CommissionReportPage />,
  },
  {
    path: '/analytics/export',
    element: <ExportPage />,
  },
]);
