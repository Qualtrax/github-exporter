import { Queryable, Strings, HttpClient, HttpRequestMessage, HttpMethod } from 'tsbase';
import { Component, BaseComponent, SeoService, Html, DomEventTypes, DataBind } from 'tsbase-components';
import { Issue, RepositoryIssues, Comment } from '../../domain/GitHubDataTypes';
import { Classes, HtmlValidation, Images } from '../../enums/module';
import { Settings } from '../../enums/Settings';
import { SettingsService } from '../../services/file-system/SettingsService';
import { graphQlQuery, IssueStatus } from './GraphQlQuery';

const ids = {
  submitButton: 'submitButton',
  githubToken: 'githubToken',
  form: 'form',
  loadingGifWrapper: 'loadingGifWrapper'
};

@Component({ selector: 'main-page', route: '/' })
export class MainPageComponent extends BaseComponent {
  @DataBind githubToken!: string;
  private repositoryIssues: RepositoryIssues | null = null;
  private persistedGithubAuthToken: string;

  constructor(
    private httpClient = new HttpClient(),
    private settingsRepository = SettingsService.Instance.Repository
  ) {
    super();

    const githubAuthTokenSetting = this.settingsRepository.Find(r => r.key === Settings.GitHubAuthToken);
    this.persistedGithubAuthToken = githubAuthTokenSetting ? githubAuthTokenSetting.value : Strings.Empty;
  }

  protected onInit = async (): Promise<void> => {
    SeoService.Instance.SetDefaultTags('GitHub Exporter');
  }

  protected template = (): string => /*html*/ `
  <div class="main-page-component">
    <h1>GitHub Exporter</h1>
    <h2>Request</h2>

    <form id="${ids.form}">
      <div>
        <label for="${ids.githubToken}">GitHub Auth Token</label>
        <input id="${ids.githubToken}"
          type="password"
          ${HtmlValidation.Required}
          value="${this.persistedGithubAuthToken}">
      </div>

      <button id="${ids.submitButton}">Submit</button>
    </form>

    <hr>

    <div id="${ids.loadingGifWrapper}" class="${Classes.Hidden}">
      <img src="${Images.LoadingGif}" alt="Loading icon">
    </div>

    ${this.repositoryIssues ? /*html*/ `
    <h2>Response</h2>
    <h3>Metadata</h3>
    <p>Has Previous Page: ${this.repositoryIssues.data.repository.issues.pageInfo.hasPreviousPage}</p>
    <p>Has Next Page: ${this.repositoryIssues.data.repository.issues.pageInfo.hasNextPage}</p>
    <p>Last Edge (cursor): ${Queryable.From(this.repositoryIssues.data.repository.issues.edges).Last()?.cursor}</p>

    <h3>Closed Issues</h3>
    <ul>
    ${Html.ForEach(this.repositoryIssues.data.repository.issues.nodes, (issue: Issue) => /*html*/ `
      <li>
        <h4>${issue.number} | ${issue.title}</h4>
        <p>Opened at: ${issue.createdAt}</p>
        <p>Closed at: ${issue.closedAt}</p>
        <p>Labels: ${Html.ForEach(issue.labels.nodes, (label: {name: string}) => /*html*/ `
          <span>${label.name}</span>,`)}</p>

        <h5>Comments</h5>
        <ul>
          ${Html.ForEach(issue.comments.nodes, (comment: Comment) => /*html*/ `
          <li>
            <p>${comment.author.login}</p>
            <p>${comment.createdAt}</p>
            <blockquote>${comment.bodyText}</blockquote>
          </li>`)}
        </ul>
      </li>
    `)}
    </ul>

    ` : Strings.Empty}
  </div>
  `;

  protected onPostRender = async () => {
    this.addEventListenerToElementId(ids.submitButton, DomEventTypes.Click, this.onSubmissionAttempted);
    this.addEventListenerToElementId(ids.form, DomEventTypes.Submit, async (event) => await this.onSubmissionAttempted(event));
  }

  private onSubmissionAttempted = async (event: Event | null): Promise<any> => {
    if (event && this.inputValid()) {
      event.preventDefault();

      this.showLoadingGif();

      const contentResponse = await this.httpClient.SendAsync(this.getGitHubApiRequest());

      if (contentResponse.IsSuccessStatusCode) {
        this.repositoryIssues = JSON.parse(contentResponse.Content);
        this.refreshComponent();
      } else {
        alert(contentResponse.Content);
        this.refreshComponent();
      }
    }
  }

  private getGitHubApiRequest = (): HttpRequestMessage => {
    const request = new HttpRequestMessage(HttpMethod.POST);
    request.RequestUri = 'https://api.github.com/graphql';
    request.Content = JSON.stringify({query: graphQlQuery(100, IssueStatus.Closed)});
    request.Headers = [
      { key: 'Authorization', value: `Bearer ${this.githubToken}` },
      { key: 'Content-Type', value: 'application/json' }
    ];

    return request;
  }

  private inputValid = (): boolean => {
    return !Strings.IsEmptyOrWhiteSpace(this.githubToken);
  }

  private showLoadingGif() {
    const loadingGifWrapper = this.Dom.getElementById(ids.loadingGifWrapper) as HTMLDivElement;
    loadingGifWrapper.classList.remove('hidden');
  }
}
