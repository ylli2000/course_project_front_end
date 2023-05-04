//data models -------------------------
export enum ProjectStatus {
    NONE='NONE',
    TODO='TODO',
    ACTIVE='ACTIVE',
    FINISHED='FINISHED'
}

export interface IProject {
    id: string;
    title?: string, 
    description?: string, 
    priority?: number,
    status: ProjectStatus
};

//view logic models -----------------------
abstract class DragDropProperties {
    marginTop:number=0;
    marginBottom:number=0;
    marginLeft:number=0;
    marginRight:number=0;
    paddingTop:number=0;
    paddingBottom:number=0;
    paddingLeft:number=0;
    paddingRight:number=0;
    rectX:number=0;
    rectY:number=0;
    rectTop:number=0;
    rectBottom:number=0;
    rectLeft:number=0;
    rectRight:number=0;
    rectHeight:number=0;
    rectWidth:number=0;
    clientX:number=0;
    clientY:number=0;
    constructor(event: DragEvent, style:CSSStyleDeclaration, rect:DOMRect) {
        this.clientX = event.clientX;
        this.clientY = event.clientY;
        this.rectX = rect.x;
        this.rectY = rect.y;
        this.rectHeight = rect.height;
        this.rectWidth = rect.width;
        this.rectTop = rect.top;
        this.rectBottom = rect.bottom;
        this.rectLeft = rect.left;
        this.rectRight = rect.right;
        this.marginTop = parseFloat(style.marginTop);
        this.marginBottom = parseFloat(style.marginBottom);
        this.marginLeft = parseFloat(style.marginLeft);
        this.marginRight = parseFloat(style.marginRight);
        this.paddingTop = parseFloat(style.paddingTop);
        this.paddingBottom = parseFloat(style.paddingBottom);
        this.paddingLeft = parseFloat(style.paddingLeft);
        this.paddingRight = parseFloat(style.paddingRight);
    }
}
export class DraggableProjectBound extends DragDropProperties {
    constructor(public projectId:string, event: DragEvent, style:CSSStyleDeclaration, rect:DOMRect) {
        super(event, style, rect);
    }
}
export class DroppableListBound extends DragDropProperties {
    constructor(public listStatus:ProjectStatus, event: DragEvent, style:CSSStyleDeclaration, rect:DOMRect) {
        super(event, style, rect);
    }
}