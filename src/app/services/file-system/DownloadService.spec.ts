import { DownloadService } from './DownloadService';

describe('DownloadService', () => {
  let classUnderTest: DownloadService;

  beforeEach(() => {
    classUnderTest = DownloadService.Instance;
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
