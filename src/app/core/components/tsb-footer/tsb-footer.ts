import { Component } from 'tsbase-components/decorators/Component';
import { BaseComponent } from 'tsbase-components/components/base-component/base-component';

@Component({ selector: 'tsb-footer' })
export class FooterComponent extends BaseComponent {

  constructor() {
    super();
  }

  protected template = (): string => /*html*/ `
    <div class="footer-component">
      <p>tsbase starter</p>
    </div>

    <tsb-skip-link
      text="Skip back to banner"
      skipToId="headerElement"
      classes="skip-to-banner-link">
    </tsb-skip-link>`;
}
