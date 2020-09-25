import { Router } from 'tsbase-components/routing/Router/Router';
import { BaseComponent } from 'tsbase-components/components/base-component/base-component';
import './core/core';
import './shared/shared';
import './pages/page';
import { App } from './App';

(() => {
  Router.UseHistoryApi = false;
  BaseComponent.GlobalStylesheet = 'styles.css';

  const app = App.Instance(process.env.NODE_ENV);
  window['app'] = app;
})();
