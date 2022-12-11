import { screen } from 'electron'
import { ElectronWinbounds } from '..'
export type Corner = [x1: number, y1: number, x2: number, y2: number]
export type HandleCorner = (winbound: Electron.Rectangle) => Corner

export class EWBPosfix {
  private ew: ElectronWinbounds
  private handleCorner: HandleCorner
  constructor(ew: ElectronWinbounds, handleCorner: HandleCorner) {
    this.ew = ew
    this.handleCorner = handleCorner
    this.fix()
  }

  public fix() {
    if (this.insideScreen()) return
    this.ew.states.resetStates()
  }

  private insideScreen() {
    const handlebound = this.handleCorner(this.ew.win.getBounds())
    const disps = screen.getAllDisplays()
    return disps.map(disp => this.insideDisp(disp, handlebound)).includes(true)
  }

  private insideDisp(disp: Electron.Display, handleCorner: Corner) {
    const b = disp.bounds
    const dispCorner: Corner = [b.x, b.y, b.x + b.width, b.y + b.height]

    const [x1, y1, x2, y2] = dispCorner
    const [a1, b1, a2, b2] = handleCorner

    if (x1 >= a2 || a1 >= x2) return false
    if (y2 <= b1 || b2 <= y1) return false
    return true
  }
}
