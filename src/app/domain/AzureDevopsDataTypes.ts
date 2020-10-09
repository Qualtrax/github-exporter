import { Strings } from 'tsbase';
import { Settings } from '../enums/module';
import { ISettingsService, SettingsService } from '../services/file-system/SettingsService';
import { Issue } from './GitHubDataTypes';

export const AzureWorkItemFields = [
  'Work Item Type', 'Title', 'Description', 'Created Date', 'State'
];

export class AzureDevopsWorkItem {
  public workItemType = Strings.Empty;
  public title = Strings.Empty;
  public description = Strings.Empty;
  public createdDate = Strings.Empty;
  public state = Strings.Empty;

  constructor(issue: Issue, settingsService: ISettingsService = SettingsService.Instance()) {
    if (issue) {
      // eslint-disable-next-line max-len
      const comments = issue.comments.nodes.map(n => /*html*/ (`<h3>Author: ${n.author.login} | Date: ${n.createdAt}</h3>${n.bodyHTML}`)).toString();
      const labels = issue.labels.nodes.map(n => n.name).toString();

      this.workItemType = settingsService.GetSettingOrDefault(Settings.WorkItemType);
      this.title = this.minify(issue.title);
      this.description = this.minify(`<h2>GitHub ID: ${issue.number}</h2>
<h2>GitHub Labels</h2>${labels}\
<h2>GitHub Description</h2>${issue.bodyHTML}\
<h2>GitHub Comments</h2>${comments}`);
      this.createdDate = issue.createdAt;
      this.state = issue.closedAt === null ?
        settingsService.GetSettingOrDefault(Settings.WorkItemOpenState) :
        settingsService.GetSettingOrDefault(Settings.WorkItemClosedState);
    }
  }

  private minify(string: string): string {
    const maxRowCharCount = 32000;

    const minified = JSON.stringify(string)
      .slice(1, -1)
      .replace(/,/g, '&#44;')
      .replace(/\\"/g, Strings.Empty)
      .replace(/\"/g, Strings.Empty)
      .replace(/\\n/g, Strings.Empty)
      .replace(/class=issue-link js-issue-link data-error-text=Failed to load title/g, Strings.Empty)
      .replace(/rel=nofollow/g, Strings.Empty);

    return (minified.length) > maxRowCharCount ?
      minified.slice(0, maxRowCharCount) : minified;
  }
}
