/* eslint-disable max-len */
import { Strings } from 'tsbase';
import { Component, BaseComponent, SeoService, DomEventTypes } from 'tsbase-components';
import { IssueStatus } from '../../enums/module';
import { Settings } from '../../enums/Settings';
import { SettingsService } from '../../services/file-system/SettingsService';

const ids = {
  saveButton: 'saveButton',
  paginationSliderLabel: 'paginationSliderLabel'
};

@Component({ selector: 'settings-page', route: '/settings' })
export class SettingsPageComponent extends BaseComponent {
  private settingsMap = new Map<string, string>([
    [Settings.GitHubAuthToken, 'GitHub Auth Token' ],
    [Settings.IssueStatus, 'Issue Status' ],
    [Settings.PaginationCount, 'Pagination Count'],
    [Settings.RepositoryName, 'Repository Name'],
    [Settings.RepositoryOwner, 'Repository Owner']
  ]);

  constructor(private settingsRepository = SettingsService.Instance().Repository) {
    super();
  }

  protected onInit = async (): Promise<void> => {
    SeoService.Instance.SetDefaultTags('Settings');
  }

  protected template = (): string => /*html*/ `
  <div class="settings-page-component">
    <h1>Settings</h1>

    <ul>
      <li>
        <label for="${Settings.GitHubAuthToken}">${this.settingsMap.get(Settings.GitHubAuthToken)}</label>
        <input id="${Settings.GitHubAuthToken}" type="text" value="${this.getSettingValue(Settings.GitHubAuthToken)}">
      </li>

      <li>
        <label for="${Settings.RepositoryOwner}">${this.settingsMap.get(Settings.RepositoryOwner)}</label>
        <input id="${Settings.RepositoryOwner}" type="text" value="${this.getSettingValue(Settings.RepositoryOwner)}">
      </li>

      <li>
        <label for="${Settings.RepositoryName}">${this.settingsMap.get(Settings.RepositoryName)}</label>
        <input id="${Settings.RepositoryName}" type="text" value="${this.getSettingValue(Settings.RepositoryName)}">
      </li>

      <li>
        <label for="${Settings.IssueStatus}">${this.settingsMap.get(Settings.IssueStatus)}</label>
        <select id="${Settings.IssueStatus}" value="${this.getSettingValue(Settings.IssueStatus)}">
          <option value="${IssueStatus.Open}"
            ${this.getSettingValue(Settings.IssueStatus) === IssueStatus.Open ? 'selected="selected"' : Strings.Empty}>${IssueStatus.Open}</option>

          <option value="${IssueStatus.Closed}"
            ${this.getSettingValue(Settings.IssueStatus) === IssueStatus.Closed ? 'selected="selected"' : Strings.Empty}>${IssueStatus.Closed}</option>
        </select>
      </li>

      <li>
        <label for="${Settings.PaginationCount}">${this.settingsMap.get(Settings.PaginationCount)} | <span id="${ids.paginationSliderLabel}">${this.getSettingValue(Settings.PaginationCount)}</span></label>
        <input id="${Settings.PaginationCount}" value="${this.getSettingValue(Settings.PaginationCount)}"
          type="range" min="1" max="100">
      </li>
    </ul>

    <button id="${ids.saveButton}">Save Changes</button>
  </div>
  `;

  protected onPostRender = (): void => {
    this.addEventListenerToElementId(Settings.PaginationCount, DomEventTypes.Change, () => {
      const paginationSliderLabel = this.Dom.getElementById(ids.paginationSliderLabel) as HTMLSpanElement;
      const paginationValue = (this.Dom.getElementById(Settings.PaginationCount) as HTMLInputElement).value;
      paginationSliderLabel.innerText = paginationValue;
    });

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
    for (const setting of this.settingsMap) {
      const key = setting[0];

      const settingInput = this.Dom.getElementById(key) as HTMLInputElement;
      const persistedSetting = this.settingsRepository.Find(s => s.key === key);
      if (persistedSetting) {
        persistedSetting.value = settingInput.value;
      } else {
        this.settingsRepository.Add({ key: key, value: settingInput.value });
      }
    }
  }
}
