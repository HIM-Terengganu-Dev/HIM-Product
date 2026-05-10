import { formatInTimeZone } from 'date-fns-tz';

const MALAYSIA_TIMEZONE = 'Asia/Kuala_Lumpur';

export function formatMYT(date: Date | string | number, formatStr: string) {
  return formatInTimeZone(new Date(date), MALAYSIA_TIMEZONE, formatStr);
}
