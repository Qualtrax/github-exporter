import { HeaderComponent } from './tsb-header';

describe('HeaderComponent', () => {
  let componentUnderTest: HeaderComponent;

  beforeEach(() => {
    componentUnderTest = new HeaderComponent();
  });

  it('should construct', () => {
    expect(componentUnderTest).toBeDefined();
  });

  it('should init without data', async () => {
    await componentUnderTest.connectedCallback();
    const content = (componentUnderTest.shadowRoot as ShadowRoot).innerHTML;
    expect(content).toBeDefined();
  });
});
