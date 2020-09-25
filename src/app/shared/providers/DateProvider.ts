import { IDateProvider } from './IDateProvider';

export class DateProvider implements IDateProvider {
  GetDate(): Date {
    return new Date();
  }
}
