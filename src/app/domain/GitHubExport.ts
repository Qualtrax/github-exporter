import { Issue } from './GitHubDataTypes';

export type GitHubExport = {
  repository: {
    issues: Array<Issue>
  }
};
