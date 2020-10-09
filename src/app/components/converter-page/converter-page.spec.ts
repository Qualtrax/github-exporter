import { ConverterPageComponent } from './converter-page';

describe('HomeComponent', () => {
  let componentUnderTest: ConverterPageComponent;

  beforeEach(() => {
    componentUnderTest = new ConverterPageComponent();
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
