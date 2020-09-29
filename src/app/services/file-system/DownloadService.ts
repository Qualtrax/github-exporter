export interface IDownloadService {
  DownloadFile(fileContents: any, fileName: string, fileType: string): void;
}

export class DownloadService implements IDownloadService {
  private static instance: IDownloadService | null = null;
  public static get Instance(): IDownloadService { return this.instance || (this.instance = new DownloadService()); }
  public static Destroy(): void { this.instance = null; }

  private constructor() { }

  public DownloadFile(fileContents: any, fileName: string, fileType: string): void {
    const blob = new Blob([fileContents], { type: fileType });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
