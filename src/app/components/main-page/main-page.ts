import { Strings } from 'tsbase';
import { Component, BaseComponent, SeoService, Html, DomEventTypes } from 'tsbase-components';
import { Issue, Comment } from '../../domain/GitHubDataTypes';
import { GitHubExport } from '../../domain/GitHubExport';
import { Classes, Images, Routes } from '../../enums/module';
import { GitHubQueryService, IGitHubQueryService } from '../../services/github-query-service/GitHubQueryService';

const ids = {
  submitButton: 'submitButton',
  form: 'form',
  loadingGifWrapper: 'loadingGifWrapper'
};

@Component({ selector: 'main-page', route: '/' })
export class MainPageComponent extends BaseComponent {
  private githubExport: GitHubExport | null = null;
  private errors: Array<string> | null = null;
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

    ${this.githubExport || this.errors ? /*html*/ `
    <h2>Response</h2>

    ${this.githubExport ? this.repositoryIssuesResponse(this.githubExport) : Strings.Empty}
    ${this.errors ? this.repositoryIssuesErrors(this.errors) : Strings.Empty}

    ` : Strings.Empty}
  </div>
  `;

  private repositoryIssuesResponse = (responseData: GitHubExport): string => /*html*/ `
    <h3>Issues</h3>
    <ul>
    ${Html.ForEach(responseData.repository.issues, (issue: Issue) => /*html*/ `
      <li class="issue-item">
        <h4>${issue.number} | ${issue.title}</h4>
        <p>Opened at: ${issue.createdAt}</p>
        <p>Closed at: ${issue.closedAt}</p>
        <p>Labels: ${Html.ForEach(issue.labels.nodes, (label: {name: string}) => /*html*/ `
          <span>${label.name}</span>,`)}</p>
        <p>Description: ${issue.bodyHTML}</p>

        <h5>Comments</h5>
        <ul>
          ${Html.ForEach(issue.comments.nodes, (comment: Comment) => /*html*/ `
          <li class="comment-item">
            <p>${comment.author.login}</p>
            <p>${comment.createdAt}</p>
            <blockquote>${comment.bodyHTML}</blockquote>
          </li>`)}
        </ul>
      </li>
    `)}
    </ul>`;

  private repositoryIssuesErrors = (errors: Array<string>): string => /*html*/ `
  <h3>Errors</h3>
  <ul>
    ${Html.ForEach(errors, (error: Error) => /*html*/ `
    <li>${error}</li>`)}
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

      const result = await this.gitHubQueryService.GetApiResults();

      if (result.IsSuccess && result.Value) {
        this.githubExport = result.Value;
      } else {
        this.errors = result.ErrorMessages;
      }

      this.refreshComponent();
    }
  }

  private showLoadingGif() {
    const loadingGifWrapper = this.Dom.getElementById(ids.loadingGifWrapper) as HTMLDivElement;
    loadingGifWrapper.classList.remove('hidden');
  }
}
