import { IRouter } from 'tsbase-components/routing/Router/IRouter';
import { Router } from 'tsbase-components/routing/Router/Router';
import {
  Environments,
  DevelopmentEnvironmentVariables,
  ProductionEnvironmentVariables
} from './environments/Environments';

export class App {
  private static instance: App | null = null;
  private static environment: Environments;
  public EnvironmentVariables = new Map<string, string>();

  private constructor(public Router: IRouter) {
    this.EnvironmentVariables = App.environment === Environments.Production ?
      ProductionEnvironmentVariables : DevelopmentEnvironmentVariables;
  }

  public static Instance(environment?: string, router: IRouter = Router.Instance): App {
    const env = environment === 'production' ? Environments.Production : Environments.Development;

    if (this.instance === null || env !== App.environment) {
      App.environment = env;
      this.instance = new App(router);
    }

    return this.instance;
  }

  public Startup(router: IRouter = Router.Instance): void {
    const main = document.querySelector('main');
    if (router && main) {
      router.Start(main, 'main-page');
    }
  }
}
