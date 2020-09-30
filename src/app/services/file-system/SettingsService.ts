import { FSPersister, IPersister, KeyValue, Repository, Strings } from 'tsbase';
import { FileSystemAdapter } from './FileSystemAdapter';
import { PathResolver } from './PathResolver';
import { Constants } from '../../constants';
import { Settings, SettingsMap } from '../../enums/module';

export interface ISettingsService {
  Repository: Repository<KeyValue>;
  GetSettingOrDefault(settingName: Settings): string;
}

export class SettingsService implements ISettingsService {
  private static instance: ISettingsService | null = null;
  public static Instance(persister: IPersister | null = null): ISettingsService {
    return this.instance || (this.instance = new SettingsService(persister));
  }
  public static Destroy(): void { this.instance = null; }

  public Repository: Repository<KeyValue>;

  private constructor(persister: IPersister | null = null) {
    persister = persister || new FSPersister(
      Constants.LocalFilesDirectory,
      Constants.SettingsFilePath,
      'Settings',
      PathResolver,
      FileSystemAdapter);

    this.Repository = new Repository<KeyValue>(persister);
  }


  public GetSettingOrDefault(settingName: Settings): string {
    const setting = this.Repository.Find(s => s.key === settingName);
    return setting ?
      setting.value :
      SettingsMap.get(settingName)?.default ||
      Strings.Empty;
  }
}
