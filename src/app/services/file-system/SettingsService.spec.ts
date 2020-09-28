import { Mock } from 'tsmockit';
import { IPersister } from 'tsbase';
import { SettingsService } from './SettingsService';

describe('SettingsService', () => {
  const mockPersister = new Mock<IPersister>();
  let classUnderTest: SettingsService;

  beforeEach(() => {
    mockPersister.Setup(p => p.Retrieve());

    classUnderTest = SettingsService.Instance(mockPersister.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
