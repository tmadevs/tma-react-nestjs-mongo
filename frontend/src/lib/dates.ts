import { useTranslation } from 'react-i18next';

export const formatDate = (date: Date | string): string => {
  const { t } = useTranslation();
  
  const currentDate = new Date();
  const targetDate = new Date(date);


  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const isTomorrow = (date1: Date, date2: Date): boolean => {
    const tomorrow = new Date(date1);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return isSameDay(tomorrow, date2);
  };

  if (isSameDay(currentDate, targetDate)) {
    return t('today'); // Today string from i18n
  } else if (isTomorrow(currentDate, targetDate)) {
    return t('tomorrow'); // Tomorrow string from i18n
  } else {
    // Format the date according to the current locale
    return targetDate.toLocaleString();
  }
};
