import { FSPersister, IPersister, KeyValue, Repository } from 'tsbase';
import { FileSystemAdapter } from './FileSystemAdapter';
import { PathResolver } from './PathResolver';
import { Constants } from '../../constants';

export interface ISettingsService {
  Repository: Repository<KeyValue>;
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
}
