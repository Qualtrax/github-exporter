import { Router } from 'tsbase-components/routing/Router/Router';
import { BaseComponent } from 'tsbase-components/components/base-component/base-component';
import './components/components';
import { App } from './App';

(() => {
  Router.UseHistoryApi = false;
  BaseComponent.GlobalStylesheet = 'styles.css';

  const app = App.Instance(process.env.NODE_ENV);
  window['app'] = app;
})();
