import { Queryable, Strings, HttpClient, HttpRequestMessage, HttpMethod } from 'tsbase';
import { Component, BaseComponent, SeoService, Html, DomEventTypes, DataBind } from 'tsbase-components';
import { Issue, RepositoryIssues, Comment } from '../../domain/GitHubDataTypes';
import { graphQlQuery, IssueStatus } from './GraphQlQuery';

const ids = {
  submitButton: 'submitButton',
  githubToken: 'githubToken',
  form: 'form'
};

@Component({ selector: 'main-page', route: '/' })
export class HomeComponent extends BaseComponent {
  @DataBind githubToken!: string;
  private repositoryIssues: RepositoryIssues | null = null;
  private request: HttpRequestMessage;

  constructor(private httpClient = new HttpClient()) {
    super();

    this.request = new HttpRequestMessage();
    this.request.Method = HttpMethod.POST;
    this.request.RequestUri = 'https://api.github.com/graphql';
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
        <input id="${ids.githubToken}"
          type="text"
          placeholder="GitHub auth token"
          required>
      </div>

      <button id="${ids.submitButton}">Submit</button>
    </form>

    <hr>

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

      this.request.Content = JSON.stringify({query: graphQlQuery(5, IssueStatus.Closed)});
      this.request.Headers = [
        { key: 'Authorization', value: `Bearer ${this.githubToken}` },
        { key: 'Content-Type', value: 'application/json' }
      ];

      const contentResponse = await this.httpClient.SendAsync(this.request);

      if (contentResponse.IsSuccessStatusCode) {
        this.repositoryIssues = JSON.parse(contentResponse.Content);
        this.refreshComponent();
      } else {
        alert(contentResponse.Content);
        this.refreshComponent();
      }
    }
  }

  private inputValid = (): boolean => {
    return !Strings.IsEmptyOrWhiteSpace(this.githubToken);
  }
}
