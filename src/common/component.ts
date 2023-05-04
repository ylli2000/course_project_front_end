//Base Component class
export abstract class Component<THOSTEL extends HTMLElement, TEL extends HTMLElement> {
    protected _el: TEL;
    constructor(template: string, hostId: string, elId: string, pos: InsertPosition) { 
        const templateEl = document.createElement('template');
        templateEl.innerHTML = template;
        const hostEl = document.getElementById(hostId) as THOSTEL;
        const importedNode = document.importNode(templateEl.content, true);
        this._el = importedNode.firstElementChild as TEL;
        this._el.id = elId;
        hostEl.insertAdjacentElement(pos, this._el);
    }
    protected abstract init(): void;
    protected abstract render(): void;
    protected abstract load(): void;
    protected abstract register(): void;
}