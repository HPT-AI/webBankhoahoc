import React from 'react';
import { Result, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Result
      status="404"
      title="404"
      subTitle={t('notFound.message')}
      extra={
        <Link to="/">
          <Button type="primary">{t('notFound.backHome')}</Button>
        </Link>
      }
    />
  );
};

export default NotFoundPage;
