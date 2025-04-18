import React from 'react';
import { DatePicker, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { DateRange } from '../../../types/analytics';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (_: unknown, dateStrings: [string, string]) => {
    if (dateStrings && dateStrings.length === 2) {
      onChange({
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      });
    }
  };

  return (
    <Card title={t('analytics.selectDateRange')} style={{ marginBottom: 16 }}>
      <RangePicker 
        value={[
          value.startDate ? dayjs(value.startDate) : null, 
          value.endDate ? dayjs(value.endDate) : null
        ]} 
        onChange={handleChange} 
        style={{ width: '100%' }}
      />
    </Card>
  );
};

export default DateRangePicker;
