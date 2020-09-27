import { KeyValue, Strings } from 'tsbase';
import { Component, BaseComponent, SeoService, Html, DomEventTypes } from 'tsbase-components';
import { Settings } from '../../enums/Settings';
import { SettingsService } from '../../services/file-system/SettingsService';

const ids = {
  saveButton: 'saveButton'
};

@Component({ selector: 'settings-page', route: '/settings' })
export class SettingsPageComponent extends BaseComponent {
  private settings: Array<KeyValue> = [
    { key: Settings.GitHubAuthToken, value: 'GitHub Auth Token' }
  ];

  constructor(private settingsRepository = SettingsService.Instance.Repository) {
    super();
  }

  protected onInit = async (): Promise<void> => {
    SeoService.Instance.SetDefaultTags('Settings');
  }

  protected template = (): string => /*html*/ `
  <div class="settings-page-component">
    <h1>Settings</h1>

    <ul>
      ${Html.ForEach(this.settings, (setting: KeyValue) => /*html*/ `
      <li>
        <label for="${setting.key}">${setting.value}</label>
        <input id="${setting.key}" type="text" value="${this.getSettingValue(setting.key)}">
      </li>`)}
    </ul>

    <button id="${ids.saveButton}">Save Changes</button>
  </div>
  `;

  protected onPostRender = (): void => {
    this.addEventListenerToElementId(ids.saveButton, DomEventTypes.Click, () => {
      this.updateSettings();

      const result = this.settingsRepository.SaveChanges();

      if (result.IsSuccess) {
        alert('Changes saved');
      } else {
        alert(result.ErrorMessages);
      }
    });
  }

  private getSettingValue = (settingKey: string): string => {
    const savedSetting = this.settingsRepository.Find(s => s.key === settingKey);
    return savedSetting ? savedSetting.value : Strings.Empty;
  }

  private updateSettings = () => {
    this.settings.forEach(setting => {
      const settingInput = this.Dom.getElementById(setting.key) as HTMLInputElement;
      const persistedSetting = this.settingsRepository.Find(s => s.key === setting.key);
      if (persistedSetting) {
        persistedSetting.value = settingInput.value;
      } else {
        this.settingsRepository.Add({ key: setting.key, value: settingInput.value });
      }
    });
  }
}
