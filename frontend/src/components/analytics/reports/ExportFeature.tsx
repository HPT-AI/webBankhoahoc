import React, { useState } from 'react';
import { Card, Form, Select, Button, Input, DatePicker, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ReportConfig } from '../../../types/analytics';
import { analyticsService } from '../../../services/analytics';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ExportFeature: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [reportType, setReportType] = useState<'revenue' | 'commission'>('revenue');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    try {
      const config: ReportConfig = {
        reportType: values.reportType,
        frequency: values.frequency,
        recipients: values.recipients.split(',').map((email: string) => email.trim()),
      };

      if (values.dateRange && values.dateRange.length === 2) {
        config.dateRange = {
          startDate: values.dateRange[0].format('YYYY-MM-DD'),
          endDate: values.dateRange[1].format('YYYY-MM-DD'),
        };
      }

      if (values.reportType === 'commission' && values.instructorId) {
        config.instructorId = values.instructorId;
      }

      await analyticsService.scheduleAutomaticReports(config);
      message.success(t('analytics.reportScheduled'));
      form.resetFields();
    } catch {
      message.error(t('analytics.reportSchedulingFailed'));
    }
  };

  const handleReportTypeChange = (type: 'revenue' | 'commission') => {
    setReportType(type);
  };

  return (
    <Card title={t('analytics.scheduleReports')} style={{ marginTop: 16 }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="reportType"
          label={t('analytics.reportType')}
          rules={[{ required: true, message: t('analytics.pleaseSelectReportType') }]}
          initialValue="revenue"
        >
          <Select onChange={handleReportTypeChange}>
            <Option value="revenue">{t('analytics.revenueReport')}</Option>
            <Option value="commission">{t('analytics.commissionReport')}</Option>
          </Select>
        </Form.Item>

        {reportType === 'commission' && (
          <Form.Item
            name="instructorId"
            label={t('analytics.instructorId')}
            rules={[{ required: true, message: t('analytics.pleaseEnterInstructorId') }]}
          >
            <Input placeholder={t('analytics.enterInstructorId')} />
          </Form.Item>
        )}

        <Form.Item
          name="dateRange"
          label={t('analytics.dateRange')}
          rules={[{ required: true, message: t('analytics.pleaseSelectDateRange') }]}
        >
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="frequency"
          label={t('analytics.frequency')}
          rules={[{ required: true, message: t('analytics.pleaseSelectFrequency') }]}
          initialValue="monthly"
        >
          <Select>
            <Option value="daily">{t('analytics.daily')}</Option>
            <Option value="weekly">{t('analytics.weekly')}</Option>
            <Option value="monthly">{t('analytics.monthly')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="recipients"
          label={t('analytics.recipients')}
          rules={[{ required: true, message: t('analytics.pleaseEnterRecipients') }]}
        >
          <Input placeholder={t('analytics.enterEmailsSeparatedByCommas')} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('analytics.scheduleReport')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ExportFeature;
