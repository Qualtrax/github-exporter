import { Mock, Times } from 'tsmockit';
import { SkipLinkComponent } from './tsb-skip-link';
import { IUtility } from '../../services/utility/IUtility';
import { Strings } from 'tsbase/Constants/Strings';

describe('SkipLinkComponent', () => {
  const mockUtility = new Mock<IUtility>();
  let componentUnderTest: SkipLinkComponent;

  beforeEach(() => {
    componentUnderTest = new SkipLinkComponent();
  });

  it('should construct', () => {
    expect(componentUnderTest).toBeDefined();
  });

  it('should init without data', async () => {
    await componentUnderTest.connectedCallback();
    const content = (componentUnderTest.shadowRoot as ShadowRoot).innerHTML;
    expect(content).toBeDefined();
  });

  it('should init with data', async () => {
    componentUnderTest.setAttribute('text', 'test');
    componentUnderTest.setAttribute('skipToId', 'test-id');
    await componentUnderTest.connectedCallback();
    const content = (componentUnderTest.shadowRoot as ShadowRoot).innerHTML;
    expect(content).toBeDefined();
  });

  it('should contain a skip to button - scrolling to an id when clicked', async () => {
    mockUtility.Setup(u => u.ScrollToElementId(Strings.Empty), null);
    componentUnderTest = new SkipLinkComponent(mockUtility.Object);
    componentUnderTest.setAttribute('text', 'test');
    componentUnderTest.setAttribute('skipToId', 'test-id');
    await componentUnderTest.connectedCallback();
    const skipButton = componentUnderTest.Dom.getElementById(componentUnderTest.skipLinkButtonId);

    if (skipButton) {
      skipButton.click();
    }

    mockUtility.Verify(u => u.ScrollToElementId(Strings.Empty), Times.Once);
  });
});
