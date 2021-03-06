import { Component, BaseComponent, Html } from 'tsbase-components';
import { Classes, Routes, Svgs } from '../../enums/module';

type NavLink = { route: string, label: string, icon: string };

@Component({ selector: 'nav-component'})
export class NavigationComponent extends BaseComponent {
  private navLinks: { main: Array<NavLink>, admin: Array<NavLink> } = {
    main: [
      { route: Routes.Exporter, label: 'Exporter', icon: Svgs.Export },
      { route: Routes.Converter, label: 'Converter', icon: Svgs.Converter }
    ],
    admin: [
      { route: Routes.Settings, label: 'Settings', icon: Svgs.Settings }
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
