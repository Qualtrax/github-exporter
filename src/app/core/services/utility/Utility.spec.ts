import { Mock, Times } from 'tsmockit';
import { Utility } from './Utility';

describe('Utility', () => {
  const mockWindow = new Mock<Window>();
  let classUnderTest: Utility;

  beforeAll(() => {
    classUnderTest = Utility.Instance();
    const jsdomWindow = classUnderTest.Window;
    expect(jsdomWindow).toEqual(window);
  });

  beforeEach(() => {
    mockWindow.Setup(w => w.scrollTo(), null);
    classUnderTest = Utility.Instance(mockWindow.Object);
  });

  it('should construct', () => {
    classUnderTest = Utility.Instance();
    expect(classUnderTest).toBeDefined();
  });

  it('should scroll to element with id', () => {
    const div = document.createElement('div');
    div.id = 'myDiv';
    document.body.appendChild(div);

    classUnderTest.ScrollToElementId(div.id);

    mockWindow.Verify(w => w.scrollTo(), Times.Once);
  });

  it('should not attempt to scroll to element with id when not present', () => {
    classUnderTest.ScrollToElementId('fake');

    mockWindow.Verify(w => w.scrollTo(), Times.Never);
  });

  it('should possess a window property equal to the override given', () => {
    const windowProp = classUnderTest.Window;

    expect(windowProp).toBe(mockWindow.Object);
  });

});
