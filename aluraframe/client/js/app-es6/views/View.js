
export class View {
    constructor(element) {
        this._element = element;
    }

    _template() {
        throw new Error("Not implemented");
    }

    update(model) {
        // this._element.innerHTML = this._template(model); // vaniilla
        this._element.html(this._template(model)); // jquery
    }

    static isView(view) {
        return Object.getPrototypeOf(view).constructor.__proto__.name == "View";
    }
}