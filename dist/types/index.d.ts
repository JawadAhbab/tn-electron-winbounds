import { BrowserWindow } from 'electron';
import { HandleCorner } from './EWBPosfix/EWBPosfix';
import { EWBStates } from './EWBStates/EWBStates';
export declare class ElectronWinbounds {
    win: BrowserWindow;
    states: EWBStates;
    private posfix;
    constructor(win: BrowserWindow, scope: string, handleCorner: HandleCorner);
    private bindEvents;
}
