import * as fs from 'fs';
import { IFileSystemAdapter } from 'tsbase/Persistence/Persisters/IFileSystemAdapter';

export const FileSystemAdapter: IFileSystemAdapter = fs;
