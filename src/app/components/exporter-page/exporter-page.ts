import { Strings } from 'tsbase';
import { Component, BaseComponent, SeoService, Html, DomEventTypes } from 'tsbase-components';
import { GitHubExport } from '../../domain/GitHubExport';
import { Classes, Images, Routes } from '../../enums/module';
import { DownloadService, IDownloadService } from '../../services/file-system/DownloadService';
import { FeedbackMessage, GitHubQueryService, IGitHubQueryService } from '../../services/github-query-service/GitHubQueryService';

const ids = {
  exportButton: 'submitButton',
  loadingGifWrapper: 'loadingGifWrapper',
  jsonDownloadButton: 'jsonDownloadButton',
  azureDevopsDownloadButton: 'azureDevopsDownloadButton',
  issuesDownloadedLabel: 'issuesDownloadedLabel',
  errorMessageLabel: 'errorMessageLabel'
};

@Component({ selector: 'exporter-page', route: Routes.Exporter })
export class ExporterPageComponent extends BaseComponent {
  private githubExport: GitHubExport | null = null;
  private errors: Array<string> | null = null;
  private pageTitle = 'Issue Exporter';
  private queryProgressRef = '';

  constructor(
    private gitHubQueryService: IGitHubQueryService = GitHubQueryService.Instance(),
    private downloadService: IDownloadService = DownloadService.Instance
  ) {
    super();
  }

  protected onInit = async (): Promise<void> => {
    SeoService.Instance.SetDefaultTags(this.pageTitle);
  }

  public disconnectedCallback(): void {
    this.gitHubQueryService.QueryFeedback.Cancel(this.queryProgressRef);
  }

  protected template = (): string => /*html*/ `
  <div class="exporter-page-component">
    <h1>${this.pageTitle}</h1>
    <button id="${ids.exportButton}">Start Export</button>

    <hr>

    <div id="${ids.loadingGifWrapper}" class="${Classes.Hidden}">
      <img src="${Images.LoadingGif}" alt="Loading icon">
      <p id="${ids.issuesDownloadedLabel}"></p>
      <p id="${ids.errorMessageLabel}"></p>
    </div>

    ${this.githubExport || this.errors ? /*html*/ `
    <h2>Result</h2>

    ${this.githubExport ? /*html*/ `
    <p>${this.githubExport.repository.issues.length + this.githubExport.repository.pullRequests.length} issues exported!</p>
    <button id="${ids.jsonDownloadButton}">Raw JSON</button>` : Strings.Empty}

    ${this.errors ? this.repositoryIssuesErrors(this.errors) : Strings.Empty}
    ` : Strings.Empty}
  </div>
  `;

  private repositoryIssuesErrors = (errors: Array<string>): string => /*html*/ `
  <h3>Errors</h3>
  <ul>
    ${Html.ForEach(errors, (error: Error) => /*html*/ `
    <li>${error}</li>`)}
  </ul>

  <p>Adjust your <router-link route="${Routes.Settings}">Settings</router-link> to resolve the above error(s).</p>`;

  protected onPostRender = async () => {
    this.addEventListenerToElementId(ids.exportButton, DomEventTypes.Click, this.onExportButtonClicked);

    this.addEventListenerToElementId(ids.jsonDownloadButton, DomEventTypes.Click, () => {
      this.downloadService.DownloadFile(JSON.stringify(this.githubExport), `${this.githubExport?.repository.name}.json`, 'json');
    });
  }

  private onExportButtonClicked = async (): Promise<any> => {
    this.showLoadingGif();
    this.queryProgressRef = this.gitHubQueryService.QueryFeedback.Subscribe((feedback) => {
      this.handleQueryFeedback(feedback);
    });

    const result = await this.gitHubQueryService.GetApiResults();

    if (result.IsSuccess && result.Value) {
      this.githubExport = result.Value;
    } else {
      this.errors = result.ErrorMessages;
    }

    this.refreshComponent();
  }

  private handleQueryFeedback(feedback: FeedbackMessage | undefined) {
    const issuesDownloadedLabel = this.Dom.getElementById(ids.issuesDownloadedLabel) as HTMLParagraphElement;
    const errorMessageLabel = this.Dom.getElementById(ids.errorMessageLabel) as HTMLParagraphElement;

    if (feedback) {
      errorMessageLabel.innerText = feedback.errorMessage;
      if (feedback.issuesDownloaded !== 0) {
        issuesDownloadedLabel.innerText = `${feedback.issuesDownloaded} issues downloaded`;
      }
    }
  }

  private showLoadingGif() {
    const loadingGifWrapper = this.Dom.getElementById(ids.loadingGifWrapper) as HTMLDivElement;
    loadingGifWrapper.classList.remove('hidden');
  }
}
