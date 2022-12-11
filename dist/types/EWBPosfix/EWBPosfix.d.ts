import { ElectronWinbounds } from '..';
export type Corner = [x1: number, y1: number, x2: number, y2: number];
export type HandleCorner = (winbound: Electron.Rectangle) => Corner;
export declare class EWBPosfix {
    private ew;
    private handleCorner;
    constructor(ew: ElectronWinbounds, handleCorner: HandleCorner);
    fix(): void;
    private insideScreen;
    private insideDisp;
}
