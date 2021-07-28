
export function convertFixedDate(date: string): Date {
  return new Date(Date.parse(date));
}
