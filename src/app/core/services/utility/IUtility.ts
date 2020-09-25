export interface IUtility {
  Window: Window;
  ScrollToElementId(elementId: string, root?: Document | ShadowRoot): void;
}
