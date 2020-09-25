import { Mock } from 'tsmockit';
import { TestHelpers } from 'tsbase-components/utilities/TestHelpers';
import { Timer } from 'tsbase/Utility/Timers/Timer';
import { IDateProvider } from '../../providers/IDateProvider';
import { ClockComponent } from './tsb-clock';

describe('ClockComponent', () => {
  const testDate = new Date();
  const mockDateProvider = new Mock<IDateProvider>();
  let componentUnderTest: ClockComponent;

  beforeEach(() => {
    mockDateProvider.Setup(p => p.GetDate(), testDate);

    componentUnderTest = new ClockComponent(mockDateProvider.Object, new Timer(100));
  });

  it('should construct', () => {
    expect(componentUnderTest).toBeDefined();
  });

  it('should init without data', async () => {
    await componentUnderTest.connectedCallback();
    const content = (componentUnderTest.shadowRoot as ShadowRoot).innerHTML;
    expect(content).toBeDefined();
  });

  it('should get the time display element', async () => {
    await componentUnderTest.connectedCallback();
    const timeDisplay = componentUnderTest.timeDisplay;
    expect(timeDisplay).toBeDefined();
  });

  it('should set the innerText of the time display once a second', async () => {
    await componentUnderTest.connectedCallback();

    const timeDisplaySet = await TestHelpers.TimeLapsedCondition(
      () => componentUnderTest.timeDisplay.innerHTML.indexOf(
        testDate.toLocaleTimeString()) >= 0);

    expect(timeDisplaySet).toBeTruthy();
  });

});
