import {arraymove, arrayremove} from '../common/util';
import {State} from '../common/state';
import {IProject, ProjectStatus, DraggableProjectBound} from './project-models';

export class ProjectState extends State{
    private _draggingProjectId: string = '';
    private _adjProjectId: string = '';
    private _adjProjectBeforeOrAfter: 'before'|'after'|'none' = 'none';
    private _insertListStatus: ProjectStatus = ProjectStatus.NONE;
    private _insertListBeforeOrAfter: 'before'|'after'|'none' = 'none';

    private _projects: IProject[] = [];
    private static _instance: ProjectState;
    static instance() {
        if(!this._instance) {
            this._instance = new ProjectState();
        }
        return this._instance; 
    }
    addProject(input: Partial<IProject>) {
        this._projects.unshift({ //insert to beginning
            ...input,
            id: Math.random().toString(), 
            status: ProjectStatus.TODO,
        });
        //we don't trust fn, pass the array clone as a good practice, not the original
        this.callEventListeners('updatelist', this._projects.slice());
    }
    dragProject(bound: DraggableProjectBound) {
        //no logic, just pass the params to other project items
        this.callEventListeners('dragitem', bound);
    }
    setDraggingProjectId(projectId: string) {
        this._draggingProjectId = projectId;
    }
    setInsertPosition(beforeOrAfter: 'before'|'after'|'none', projectId:string) {
        this._adjProjectId = projectId;
        this._adjProjectBeforeOrAfter = beforeOrAfter;
    }
    setInsertList(beforeOrAfter: 'before'|'after'|'none', status: ProjectStatus) {
        this._insertListStatus = status;
        this._insertListBeforeOrAfter = beforeOrAfter;
    }
    clearAdjacentProjectPosition() {
        this._adjProjectId = '';
        this._adjProjectBeforeOrAfter = 'none';
    }
    clearInsertListPosition() {
        this._insertListStatus = ProjectStatus.NONE;
        this._insertListBeforeOrAfter = 'none';
    }
    clearDragPoject() {
        this._draggingProjectId = '';
    }
    dropProject() {
        //if drop near a target adjacent project, move next to it
        let mutated = false;
        const srcProjIndex = this._projects.findIndex(p => p.id === this._draggingProjectId);
        if (this._adjProjectId && this._adjProjectBeforeOrAfter !== 'none') {
            const tarAdjIndex = this._projects.findIndex(p => p.id === this._adjProjectId);
            const tarDropIndex = this._adjProjectBeforeOrAfter === 'before'? tarAdjIndex : tarAdjIndex+1;
            this._projects[srcProjIndex]!.status = this._projects[tarAdjIndex]!.status;
            arraymove(this._projects, srcProjIndex, tarDropIndex); //mutating internal array
            mutated = true;
        //else if drop in target list area, insert into it
        } else if (this._insertListStatus != ProjectStatus.NONE && this._insertListBeforeOrAfter !== 'none' ) {
            const lenTodo = this._projects.filter(p=>p.status === ProjectStatus.TODO).length;
            const lenActive = this._projects.filter(p=>p.status === ProjectStatus.ACTIVE).length;
            const lenFinished = this._projects.filter(p=>p.status === ProjectStatus.FINISHED).length;
            let tarDropIndex = 0;
            if (this._insertListStatus === ProjectStatus.TODO) {
                tarDropIndex = this._insertListBeforeOrAfter == 'before'? 0 : lenTodo;
            } else if (this._insertListStatus === ProjectStatus.ACTIVE) {
                tarDropIndex = this._insertListBeforeOrAfter == 'before'? lenTodo : lenTodo+lenActive;
            } else if (this._insertListStatus === ProjectStatus.FINISHED) {
                tarDropIndex = this._insertListBeforeOrAfter == 'before'? lenTodo+lenActive : lenTodo+lenActive+lenFinished;
            }
            this._projects[srcProjIndex]!.status = this._insertListStatus;
            arraymove(this._projects, srcProjIndex, tarDropIndex); //mutating internal array
            mutated = true;
        } //else, drop outside in blank area, do nothing

        this.clearAdjacentProjectPosition();
        this.clearInsertListPosition();
        this.clearDragPoject();
        this.callEventListeners('dropitem', {});
        if (mutated) {
            //internal project list mutated
            this.callEventListeners('updatelist', this._projects.slice());
        } //if not, for example, drop outside in blank area, do nothing
    }
    deleteProject(projectId:string) {
        const removeIndex = this._projects.findIndex(p=>p.id === projectId);
        if (removeIndex >= 0) {
            arrayremove(this._projects, removeIndex); //mutating internal array
            this.callEventListeners('updatelist', this._projects.slice());
        }
    }
    protected callEventListeners<TParams>(event: 'updatelist' | 'dragitem' | 'dropitem', params: TParams) {
        const typelisteners = this._listeners[event];
        if (!typelisteners) return;
        for(const listener of typelisteners) {
            listener(params); 
        }
    }

}