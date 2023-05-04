//validation
export interface IValidatable {
    name: string;
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}
export class ValidateResults {
    errs: { message: string }[] = [];
    isValid(): boolean {
        return this.errs.length === 0;
    }
    toString() {
        return this.errs.map(x => x.message).join('\n');
    }
}
export function validate(...inputs: IValidatable[]): ValidateResults {
    const res = new ValidateResults();
    for (const input of inputs) {
        if (typeof input.value === 'string') {
            if (input.required && input.value.trim().length <= 0) {
                res.errs.push({ message: `${input.name} is required.` });
                continue;
            }
            if (input.minLength && input.value.length < input.minLength) {
                res.errs.push({ message: `${input.name} cannot be shorter than ${input.minLength} characters.` });
                continue;
            }
            if (input.maxLength && input.value.length > input.maxLength) {
                res.errs.push({ message: `${input.name} cannot be longer than ${input.maxLength} characters.` });
                continue;
            }
        }
        if (typeof input.value === 'number') {
            if (isNaN(input.value)) {
                res.errs.push({ message: `${input.name} is required.` });
                continue;
            }
            if (input.min && input.value < input.min) {
                res.errs.push({ message: `${input.name} cannot be smaller than ${input.min}.` });
                continue;
            }
            if (input.max && input.value > input.max) {
                res.errs.push({ message: `${input.name} cannot be greater than ${input.max}.` });
                continue;
            }
        }
    }
    return res;
}