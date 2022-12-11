import { ElectronWinbounds } from '..';
export declare class EWBStates {
    private timeout;
    private states;
    private ew;
    constructor(ew: ElectronWinbounds, scope: string);
    saveStates(): void;
    applyStates(): void;
    resetStates(): void;
}
