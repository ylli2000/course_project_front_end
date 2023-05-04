//autobind decorator
export function autobind(
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };
    return adjDescriptor;
}
//another sample decorator
export function sample(param: string) {
    return function (
        target: any,
        methodName: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        //runs everytime the method is called
        //same as get() in the other decorator, a different approach
        descriptor.value = function(...args: any[]) {
            const newMethod = originalMethod.apply(this, args); 
            console.log(this);
            return newMethod;
        }
    }
}