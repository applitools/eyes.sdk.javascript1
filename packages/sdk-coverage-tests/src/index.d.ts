interface Selector {
    css: string;
}
interface RegionCoordinates {
    left: number;
    top: number;
    width: number;
    height: number;
}
interface FloatingRegion {
    target: RegionCoordinates | Selector | number;
    maxUp: number;
    maxDown: number;
    maxLeft: number;
    maxRight: number;
}
interface ExecutionMode {
    isVisualGrid?: boolean;
    isCssStitching?: boolean;
    isScrollStitching?: boolean;
    useStrictName?: boolean;
}
declare module Hooks {
    interface Setup {
        (options: {
            branchName: string;
            baselineTestName: string;
            host: string;
            executionMode: ExecutionMode;
        }): Promise<any>;
    }
    interface Cleanup {
        (): Promise<any>;
    }
}
declare module EyesApi {
    interface Abort {
        (): Promise<any>;
    }
    interface CheckFrame {
        (target: Selector | Array<Selector>, options: {
            isClassicApi?: boolean;
            isFully?: boolean;
            tag?: string;
            matchTimeout?: number;
        }): Promise<any>;
    }
    interface CheckRegion {
        (target: Selector | Array<Selector> | RegionCoordinates, options: {
            isClassicApi?: boolean;
            isFully?: boolean;
            inFrame: Selector;
            ignoreRegion: Selector | RegionCoordinates;
            tag?: string;
            matchTimeout?: number;
        }): Promise<any>;
    }
    interface CheckWindow {
        (options: {
            isClassicApi?: boolean;
            isFully?: boolean;
            ignoreRegion?: Selector | RegionCoordinates;
            floatingRegion?: FloatingRegion;
            scrollRootElement?: Selector;
            tag?: string;
            matchTimeout?: number;
        }): Promise<any>;
    }
    interface Close {
        (throwsException?: boolean): Promise<any>;
    }
    interface getAllTestResults {
        (): Promise<any>;
    }
    interface Open {
        (options: {
            appName: string;
            viewportSize: string;
        }): Promise<any>;
    }
    interface ScrollDown {
        (pixes: number): Promise<any>;
    }
    interface SwitchToFrame {
        (selector: Selector): Promise<any>;
    }
    interface Type {
        (selector: Selector, inputText: string): Promise<any>;
    }
    interface Visit {
        (url: string): Promise<any>;
    }
}
