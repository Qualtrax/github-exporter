import { Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { IDownloadService } from '../../services/file-system/DownloadService';
import { IGitHubQueryService } from '../../services/github-query-service/GitHubQueryService';
import { ExporterPageComponent } from './exporter-page';

describe('HomeComponent', () => {
  const mockGitHubQueryService = new Mock<IGitHubQueryService>();
  const mockDownloadService = new Mock<IDownloadService>();
  let componentUnderTest: ExporterPageComponent;

  beforeEach(() => {
    mockDownloadService.Setup(s => s.DownloadFile(Strings.Empty, Strings.Empty, Strings.Empty));

    componentUnderTest = new ExporterPageComponent(
      mockGitHubQueryService.Object,
      mockDownloadService.Object);
  });

  it('should construct', () => {
    expect(componentUnderTest).toBeDefined();
  });

  it('should init without data', async () => {
    await componentUnderTest.connectedCallback();
    const content = (componentUnderTest.shadowRoot as ShadowRoot).innerHTML;
    expect(content).toBeDefined();
  });
});
