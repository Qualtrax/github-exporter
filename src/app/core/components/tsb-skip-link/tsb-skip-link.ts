import { Component } from 'tsbase-components/decorators/Component';
import { BaseComponent } from 'tsbase-components/components/base-component/base-component';
import { Strings } from 'tsbase/Constants/Strings';
import { DomEventTypes } from 'tsbase-components/enums/DomEventTypes';
import { Utility } from '../../services/utility/Utility';
import { IUtility } from '../../services/utility/IUtility';

@Component({ selector: 'tsb-skip-link' })
export class SkipLinkComponent extends BaseComponent {
  public skipLinkButtonId = 'skipLinkButton';

  private get text(): string {
    return this.getAttribute('text') || Strings.Empty;
  }

  private get skipToId(): string {
    return this.getAttribute('skipToId') || Strings.Empty;
  }

  private get classes(): string {
    return this.getAttribute('classes') || Strings.Empty;
  }

  private get skipLinkValid(): boolean {
    const hasText = this.text !== Strings.Empty;
    const hasSkipToId = this.skipToId !== Strings.Empty;
    return hasText && hasSkipToId;
  }

  constructor(private utility: IUtility = Utility.Instance()) {
    super();
  }

  protected template = (): string => {
    return this.skipLinkValid ? /*html*/ `
    <div class="skip-link-component">
      <button id="${this.skipLinkButtonId}"
        aria-label="${this.text}"
        class="${this.classes}">
        ${this.text}
      </button>
    </div>
    ` : Strings.Empty;
  }

  protected onPostRender = (): void => {
    if (this.skipLinkValid) {
      this.addEventListenerToElementId(this.skipLinkButtonId, DomEventTypes.Click,
        () => this.utility.ScrollToElementId(this.skipToId));
    }
  }
}
