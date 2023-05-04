import {DroppableComponent} from "../../common/drag-drop";
import {autobind} from '../../common/decorators';
import {DroppableListBound, IProject, ProjectStatus} from '../project-models';
import {ProjectState} from '../project-state';
import {ProjectItem} from './project-item';
import template from '../tpls/project-list.tpl';

export class ProjectList extends DroppableComponent<HTMLDivElement, HTMLDivElement> {
    private _projectItems: ProjectItem[] = [];
    constructor(private _state: ProjectState, private _status: ProjectStatus){
        super(template, 'app', `${ProjectStatus[_status]!.toLowerCase()}-projects`, 'beforeend');
        this.init();
        this.render();
        this.register();
    }
    protected init() {
        //nothing to init
    }
    protected render() {
        this._el.querySelector('ul')!.id = `${ProjectStatus[this._status]!.toLowerCase()}-projects-list`;
        this._el.querySelector('h2')!.textContent = `${ProjectStatus[this._status]!.toUpperCase()} PROJECTS`;
    }
    protected register() {
        this._state.addEventListener('updatelist',this.listAddedHandler);
        this._el.addEventListener('dragenter', this.dragEnterHandler);
        this._el.addEventListener('dragover', this.dragOverHandler);
        this._el.addEventListener('dragleave', this.dragLeaveHandler);
        this._el.addEventListener('drop', this.dropHandler);
    }
    protected load (){

    }
    protected renderList(projects: IProject[]) {
        const listEl = document.getElementById(`${ProjectStatus[this._status]!.toLowerCase()}-projects-list`) as HTMLUListElement;
        listEl.innerHTML = '';
        this._projectItems = [];
        for(const p of projects) {
            this._projectItems.push(new ProjectItem(p, 'dragdrop-projects', this._state, listEl.id));
        }
    }
    protected renderDroppable(droppable: boolean = true) {
        const listEl = this._el.querySelector('ul')!;
        if(droppable) {
            listEl.classList.add('droppable');
        } else {
            listEl.classList.remove('droppable');
        }
    }

    @autobind
    protected listAddedHandler(copiedList: IProject[]) {
        this.renderList(copiedList
            .filter(p => p.status === this._status));
    }
    @autobind
    protected dragEnterHandler(event: DragEvent) {
        //not used
    }
    @autobind
    protected dragOverHandler(event: DragEvent) {
            event.preventDefault();
            const listEl = this._el.querySelector('ul')!;
            const rect = listEl.getBoundingClientRect();
            const style = window.getComputedStyle(listEl);
            const bound = new DroppableListBound(this._status, event, style, rect);
            const beforeOrAfter = this.insertBeforeOrAfter(bound);
            this.renderDroppable();
            this._state.setInsertList(beforeOrAfter, this._status);
    }
    @autobind
    protected dropHandler(event: DragEvent) {
        if (this.isValidDragDrop(event)) {
            this.renderDroppable(false);
            this._state.dropProject();
        }
    }
    @autobind
    protected dragLeaveHandler(event: DragEvent) {
        if (this.hasIndeedLeft(event)) {
            this._state.setInsertList('none', ProjectStatus.NONE); //reset
            this.renderDroppable(false);
        }
    }
    private insertBeforeOrAfter(bound: DroppableListBound): 'before'|'after'|'none' {
        //insert before / after this list if the clientXY is with the top / bottom padding
        //else return 'none' if xy is not at header padding or footer padding area
        if(bound.clientX >= bound.rectLeft && bound.clientX <= bound.rectRight) {
            if (bound.clientY >= bound.rectTop && bound.clientY <= bound.rectTop + bound.paddingTop) {
                //console.log('insert before list');
                return 'before';
            }
            if (bound.clientY <= bound.rectBottom && bound.clientY >= bound.rectBottom - bound.paddingBottom) {
                //console.log('insert after list');
                return 'after';
            }
        }
        return 'none';
    }
    private hasIndeedLeft(event: DragEvent): boolean {
        const domRect = this._el.getBoundingClientRect();
        if(event.clientX < domRect.x || event.clientX > domRect.x + domRect.width) return true;
        if(event.clientY <domRect.y || event.clientY > domRect.y + domRect.height) return true;
        return false;
    }
    private isValidDragDrop(event:DragEvent): boolean {
        return event.dataTransfer !== null
        && event.dataTransfer.types[0] === 'text/plain' 
        && event.dataTransfer.getData('text/plain') === 'dragdrop-projects';
    }
    /* 
    Take projectInput class for example:

    register {
        el.addEventListener('submit', this.submitHandler)
    }

    submitHandler {
        collect & validate input
        then call _state.add(new project)
    }

    Take projectList class for example:

    register{
        _state.addEventListener(this.listAddedHandler)
    }

    listAddedHandler(projects data from _state) {
        render list with data
    }
    */
}