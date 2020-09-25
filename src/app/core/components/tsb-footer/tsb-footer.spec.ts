import { FooterComponent } from './tsb-footer';

describe('FooterComponent', () => {
  let componentUnderTest: FooterComponent;

  beforeEach(() => {
    componentUnderTest = new FooterComponent();
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
