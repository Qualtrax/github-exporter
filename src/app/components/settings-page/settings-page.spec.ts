import { KeyValue, Repository, Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { SettingsPageComponent } from './settings-page';

describe('SettingsPageComponent', () => {
  const mockSettingsRepository = new Mock<Repository<KeyValue>>();
  let componentUnderTest: SettingsPageComponent;

  beforeEach(() => {
    mockSettingsRepository.Setup(r => r.Add({ key: Strings.Empty, value: Strings.Empty }));
    mockSettingsRepository.Setup(r => r.Find(() => true), null);
    mockSettingsRepository.Setup(r => r.SaveChanges());

    componentUnderTest = new SettingsPageComponent(mockSettingsRepository.Object);
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
