import { Mock } from 'tsmockit';
import { HttpClient, HttpRequestMessage, HttpResponseMessage, KeyValue, Repository, Strings } from 'tsbase';
import { GitHubQueryService, IGitHubQueryService } from './GitHubQueryService';

describe('GitHubQueryService', () => {
  const mockHttpClient = new Mock<HttpClient>();
  const mockSettingsRepository = new Mock<Repository<KeyValue>>();
  let classUnderTest: IGitHubQueryService;

  beforeEach(() => {
    mockHttpClient.Setup(c => c.SendAsync(
      new HttpRequestMessage()), new HttpResponseMessage(Strings.Empty, { Code: 200, Text: 'OK' }));
    mockSettingsRepository.Setup(r => r.Add({ key: Strings.Empty, value: Strings.Empty }));
    mockSettingsRepository.Setup(r => r.Find(() => true), null);
    mockSettingsRepository.Setup(r => r.SaveChanges());

    classUnderTest = GitHubQueryService.Instance();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
