import { Queryable, Strings } from 'tsbase';
import { Component, BaseComponent, SeoService, Html, DomEventTypes } from 'tsbase-components';
import { Issue, RepositoryIssues, Comment, Error } from '../../domain/GitHubDataTypes';
import { Classes, Images, Routes } from '../../enums/module';
import { GitHubQueryService, IGitHubQueryService } from '../../services/github-query-service/GitHubQueryService';

const ids = {
  submitButton: 'submitButton',
  form: 'form',
  loadingGifWrapper: 'loadingGifWrapper'
};

@Component({ selector: 'main-page', route: '/' })
export class MainPageComponent extends BaseComponent {
  private repositoryIssues: RepositoryIssues | null = null;
  private errors: Array<Error> | null = null;
  private pageTitle = 'GitHub Exporter';

  constructor(
    private gitHubQueryService: IGitHubQueryService = GitHubQueryService.Instance()
  ) {
    super();
  }

  protected onInit = async (): Promise<void> => {
    SeoService.Instance.SetDefaultTags(this.pageTitle);
  }

  protected template = (): string => /*html*/ `
  <div class="main-page-component">
    <h1>${this.pageTitle}</h1>
    <h2>Request</h2>

    <form id="${ids.form}">
      <button id="${ids.submitButton}">Start Export</button>
    </form>

    <hr>

    <div id="${ids.loadingGifWrapper}" class="${Classes.Hidden}">
      <img src="${Images.LoadingGif}" alt="Loading icon">
    </div>

    ${this.repositoryIssues || this.errors ? /*html*/ `
    <h2>Response</h2>

    ${this.repositoryIssues ? this.repositoryIssuesResponse(this.repositoryIssues) : Strings.Empty}
    ${this.errors ? this.repositoryIssuesErrors(this.errors) : Strings.Empty}

    ` : Strings.Empty}
  </div>
  `;

  private repositoryIssuesResponse = (responseData: RepositoryIssues): string => /*html*/ `
    <h3>Metadata</h3>
    <p>Has Previous Page: ${responseData.data.repository.issues.pageInfo.hasPreviousPage}</p>
    <p>Has Next Page: ${responseData.data.repository.issues.pageInfo.hasNextPage}</p>
    <p>Last Edge (cursor): ${Queryable.From(responseData.data.repository.issues.edges).Last()?.cursor}</p>

    <h3>Closed Issues</h3>
    <ul>
    ${Html.ForEach(responseData.data.repository.issues.nodes, (issue: Issue) => /*html*/ `
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
    </ul>`;

  private repositoryIssuesErrors = (errors: Array<Error>): string => /*html*/ `
  <h3>Errors</h3>
  <ul>
    ${Html.ForEach(errors, (error: Error) => /*html*/ `
    <li>${error.message}</li>`)}
  </ul>

  <p>Adjust your <router-link route="${Routes.Settings}">Settings</router-link> to resolve the above error(s).</p>`;

  protected onPostRender = async () => {
    this.addEventListenerToElementId(ids.submitButton, DomEventTypes.Click, this.onSubmissionAttempted);
    this.addEventListenerToElementId(ids.form, DomEventTypes.Submit, async (event) => await this.onSubmissionAttempted(event));
  }

  private onSubmissionAttempted = async (event: Event | null): Promise<any> => {
    if (event) {
      event.preventDefault();

      this.showLoadingGif();

      const contentResponse = await this.gitHubQueryService.GetApiResults();

      if (contentResponse.IsSuccessStatusCode) {
        const json = JSON.parse(contentResponse.Content);
        json.errors ? this.errors = json.errors : this.repositoryIssues = json;

        this.refreshComponent();
      } else {
        alert(contentResponse.Content);
        this.refreshComponent();
      }
    }
  }

  private showLoadingGif() {
    const loadingGifWrapper = this.Dom.getElementById(ids.loadingGifWrapper) as HTMLDivElement;
    loadingGifWrapper.classList.remove('hidden');
  }
}
