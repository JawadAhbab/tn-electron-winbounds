import { BrowserWindow, screen } from 'electron'
import { EWBPosfix, HandleCorner } from './EWBPosfix/EWBPosfix'
import { EWBStates } from './EWBStates/EWBStates'

export class ElectronWinbounds {
  public win: BrowserWindow
  public states: EWBStates
  private posfix: EWBPosfix

  constructor(win: BrowserWindow, scope: string, handleCorner: HandleCorner) {
    this.win = win
    this.states = new EWBStates(this, scope)
    this.posfix = new EWBPosfix(this, handleCorner)
    this.bindEvents()
  }

  private bindEvents() {
    this.win.on('moved', () => this.states.saveStates())
    this.win.on('resized', () => this.states.saveStates())
    this.win.on('maximize', () => this.states.saveStates())
    this.win.on('unmaximize', () => this.states.saveStates())
    this.win.webContents.on('did-finish-load', () => this.states.applyStates())

    screen.on('display-added', () => this.posfix.fix())
    screen.on('display-removed', () => this.posfix.fix())
    screen.on('display-metrics-changed', () => this.posfix.fix())
  }
}
