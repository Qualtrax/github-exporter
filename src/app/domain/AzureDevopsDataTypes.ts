import { Strings } from 'tsbase';
import { Issue } from './GitHubDataTypes';

export const AzureWorkItemFields = [
  'Work Item Type', 'Title', 'Description', 'Tags','Created Date'
];

export enum WorkItemType {
  Issue = 'Issue'
}

export class AzureDevopsWorkItem {
  public workItemType = WorkItemType.Issue;
  public title = Strings.Empty;
  public description = Strings.Empty;
  public tags = Strings.Empty;
  public createdDate = Strings.Empty;

  constructor(issue?: Issue) {
    if (issue) {
      const commentsStringMap = issue.comments.nodes.map(n => /*html*/
        (`<h3>Author: ${n.author.login} | Date: ${n.createdAt}</h3>${this.minified(n.bodyHTML)}`)).toString();

      this.title = this.minified(issue.title);
      this.description =
        `<h2>GitHub Description</h2>${this.minified(issue.bodyHTML)}<h2>GitHub Comments</h2>${commentsStringMap}`;
      this.tags = issue.labels.nodes.map(n => n.name).toString();
      this.createdDate = issue.createdAt;
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
