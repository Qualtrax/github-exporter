import { Component, BaseComponent, Html } from 'tsbase-components';
import { Classes } from '../../enums/Classes';
import { Svgs } from '../../enums/Svgs';

type NavLink = { route: string, label: string, icon: string };

@Component({ selector: 'nav-component'})
export class NavigationComponent extends BaseComponent {
  private navLinks: { main: Array<NavLink>, admin: Array<NavLink> } = {
    main: [
      { route: '/', label: 'Main Page', icon: Svgs.Home }
    ],
    admin: [
      { route: '/settings', label: 'Settings', icon: Svgs.Settings }
    ]
  };

  constructor() {
    super();
  }

  protected onInit = (): void => { };

  protected template = (): string => /*html*/ `
  <div class="nav-component">
    <ul class="main">
      ${Html.ForEach(this.navLinks.main, (navLink: NavLink) => /*html*/ `
      <li>${this.routerLink(navLink)}</li>`)}
    </ul>

    <ul class="admin">
      ${Html.ForEach(this.navLinks.admin, (navLink: NavLink) => /*html*/ `
      <li>${this.routerLink(navLink)}</li>`)}
    </ul>
  </div>`;

  private routerLink = (navLink: NavLink): string => {
    return /*html*/ `
    <router-link
      classes="${Classes.NavLink}"
      route="${navLink.route}">
      <div>
        ${navLink.icon}
        <span>${navLink.label}</span>
      </div>
    </router-link>`;
  }
}
