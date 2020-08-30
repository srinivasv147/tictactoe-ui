export class MessageContainer<T>{

    private maxLength: number = null;
    public arr: T[] = [];
    constructor(length: number){this.maxLength = length;}
    public insert(item: T){
        this.arr.unshift(item);
        if(this.arr.length > this.maxLength){
            this.arr.pop();
        }
    }

}