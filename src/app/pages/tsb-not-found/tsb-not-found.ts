import { Component } from 'tsbase-components/decorators/Component';
import { BaseComponent } from 'tsbase-components/components/base-component/base-component';
import { SeoService } from 'tsbase-components/services/seo-service/SeoService';

@Component({ selector: 'tsb-not-found' })
export class NotFoundComponent extends BaseComponent {
  constructor() {
    super();
  }

  protected template = (): string => /*html*/ `
    <h1>Content Not Found</h1>
    <p>"${window.location.pathname}" didn't correspond with any known page.</p>
    <p>The resource you're looking for may have moved.</p>`;

  protected onInit = (): void => {
    SeoService.Instance.SetDefaultTags('Not Found');
  }
}
