import { DateProvider } from './DateProvider';
import { IDateProvider } from './IDateProvider';

describe('DateProvider', () => {
  let classUnderTest: IDateProvider;

  beforeEach(() => {
    classUnderTest = new DateProvider();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should get date', () => {
    const date = classUnderTest.GetDate();
    expect(date).toBeDefined();
  });

});
