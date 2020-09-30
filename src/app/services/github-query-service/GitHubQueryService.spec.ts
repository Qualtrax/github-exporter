import { Mock } from 'tsmockit';
import { HttpClient, HttpRequestMessage, HttpResponseMessage, Strings } from 'tsbase';
import { GitHubQueryService, IGitHubQueryService } from './GitHubQueryService';
import { ISettingsService } from '../file-system/SettingsService';

describe('GitHubQueryService', () => {
  const mockHttpClient = new Mock<HttpClient>();
  const mockSettingsService = new Mock<ISettingsService>();
  let classUnderTest: IGitHubQueryService;

  beforeEach(() => {
    mockHttpClient.Setup(c => c.SendAsync(
      new HttpRequestMessage()), new HttpResponseMessage(Strings.Empty, { Code: 200, Text: 'OK' }));

    classUnderTest = GitHubQueryService.Instance(mockHttpClient.Object, mockSettingsService.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
