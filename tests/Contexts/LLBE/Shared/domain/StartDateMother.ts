import { PastDateMother } from '../../../Shared/domain/PastDateMother';
import { StartDate } from '../../../../../src/Contexts/LLBE/Shared/domain/StartDate';

// TODO: FIX the end date maybe later than start date
export class StartDateMother {
  static create(value: string): StartDate {
    return new StartDate(value);
  }

  static random(): StartDate {
    return this.create(PastDateMother.random().toISOString().substr(0, 7));
  }
}
