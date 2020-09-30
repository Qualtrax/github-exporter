import { Strings } from 'tsbase';
import { Settings } from '../enums/module';
import { ISettingsService, SettingsService } from '../services/file-system/SettingsService';
import { Issue } from './GitHubDataTypes';

export const AzureWorkItemFields = [
  'Work Item Type', 'Title', 'Description', 'Tags', 'Created Date', 'State'
];

export class AzureDevopsWorkItem {
  public workItemType = Strings.Empty;
  public title = Strings.Empty;
  public description = Strings.Empty;
  public tags = Strings.Empty;
  public createdDate = Strings.Empty;
  public state = Strings.Empty;

  constructor(issue: Issue, settingsService: ISettingsService = SettingsService.Instance()) {
    if (issue) {
      const commentsStringMap = issue.comments.nodes.map(n => /*html*/
        (`<h3>Author: ${n.author.login} | Date: ${n.createdAt}</h3>${this.minified(n.bodyHTML)}`)).toString();

      this.workItemType = settingsService.GetSettingOrDefault(Settings.WorkItemType);
      this.title = this.minified(issue.title);
      this.description =
        `<h2>GitHub Description</h2>${this.minified(issue.bodyHTML)}<h2>GitHub Comments</h2>${commentsStringMap}`;
      this.tags = issue.labels.nodes.map(n => n.name).toString();
      this.createdDate = issue.createdAt;
      this.state = issue.closedAt === null ?
        settingsService.GetSettingOrDefault(Settings.WorkItemOpenState) :
        settingsService.GetSettingOrDefault(Settings.WorkItemClosedState);
    }
  }

  private minified(string: string): string {
    return JSON.stringify(string)
      .slice(1, -1)
      .replace(/,/g, '&#44;')
      .replace(/\"/g, '&quot;')
      .replace(/\\n/g, Strings.Empty);
  }
}
