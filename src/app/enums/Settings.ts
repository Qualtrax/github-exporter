import { Strings } from 'tsbase';

export enum Settings {
  GitHubAuthToken = 'githubAuthToken',
  IssueStatus = 'issueStatus',
  IssueType = 'issueType',
  PaginationCount = 'paginationCount',
  MaxPageCount = 'maxPageCount',
  RepositoryName = 'repositoryName',
  RepositoryOwner = 'repositoryOwner',
  WorkItemType = 'WorkItemType',
  WorkItemOpenState = 'workItemOpenState',
  WorkItemClosedState = 'workItemClosedState'
}

export enum IssueStatus {
  Open = 'OPEN',
  Closed = 'CLOSED'
}

export enum IssueType {
  Issues = 'issues',
  PullRequests = 'pullRequests'
}

export const SettingsMap = new Map<string, { label: string, default: string }>([
  [Settings.GitHubAuthToken, { label: 'GitHub Auth Token', default: Strings.Empty }],
  [Settings.IssueStatus, { label: 'Issue Status', default: IssueStatus.Open }],
  [Settings.IssueType, { label: 'Issue Type', default: IssueType.Issues }],
  [Settings.PaginationCount, { label: 'Pagination Count', default: '100' }],
  [Settings.MaxPageCount, { label: 'Max Page Count (0 = unlimited)', default: '0' }],
  [Settings.RepositoryName, { label: 'Repository Name', default: Strings.Empty }],
  [Settings.RepositoryOwner, { label: 'Repository Owner', default: Strings.Empty }],
  [Settings.WorkItemType, { label: 'Work Item Type', default: 'Issue' }],
  [Settings.WorkItemOpenState, { label: 'Work Item Open State', default: 'Active' }],
  [Settings.WorkItemClosedState, { label: 'Work Item Closed State', default: 'Closed' }]
]);
