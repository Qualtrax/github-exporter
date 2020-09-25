import { IUtility } from './IUtility';

export class Utility implements IUtility {
  private static instance: Utility | null = null;

  public get Window(): Window {
    if (!this.window) {
      this.window = window;
    }
    return this.window;
  }

  // eslint-disable-next-line no-empty-function
  private constructor(private window: Window | null = null) { }

  public static Instance(window?: Window): Utility {
    if (this.instance === null || window) {
      this.instance = new Utility(window);
    }
    return this.instance;
  }

  public ScrollToElementId(elementId: string, root: Document | ShadowRoot = document): void {
    const element = root.getElementById(elementId);
    if (element) {
      this.Window.scrollTo(0, element.offsetTop);
      element.focus();
    }
  }
}
