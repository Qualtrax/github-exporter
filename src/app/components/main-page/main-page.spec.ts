import { HttpClient, HttpRequestMessage, HttpResponseMessage, KeyValue, Repository, Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { MainPageComponent } from './main-page';

describe('HomeComponent', () => {
  const mockHttpClient = new Mock<HttpClient>();
  const mockSettingsRepository = new Mock<Repository<KeyValue>>();
  let componentUnderTest: MainPageComponent;

  beforeEach(() => {
    mockHttpClient.Setup(c => c.SendAsync(
      new HttpRequestMessage()), new HttpResponseMessage(Strings.Empty, { Code: 200, Text: 'OK' }));
    mockSettingsRepository.Setup(r => r.Add({ key: Strings.Empty, value: Strings.Empty }));
    mockSettingsRepository.Setup(r => r.Find(() => true), null);
    mockSettingsRepository.Setup(r => r.SaveChanges());

    componentUnderTest = new MainPageComponent(mockHttpClient.Object, mockSettingsRepository.Object);
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
