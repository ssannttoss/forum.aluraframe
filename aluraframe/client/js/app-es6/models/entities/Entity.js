
export class Entity {
    constructor() {
        // JSON.stringify Converting circular structure to JSON
        //this._propertyChanged = new EventEx(this);
    }

    equals(another) {
        JSON.stringify(this) == JSON.stringify(another);
    }

    static isEntity(entity) {
        return Object.getPrototypeOf(entity).constructor.__proto__.name == "Entity";
    }
}