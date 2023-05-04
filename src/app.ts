import "./app.css";
import { ProjectState } from "./projects/project-state";
import { ProjectInput } from "./projects/views/project-input";
import { ProjectList } from "./projects/views/project-list";
import { ProjectStatus } from "./projects/project-models";

const state = ProjectState.instance();
new ProjectInput(state);
new ProjectList(state, ProjectStatus.TODO);
new ProjectList(state, ProjectStatus.ACTIVE);
new ProjectList(state, ProjectStatus.FINISHED);
