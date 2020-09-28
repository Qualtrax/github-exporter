import { Mock } from 'tsmockit';
import { IGitHubQueryService } from '../../services/github-query-service/GitHubQueryService';
import { MainPageComponent } from './main-page';

describe('HomeComponent', () => {
  const mockGitHubQueryService = new Mock<IGitHubQueryService>();
  let componentUnderTest: MainPageComponent;

  beforeEach(() => {
    componentUnderTest = new MainPageComponent(mockGitHubQueryService.Object);
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
