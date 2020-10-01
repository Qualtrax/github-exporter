import { KeyValue, Repository, Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { Settings } from '../../enums/module';
import { ISettingsService } from '../../services/file-system/SettingsService';
import { SettingsPageComponent } from './settings-page';

describe('SettingsPageComponent', () => {
  const mockSettingsService = new Mock<ISettingsService>();
  const mockSettingsRepository = new Mock<Repository<KeyValue>>();
  let componentUnderTest: SettingsPageComponent;

  beforeEach(() => {
    mockSettingsRepository.Setup(r => r.Add({ key: Strings.Empty, value: Strings.Empty }));
    mockSettingsRepository.Setup(r => r.Find(() => true), null);
    mockSettingsRepository.Setup(r => r.SaveChanges());
    mockSettingsService.Setup(s => s.Repository, mockSettingsRepository.Object);
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.GitHubAuthToken), Strings.Empty);

    componentUnderTest = new SettingsPageComponent(mockSettingsService.Object);
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
