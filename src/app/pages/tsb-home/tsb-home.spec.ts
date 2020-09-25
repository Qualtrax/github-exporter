import { HomeComponent } from './tsb-home';

describe('HomeComponent', () => {
  let componentUnderTest: HomeComponent;

  beforeEach(() => {
    componentUnderTest = new HomeComponent();
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
