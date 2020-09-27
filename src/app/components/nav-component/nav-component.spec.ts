import { NavigationComponent } from './nav-component';

describe('NavComponent', () => {
  let componentUnderTest: NavigationComponent;

  beforeEach(() => {
    componentUnderTest = new NavigationComponent();
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
