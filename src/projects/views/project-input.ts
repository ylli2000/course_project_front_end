import {autobind} from '../../common/decorators';
import {Component} from '../../common/component';
import {IProject} from '../project-models';
import {ProjectState} from '../project-state';
import {validate, IValidatable, ValidateResults} from '../../common/validate';
import template from '../tpls/project-input.tpl';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    private _titleInputEl!: HTMLInputElement;
    private _descriptionInputEl!: HTMLInputElement;
    private _priorityInputEl!: HTMLInputElement;
    private _demoDataIndex: number = 0;
    constructor(private _state: ProjectState) {
        super(template, 'app', 'user-input', 'afterbegin');
        this.init();
        this.render();
        this.register();
    }
    protected init() {
        this._titleInputEl = this._el.querySelector("#title") as HTMLInputElement;
        this._descriptionInputEl = this._el.querySelector("#description") as HTMLInputElement;
        this._priorityInputEl = this._el.querySelector("#priority") as HTMLInputElement;
    }
    protected register() {
        this._el.addEventListener("submit", this.submitHandler);
    }
    protected render() {
        this.clearUserInput();
        this.demoUserInput(); //demo only
    }
    protected load() {
        //nothing to load
    }
    
    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const validate = this.validateUserInput();
        if (validate.isValid()) {
            const input = this.gatherUserInput();
            this._state.addProject(input);
            this.clearUserInput();
            this.demoUserInput(); //demo only
        } else {
            alert(validate.toString());
        }
    }
    private validateUserInput() : ValidateResults {
        const rule1: IValidatable = {
            name: 'Title',
            value: this._titleInputEl.value,
            required: true,
            minLength: 1
        };
        const rule2: IValidatable = {
            name: 'Priority',
            value: parseInt(this._priorityInputEl.value),
            required: true,
            min: 0,
            max: 5
        }
        return validate(rule1, rule2);
    }
    private gatherUserInput(): Partial<IProject> {
        return {
            title: this._titleInputEl.value ?? '',
            description: this._descriptionInputEl.value ?? '',
            priority: +this._priorityInputEl.value
        };
    }
    private clearUserInput() {
        this._titleInputEl.value = '';
        this._descriptionInputEl.value = '';
        this._priorityInputEl.value = '';
    }
    private demoUserInput() {
        
        const demoInputs: {title:string, desc:string, priority:number}[] = [{
            title: 'Develop a demo project',
            desc: 'To show case typescript',
            priority: 5
        }, {
            title: 'Catch up meeting',
            desc: 'Jack & Kal are going to be there...yeah',
            priority: 3
        }, {
            title: 'Renovate the guly kitchen',
            desc: 'Hmmm...do I want to go into this now?',
            priority: 2
        }, {
            title: 'Build an auto fish feeder',
            desc: 'My goldfish really needs it!',
            priority: 4
        }, {
            title: 'Finish the AI course',
            desc: 'try to do that during the holidays',
            priority: 2
        }];
        if (this._demoDataIndex > demoInputs.length-1) return; //free inputs after demo
        const di = demoInputs[this._demoDataIndex]!;
        this._titleInputEl.value = di.title;
        this._descriptionInputEl.value = di.desc;
        this._priorityInputEl.value = di.priority.toString();
        this._demoDataIndex++;
    }
}