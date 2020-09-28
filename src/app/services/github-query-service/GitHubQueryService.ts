import { HttpClient, HttpMethod, HttpRequestMessage, HttpResponseMessage, KeyValue, Repository, Strings } from 'tsbase';
import { IssueStatus } from '../../enums/GitHubApi';
import { Settings } from '../../enums/module';
import { SettingsService } from '../file-system/SettingsService';

export interface IGitHubQueryService {
  GetApiResults(): Promise<HttpResponseMessage>
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

  private defaultSettingsMap = new Map<string, string>([
    [Settings.RepositoryName, ''],
    [Settings.RepositoryOwner, ''],
    [Settings.GitHubAuthToken, ''],
    [Settings.PaginationCount, '100'],
    [Settings.IssueStatus, IssueStatus.Open]
  ]);

  private constructor(
    private httpClient: HttpClient,
    private settingsRepository: Repository<KeyValue>
  ) { }

  public async GetApiResults(): Promise<HttpResponseMessage> {
    const request = this.getGitHubApiRequest();

    return await this.httpClient.SendAsync(request);
  }

  private getGitHubApiRequest = (): HttpRequestMessage => {
    const request = new HttpRequestMessage(HttpMethod.POST);
    request.RequestUri = 'https://api.github.com/graphql';
    request.Content = JSON.stringify({query: this.getGraphQlQuery()});
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
      this.defaultSettingsMap.get(settingName) ||
      Strings.Empty;
  }

  private getGraphQlQuery = (): string =>
    `{
      repository(
        name: "${this.getSettingOrDefault(Settings.RepositoryName)}",
        owner: "${this.getSettingOrDefault(Settings.RepositoryOwner)}") {
        issues (filterBy: {
          states: ${this.getSettingOrDefault(Settings.IssueStatus)}},
          first: ${this.getSettingOrDefault(Settings.PaginationCount)}) {
          nodes {
            createdAt,
            closedAt,
            number,
            title,
            labels (first: ${this.getSettingOrDefault(Settings.PaginationCount)}) {
              nodes {name}
            },
            comments (first: ${this.getSettingOrDefault(Settings.PaginationCount)}) {
              nodes {
                author {
                  login
                },
                createdAt,
                bodyText
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
}