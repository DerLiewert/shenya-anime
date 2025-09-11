import { getMonthName } from '../../utils/getMonthName';

interface FormatDateProps {
  date: {
    day: number | null;
    month: number | null;
    year: number | null;
  };
}

export const FormatDate = ({ date }: FormatDateProps) => {
  if (!date.year) return null;

  const dayPart = date.day ? `${date.day} ` : '';
  const monthPart = date.month ? `${getMonthName(date.month)} ` : '';
  const yearPart = date.year ? date.year : '';

  return (
    <>
      {dayPart}
      {monthPart}
      {yearPart}
    </>
  );
};
