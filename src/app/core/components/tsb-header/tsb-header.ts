import { Component } from 'tsbase-components/decorators/Component';
import { BaseComponent } from 'tsbase-components/components/base-component/base-component';

@Component({ selector: 'tsb-header' })
export class HeaderComponent extends BaseComponent {
  constructor() {
    super();
  }

  protected template = (): string => /*html*/ `
    <tsb-skip-link
      text="Skip to main"
      skipToId="mainElement"
      classes="skip-main-link">
    </tsb-skip-link>

    <nav class="header-component">
      <ul>
        <li>
          <router-link classes="nav-link" route="/">Home</router-link>
        </li>
        <li>
          <tsb-clock></tsb-clock>
        </li>
      </ul>
    </nav>`;
}
