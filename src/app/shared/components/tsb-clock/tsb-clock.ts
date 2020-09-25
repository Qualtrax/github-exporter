import { Timer } from 'tsbase/Utility/Timers/Timer';
import { BaseComponent } from 'tsbase-components/components/base-component/base-component';
import { Component } from 'tsbase-components/decorators/Component';
import { DateProvider } from '../../providers/DateProvider';
import { IDateProvider } from '../../providers/IDateProvider';

@Component({ selector: 'tsb-clock' })
export class ClockComponent extends BaseComponent {
  public get timeDisplay(): HTMLElement {
    return this.Dom.getElementById('timeDisplay') as HTMLElement;
  }

  protected template = (): string => /*html*/ `
    <div id="timeDisplay"></div>`;

  protected onPostRender = (): void => {
    this.setupTimer();
  }

  constructor(
    private dateProvider: IDateProvider = new DateProvider(),
    private timer = new Timer(1000)
  ) {
    super();
  }

  private setupTimer(): void {
    this.timer.AutoReset = true;
    this.timer.Elapsed.push(() => {
      this.timeDisplay.innerText = this.dateProvider.GetDate().toLocaleTimeString();
    });

    this.timer.Start();
  }
}
