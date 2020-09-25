import { NotFoundComponent } from './tsb-not-found';

describe('NotFoundComponent', () => {
  let componentUnderTest: NotFoundComponent;

  beforeEach(() => {
    componentUnderTest = new NotFoundComponent();
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
