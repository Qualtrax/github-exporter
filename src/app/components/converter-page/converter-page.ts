import { readFileSync } from 'fs';
import { Routes } from '../../enums/Routes';
import { Component, BaseComponent, SeoService, DomEventTypes } from 'tsbase-components';
import { Csv } from 'tsbase/Functions/Csv';
import { GitHubExport } from '../../domain/GitHubExport';
import { DownloadService, IDownloadService } from '../../services/file-system/DownloadService';
import { AzureDevopsWorkItem, AzureWorkItemFields } from '../../domain/AzureDevopsDataTypes';

const ids = {
  fileInput: 'fileInput',
  azureExportButton: 'azureExportButton'
};

@Component({ selector: 'converter-page', route: Routes.Converter })
export class ConverterPageComponent extends BaseComponent {
  private pageTitle = 'Converter';
  private fileSelected = { name: '', path: '' };
  private githubExport: GitHubExport | null = null;

  constructor(
    private downloadService: IDownloadService = DownloadService.Instance
  ) {
    super();
  }

  protected onInit = async (): Promise<void> => {
    SeoService.Instance.SetDefaultTags(this.pageTitle);
  }

  protected template = (): string => /*html*/ `
  <div class="converter-page-component">
    <h1>${this.pageTitle}</h1>
    <input id="${ids.fileInput}" type="file" accept=".json" multiple="false" />

    <hr />

    ${this.fileSelected.name ? /*html*/`
    <h3>Convert "${this.fileSelected.name}"</h3>
      <button id="${ids.azureExportButton}">Azure Devops</button>` : /*html*/ `
      <p><em>Select a file to convert</em></p>`}
    </div>
  `;

  private handleFileChange = async (evt): Promise<any> => {
    this.fileSelected = evt.target.files[0];
    this.refreshComponent();
  };

  private convertToAzure = async (): Promise<any> => {
    const data = readFileSync(this.fileSelected.path, 'utf-8');
    if (data) {
      const repository = JSON.parse(data).repository;
      this.githubExport = {
        repository: {
          name: repository.name,
          issues: repository.issues,
          pullRequests: repository.pullrequests
        }
      };

      const azureWorkItems = this.githubExport.repository.issues.map(i => new AzureDevopsWorkItem(i));
      const csv = Csv.EncodeAsCsv(AzureWorkItemFields, azureWorkItems);

      this.downloadService.DownloadFile(csv, `${this.githubExport.repository.name}.csv`, 'csv');
    }
  }

  protected onPostRender = async () => {
    this.addEventListenerToElementId(ids.fileInput, DomEventTypes.Change, this.handleFileChange);
    this.addEventListenerToElementId(ids.azureExportButton, DomEventTypes.Click, this.convertToAzure);
  }
}
