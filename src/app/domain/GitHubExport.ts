import { Issue } from './GitHubDataTypes';

export type GitHubExport = {
  repository: {
    name: string,
    issues: Array<Issue>
  }
};
