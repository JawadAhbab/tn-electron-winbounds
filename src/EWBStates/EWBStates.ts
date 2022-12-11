import { CreateStorage } from 'tn-storage'
import { ElectronStorage } from 'tn-storage/dist/Storages/ElectronStorage'
import { Store } from 'tn-storage/dist/Stores/Store'
import { Timeout } from 'tn-timeout'
import { ElectronWinbounds } from '..'
interface States {
  x: Store<number>
  y: Store<number>
  width: Store<number>
  height: Store<number>
  maximized: Store<boolean>
}

export class EWBStates {
  private timeout = new Timeout(100)
  private states: States
  private ew: ElectronWinbounds

  constructor(ew: ElectronWinbounds, scope: string) {
    this.ew = ew
    this.states = new CreateStorage(new ElectronStorage('@ewb.' + scope), {
      x: new Store(0, 'number'),
      y: new Store(0, 'number'),
      width: new Store(800, 'number'),
      height: new Store(500, 'number'),
      maximized: new Store(true, 'boolean'),
    }).states
    this.applyStates()
  }

  public saveStates() {
    this.timeout.queue(() => {
      const ismax = this.ew.win.isMaximized()
      const bounds = this.ew.win.getBounds()
      this.states.maximized.set(ismax)
      this.states.x.set(ismax ? this.states.x.value : bounds.x)
      this.states.y.set(ismax ? this.states.y.value : bounds.y)
      this.states.width.set(ismax ? this.states.width.value : bounds.width)
      this.states.height.set(ismax ? this.states.height.value : bounds.height)
    })
  }

  public applyStates() {
    this.ew.win.setBounds({
      x: this.states.x.value,
      y: this.states.y.value,
      width: this.states.width.value,
      height: this.states.height.value,
    })
    if (this.states.maximized.value) this.ew.win.maximize()
  }

  public resetStates() {
    this.states.x.set(0)
    this.states.y.set(0)
    this.states.width.set(800)
    this.states.height.set(500)
    this.states.maximized.set(true)
    this.applyStates()
  }
}
