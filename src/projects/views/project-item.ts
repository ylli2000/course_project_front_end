import {DraggableComponent} from "../../common/drag-drop";
import {autobind} from '../../common/decorators';
import {DraggableProjectBound, IProject} from '../project-models';
import {ProjectState} from '../project-state';
import Swal, { SweetAlertResult } from 'sweetalert2';
import template from '../tpls/project-item.tpl';

export class ProjectItem extends DraggableComponent<HTMLUListElement, HTMLLIElement> {
    private _delBtnEl!: HTMLDivElement;
    constructor(private _project:IProject, private _dragDropGroup:string, private _state:ProjectState, hostId:string) {
        super(template, hostId, _project.id, 'beforeend');
        this.init();
        this.render();
        this.register();
    }
    protected init() {
        this._delBtnEl = this._el.querySelector('.del-btn')!;
    }
    protected load() {
    }
    protected register() {
        this._state.addEventListener('dragitem',this.ItemDraggingHandler);
        this._state.addEventListener('dropitem',this.ItemDroppingHandler);
        this._el.addEventListener('dragstart', this.dragStartHandler);
        this._el.addEventListener('drag', this.dragHandler);
        this._el.addEventListener('dragend', this.dragEndHandler);
        this._delBtnEl.addEventListener('click', this.delBtnClickHandler);
    }
    protected render() {
        this._el.querySelector('h2')!.textContent = this._project.title!;
        this._el.querySelector('h3')!.textContent = this.getPriorityEmoji(this._project.priority!);
        this._el.querySelector('p')!.textContent = this._project.description!;
    }
    private renderDragging(dragging:boolean) {
        if (dragging) {
            this._el.classList.add('dragging');
        } else {
            this._el.classList.remove('dragging');
        }
    }
    private renderDragHover(beforeAfter: 'before'|'after'|'none') {
        if (beforeAfter === 'before' && !this._el.classList.contains('drag-hover-before')) {
            this._el.classList.add('drag-hover-before');
        }
        if (beforeAfter === 'before' && this._el.classList.contains('drag-hover-after')) {
            this._el.classList.remove('drag-hover-after');
        }
        if (beforeAfter === 'after' && !this._el.classList.contains('drag-hover-after')) {
            this._el.classList.add('drag-hover-after');
        }
        if (beforeAfter === 'after' && this._el.classList.contains('drag-hover-before')) {
            this._el.classList.remove('drag-hover-before');
        }
    }
    private clearDragHover() {
        if (this._el.classList.contains('drag-hover-before')) {
            this._el.classList.remove('drag-hover-before');
        }
        if (this._el.classList.contains('drag-hover-after')) {
            this._el.classList.remove('drag-hover-after');
        }
    }
    @autobind
    delBtnClickHandler(event: MouseEvent) {

    Swal.fire({
        title: 'Delete',
        text: "Are you sure?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0c6fcc',
        cancelButtonColor: '#ff0062',
        confirmButtonText: 'Yes'
        }).then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
            this._state.deleteProject(this._project.id);
            // Swal.fire(
            // 'Deleted!',
            // 'Your project has been deleted.',
            // 'success'
            // )
        }
        })

    }
    @autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this._dragDropGroup);
        this.renderDragging(true);
        this._state.setDraggingProjectId(this._project.id);
        //event.dataTransfer!.effectAllowed = 'copyMove';
    }
    @autobind
    dragHandler(event: DragEvent): void {
        const rect = this._el.getBoundingClientRect();
        const style = window.getComputedStyle(this._el);
        const item = new DraggableProjectBound(this._project.id, event, style, rect);
        this._state.clearAdjacentProjectPosition(); //reset and ready to get new info
        this._state.dragProject(item); //each item self-check to see if it is an adjacent object 
    }
    @autobind
    dragEndHandler(event: DragEvent): void {
        this.renderDragging(false); //the source being dragged
        this._state.dropProject();
    }
    @autobind
    ItemDraggingHandler(sourceBound: DraggableProjectBound) {
        if (sourceBound.projectId === this._project.id) return;
        const targetRect = this._el.getBoundingClientRect();
        const isHoverRect = this.isDraggingToTargetRect(targetRect, sourceBound);
        const beforeOrAfter = this.insertBeforeOrAfter(isHoverRect, targetRect, sourceBound);
        if (isHoverRect) {
            this.renderDragHover(beforeOrAfter);
            this._state.setInsertPosition(beforeOrAfter, this._project.id);
        } else {
            this.clearDragHover();
        }
    }
    @autobind
    ItemDroppingHandler() {
        this.clearDragHover(); //clear all target with 'insert here' indicator
    }
    private insertBeforeOrAfter(isHoverRect:boolean, targetRect:DOMRect, sourceBound: DraggableProjectBound): 'before'|'after'|'none' {
        //before or after depends on if clientXY is crossing upper/lower half way of the rect
        //'none' means, for example, clientXY is upper half way of the next item. Insert 
        // before next item is equaled to current position. no move is needed.
        if (isHoverRect) {
            if (sourceBound.clientY >= targetRect.y + targetRect.height/2 
            && sourceBound.clientY <= targetRect.bottom + sourceBound.marginBottom/2) {
                //at the lower half, half lower margin & half lower body
                return 'after';
            }
            if (sourceBound.clientY < targetRect.y + targetRect.height/2
            && sourceBound.clientY > targetRect.top - sourceBound.marginTop/2 ) {
                //at the upper half, half lower margin & half lower body
                return 'before';
            }
        }
        // else not inserting before or after
        return 'none';
    }
    private isDraggingToTargetRect(targetRect:DOMRect, sourceBound: DraggableProjectBound):boolean {
        //cursor around itself
        //for example, clientXY is upper half way of the next item. Insert 
        //before next item is equaled to current position. no move is needed.
        //same for lower half.
        if(sourceBound.clientY <= sourceBound.rectY + sourceBound.rectHeight/2
        && sourceBound.clientY >= sourceBound.rectY - sourceBound.marginTop - sourceBound.rectHeight/2) {
            return false;
        }
        if (sourceBound.clientY > sourceBound.rectY + sourceBound.rectHeight/2
        && sourceBound.clientY < sourceBound.rectY + sourceBound.marginBottom + sourceBound.rectHeight*1.5) {
            return false;
        }
        //cursor is outside this target rect
        if(sourceBound.clientX < targetRect.x - sourceBound.marginLeft || sourceBound.clientX > targetRect.x + targetRect.width + sourceBound.marginRight) return false;
        if(sourceBound.clientY < targetRect.y - sourceBound.marginTop/2) {
            return false;
        }
        if(sourceBound.clientY > targetRect.y + targetRect.height + sourceBound.marginBottom/2) {
            return false;
        }
        return true;
    }
    private getPriorityEmoji(priority: number): string {
        let s = '';
        while(s.length < priority*2) {
            s+='🔥';
        }
        return s;
    }
}