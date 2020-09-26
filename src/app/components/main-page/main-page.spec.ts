import { MainPageComponent } from './main-page';

describe('HomeComponent', () => {
  let componentUnderTest: MainPageComponent;

  beforeEach(() => {
    componentUnderTest = new MainPageComponent();
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
