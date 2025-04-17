import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { AppRouter } from './routes';
import './i18n';
import { theme } from './theme';
import { queryClient } from './utils/queryClient';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <AppRouter />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
