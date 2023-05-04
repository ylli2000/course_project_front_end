export function extraData<T extends Object, U extends keyof T>(obj: T, key: U): T[U] {
    return obj[key];
}
export function arraymove<T>(arr:Array<T>, fromIndex:number, toIndex:number) {
    var element = arr[fromIndex]!;
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}
export function arrayremove<T>(arr:Array<T>, index:number):T|null {
    const res = arr.splice(index, 1);
    if(res.length > 0) return res[0]!;
    return null;
}

// interface UserBase {
//     email: string
//     image: string | null
//     username: string
// }

// interface UserProfile {
//     id: string
//     email: string
//     image: string | null
//     isAdmin: boolean
//     username: string
//     reviews: string[]
// }