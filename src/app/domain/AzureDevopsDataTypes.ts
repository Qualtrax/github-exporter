import { Strings } from 'tsbase';
import { Issue } from './GitHubDataTypes';

export const WorkItemFields = [
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
      this.title = issue.title;
      this.description = issue.bodyHTML;
      this.tags = issue.labels.nodes.map(n => n.name).toString();
      this.createdDate = issue.createdAt;
      this.closedDate = issue.closedAt;
      this.discussion = issue.comments.nodes.map(n => /*html*/ `
<p>Author: ${n.author}</p>
<p>Date: ${n.createdAt}</p>
${n.bodyHTML}`).toString();
    }
  }
}
