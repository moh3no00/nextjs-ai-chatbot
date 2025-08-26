import moment from 'moment-jalaali';

// Configure moment-jalaali for Persian calendar
moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false });

export class PersianDate {
  static format(date: Date | string | null | undefined, format: string = 'jYYYY/jMM/jDD'): string {
    if (!date) return '';
    return moment(date).format(format);
  }

  static formatWithMonthName(date: Date | string | null | undefined): string {
    if (!date) return '';
    return moment(date).format('jDD jMMMM jYYYY');
  }

  static formatDateTime(date: Date | string | null | undefined): string {
    if (!date) return '';
    return moment(date).format('jYYYY/jMM/jDD - HH:mm');
  }

  static toGregorian(persianDate: string): Date {
    return moment(persianDate, 'jYYYY/jMM/jDD').toDate();
  }

  static now(): string {
    return moment().format('jYYYY/jMM/jDD');
  }

  static nowDateTime(): string {
    return moment().format('jYYYY/jMM/jDD - HH:mm');
  }

  static isToday(date: Date | string | null | undefined): boolean {
    if (!date) return false;
    return moment(date).isSame(moment(), 'day');
  }

  static isAfter(date1: Date | string, date2: Date | string): boolean {
    return moment(date1).isAfter(moment(date2));
  }

  static isBefore(date1: Date | string, date2: Date | string): boolean {
    return moment(date1).isBefore(moment(date2));
  }

  static diffDays(date1: Date | string, date2: Date | string): number {
    return moment(date1).diff(moment(date2), 'days');
  }

  static addDays(date: Date | string, days: number): Date {
    return moment(date).add(days, 'days').toDate();
  }

  static startOfMonth(date?: Date | string): Date {
    return moment(date).startOf('jMonth').toDate();
  }

  static endOfMonth(date?: Date | string): Date {
    return moment(date).endOf('jMonth').toDate();
  }

  static getMonthNames(): string[] {
    return [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 
      'مرداد', 'شهریور', 'مهر', 'آبان', 
      'آذر', 'دی', 'بهمن', 'اسفند'
    ];
  }

  static getDayNames(): string[] {
    return [
      'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 
      'چهارشنبه', 'پنج‌شنبه', 'جمعه'
    ];
  }

  static validate(dateString: string): boolean {
    return moment(dateString, 'jYYYY/jMM/jDD', true).isValid();
  }

  static getYearRange(startYear: number, endYear: number): number[] {
    const years: number[] = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  }

  static getCurrentPersianYear(): number {
    return moment().jYear();
  }

  static formatRelative(date: Date | string): string {
    if (!date) return '';
    
    const targetMoment = moment(date);
    const now = moment();
    const diffDays = now.diff(targetMoment, 'days');
    
    if (diffDays === 0) return 'امروز';
    if (diffDays === 1) return 'دیروز';
    if (diffDays === -1) return 'فردا';
    if (diffDays > 1 && diffDays < 7) return `${diffDays} روز پیش`;
    if (diffDays < -1 && diffDays > -7) return `${Math.abs(diffDays)} روز دیگر`;
    
    return targetMoment.format('jDD jMMMM jYYYY');
  }
}

export default PersianDate;
