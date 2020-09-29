import { Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { IDownloadService } from '../../services/file-system/DownloadService';
import { IGitHubQueryService } from '../../services/github-query-service/GitHubQueryService';
import { MainPageComponent } from './main-page';

describe('HomeComponent', () => {
  const mockGitHubQueryService = new Mock<IGitHubQueryService>();
  const mockDownloadService = new Mock<IDownloadService>();
  let componentUnderTest: MainPageComponent;

  beforeEach(() => {
    mockDownloadService.Setup(s => s.DownloadFile(Strings.Empty, Strings.Empty));

    componentUnderTest = new MainPageComponent(
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
