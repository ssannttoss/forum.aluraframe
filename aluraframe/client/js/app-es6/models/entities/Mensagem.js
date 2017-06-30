import {Entity} from "./Entity";

export class Mensagem extends Entity {
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Default_parameters
    constructor(texto = "") {
        super();
        this._texto = texto;
    }

    get texto() {
        return this._texto;
    }

    set texto(texto) {
        this._texto = texto;
    }
}