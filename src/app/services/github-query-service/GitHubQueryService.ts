import {
  GenericResult, HttpClient, HttpMethod, HttpRequestMessage, KeyValue,
  Queryable,
  Repository, Strings } from 'tsbase';
import { Issue, RepositoryIssues } from '../../domain/GitHubDataTypes';
import { GitHubExport } from '../../domain/GitHubExport';
import { IssueType, Settings, SettingsMap } from '../../enums/module';
import { SettingsService } from '../file-system/SettingsService';

export interface IGitHubQueryService {
  GetApiResults(): Promise<GenericResult<GitHubExport>>
}

export class GitHubQueryService implements IGitHubQueryService {
  private static instance: IGitHubQueryService | null = null;
  public static Instance(
    httpClient = new HttpClient(),
    settingsRepository = SettingsService.Instance().Repository
  ): IGitHubQueryService {
    return this.instance || (this.instance = new GitHubQueryService(
      httpClient,
      settingsRepository
    ));
  }
  public static Destroy(): void { this.instance = null; }

  private constructor(
    private httpClient: HttpClient,
    private settingsRepository: Repository<KeyValue>
  ) { }

  public async GetApiResults(): Promise<GenericResult<GitHubExport>> {
    const gitHubExport: GitHubExport = { repository: {
      // eslint-disable-next-line max-len
      name: `${this.getSettingOrDefault(Settings.RepositoryOwner)}/${this.getSettingOrDefault(Settings.RepositoryName)}/${this.getSettingOrDefault(Settings.IssueType)}`,
      issues: new Array<Issue>(),
      pullRequests: new Array<Issue>()
    } };
    const result = new GenericResult<GitHubExport>(gitHubExport);

    let pagesRequested = 0;
    const maxPageCount = parseInt(this.getSettingOrDefault(Settings.MaxPageCount));
    let afterCursor: string | undefined;

    do {
      pagesRequested++;
      const request = this.getGitHubApiRequest(afterCursor);
      const response = await this.httpClient.SendAsync(request);

      if (!response.IsSuccessStatusCode) {
        result.AddError(response.Content);
      } else {
        afterCursor = this.addResponseContentToResult(response, result, gitHubExport);
        afterCursor = (maxPageCount === 0 || pagesRequested < maxPageCount) ? afterCursor : undefined;
      }
    } while (afterCursor);

    return result;
  }

  private getGitHubApiRequest = (afterCursor?: string): HttpRequestMessage => {
    const request = new HttpRequestMessage(HttpMethod.POST);
    request.RequestUri = 'https://api.github.com/graphql';
    request.Content = JSON.stringify({query: this.getGraphQlQuery(afterCursor)});
    request.Headers = [
      { key: 'Authorization', value: `Bearer ${this.getSettingOrDefault(Settings.GitHubAuthToken)}` },
      { key: 'Content-Type', value: 'application/json' }
    ];

    return request;
  }

  private getSettingOrDefault = (settingName: Settings): string => {
    const setting = this.settingsRepository.Find(s => s.key === settingName);
    return setting ?
      setting.value :
      SettingsMap.get(settingName)?.default ||
      Strings.Empty;
  }

  private getGraphQlQuery = (afterCursor?: string): string =>
    `{
      repository(
        name: "${this.getSettingOrDefault(Settings.RepositoryName)}",
        owner: "${this.getSettingOrDefault(Settings.RepositoryOwner)}") {
        ${this.getSettingOrDefault(Settings.IssueType)}(
        ${this.getSettingOrDefault(Settings.IssueType) === IssueType.Issues ?
      `filterBy: {states: ${this.getSettingOrDefault(Settings.IssueStatus)}},` : Strings.Empty}
          first: ${this.getSettingOrDefault(Settings.PaginationCount)}
          ${afterCursor ? `, after: "${afterCursor}"` : Strings.Empty}) {
          nodes {
            createdAt,
            closedAt,
            number,
            title,
            bodyHTML,
            labels (first: ${this.getSettingOrDefault(Settings.PaginationCount)}) {
              nodes {name}
            },
            comments (first: ${this.getSettingOrDefault(Settings.PaginationCount)}) {
              nodes {
                author {
                  login
                },
                createdAt,
                bodyHTML
              }
            }
          },
          pageInfo {
            hasPreviousPage,
            hasNextPage
          },
          edges {
            cursor
          }
        }
      }
    }`;

  private addResponseContentToResult = (
    response,
    result: GenericResult<GitHubExport>,
    gitHubExport: GitHubExport
  ): string | undefined => {
    let afterCursor: string | undefined;
    const json = JSON.parse(response.Content);

    if (json.errors) {
      json.errors.forEach(error => {
        result.AddError((error as Error).message);
      });
    } else {
      const issueKey: IssueType.Issues | IssueType.PullRequests =
        this.getSettingOrDefault(Settings.IssueType) as IssueType;
      const repositoryIssues = json as RepositoryIssues;

      gitHubExport.repository[issueKey] = gitHubExport.repository[issueKey].concat(
        repositoryIssues.data.repository[issueKey].nodes);

      repositoryIssues.data.repository[issueKey].pageInfo.hasNextPage ?
        afterCursor = Queryable.From(repositoryIssues.data.repository[issueKey].edges).Last()?.cursor : null;
    }

    return afterCursor;
  }
}
