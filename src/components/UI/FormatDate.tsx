import { Link } from 'react-router-dom';
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
  const yearPart = (
    <Link to="#" className="link">
      {date.year}
    </Link>
  );

  return (
    <>
      {dayPart}
      {monthPart}
      {yearPart}
    </>
  );
};
