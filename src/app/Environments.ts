export enum Environments {
  Development = 'development',
  Production = 'production'
}

export enum EnvironmentVariables {
  Mode = 'mode'
}

export const DevelopmentEnvironmentVariables = new Map<string, string>();
DevelopmentEnvironmentVariables.set(EnvironmentVariables.Mode, Environments.Development);

export const ProductionEnvironmentVariables = new Map<string, string>();
ProductionEnvironmentVariables.set(EnvironmentVariables.Mode, Environments.Production);
