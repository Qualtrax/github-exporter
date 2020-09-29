import { Strings } from 'tsbase';
import { Issue } from './GitHubDataTypes';

export const AzureWorkItemFields = [
  'Work Item Type', 'Title', 'Description', 'Tags','Created Date', 'Closed Date', 'Discussion'
];

export enum WorkItemType {
  UserStory = 'User Story',
  CodeReview = 'Code Review Request'
}

export class AzureDevopsWorkItem {
  public workItemType = WorkItemType.UserStory;
  public title = Strings.Empty;
  public description = Strings.Empty;
  public tags = Strings.Empty;
  public createdDate = Strings.Empty;
  public closedDate = Strings.Empty;
  public discussion = Strings.Empty;

  constructor(issue?: Issue) {
    if (issue) {
      this.title = this.minified(issue.title),
      this.description = this.minified(issue.bodyHTML);
      this.tags = issue.labels.nodes.map(n => n.name).toString();
      this.createdDate = issue.createdAt;
      this.closedDate = issue.closedAt;
      this.discussion = this.minified(issue.comments.nodes.map(n => /*html*/
        (`<p>Author: ${n.author.login}</p><p>Date: ${n.createdAt}</p>${n.bodyHTML}`)).toString());
    }
  }

  private minified(string: string): string {
    return JSON.stringify(string.replace(/,/g, '&#44;')).slice(1, -1);
  }
}
