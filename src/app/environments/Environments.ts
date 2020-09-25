export enum Environments {
  Development = 'development',
  Production = 'production'
}

export enum EnvironmentVariables {
  Mode = 'mode',
  ApiServer = 'apiServer'
}

export const DevelopmentEnvironmentVariables = new Map<string, string>();
DevelopmentEnvironmentVariables.set(EnvironmentVariables.Mode, Environments.Development);
DevelopmentEnvironmentVariables.set(EnvironmentVariables.ApiServer, 'http://localhost:5000');

export const ProductionEnvironmentVariables = new Map<string, string>();
ProductionEnvironmentVariables.set(EnvironmentVariables.Mode, Environments.Production);
ProductionEnvironmentVariables.set(EnvironmentVariables.ApiServer, 'http://www.example.com/api');
