//Project State Management
type ListenerFn = (...params:any) => void;
export abstract class State {
    protected _listeners: {[key: string]:ListenerFn[]}={};
    protected constructor() {}
    addEventListener(event: string, fn: ListenerFn) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event]!.push(fn);
    }
    protected abstract callEventListeners(event:string, params:any): void;
    //static doesn't work with abstract
    //static doesn't work wtih generics T
}