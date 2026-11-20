declare const fullscreenController: {
    toggle: (element?: HTMLElement) => void;
    isAPIFullscreen: () => boolean;
    onStateChange: (callback: any) => void;
    offStateChange: (callback: any) => void;
    _initF11Prevention: () => void;
};
