import { Strings } from 'tsbase';

export enum Settings {
  GitHubAuthToken = 'githubAuthToken',
  IssueStatus = 'issueStatus',
  PaginationCount = 'paginationCount',
  RepositoryName = 'repositoryName',
  RepositoryOwner = 'repositoryOwner'
}

export enum IssueStatus {
  Open = 'OPEN',
  Closed = 'CLOSED'
}

export const SettingsMap = new Map<string, { label: string, default: string }>([
  [Settings.GitHubAuthToken, { label: 'GitHub Auth Token', default: Strings.Empty }],
  [Settings.IssueStatus, { label: 'Issue Status', default: IssueStatus.Open }],
  [Settings.PaginationCount, { label: 'Pagination Count', default: '100' }],
  [Settings.RepositoryName, { label: 'Repository Name', default: Strings.Empty }],
  [Settings.RepositoryOwner, { label: 'Repository Owner', default: Strings.Empty }]
]);
