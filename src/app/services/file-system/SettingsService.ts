import { FSPersister, KeyValue, Repository } from 'tsbase';
import { FileSystemAdapter } from './FileSystemAdapter';
import { PathResolver } from './PathResolver';
import { Constants } from '../../constants';

export interface ISettingsService {
  Repository: Repository<KeyValue>;
}

export class SettingsService implements ISettingsService {
  private static instance: ISettingsService | null = null;
  public static get Instance(): ISettingsService { return this.instance || (this.instance = new SettingsService()); }
  public static Destroy(): void { this.instance = null; }

  public Repository: Repository<KeyValue>;

  private constructor() {
    const persister = new FSPersister(
      Constants.LocalFilesDirectory,
      Constants.SettingsFilePath,
      'Settings',
      PathResolver,
      FileSystemAdapter);

    this.Repository = new Repository<KeyValue>(persister);
  }
}
