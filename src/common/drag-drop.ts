import { Component } from "./component";

 //drag and drop interfaces
export abstract class DraggableComponent<THOSTEL extends HTMLElement, TEL extends HTMLElement> extends Component<THOSTEL, TEL> {

    protected abstract dragStartHandler(event: DragEvent): void;
    protected abstract dragHandler(event: DragEvent): void;
    protected abstract dragEndHandler(event: DragEvent): void;
}
export abstract class DroppableComponent<THOSTEL extends HTMLElement, TEL extends HTMLElement> extends Component<THOSTEL, TEL>{
    protected abstract dragEnterHandler(event: DragEvent): void;
    protected abstract dragLeaveHandler(event: DragEvent): void;
    protected abstract dragOverHandler(event: DragEvent): void;
    protected abstract dropHandler(event: DragEvent): void;
}