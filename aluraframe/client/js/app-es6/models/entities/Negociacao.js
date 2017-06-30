import {Entity} from "./Entity";

export class Negociacao extends Entity {
    constructor(data, quantidade, valor) {
        super();
        // _ é uma convenção para deixar os dados privados à classe

        // Ao invés usar a referência da data (que poderia ser alterada externamente) retorna uma nova data com base na data.
        this._data = new Date(data.getTime());
        this._quantidade = parseInt(quantidade);
        this._valor = parseFloat(valor);
        this._id = this._data.getTime();
        
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
        //Object.freeze(this);
    }

    get id() {
        return this._id;
    }

    get data() {
        // Ao invés de retornar a referência da data (que poderia ser alterada) retorna uma nova data com base na data.
        return new Date(this._data.getTime());
    }

    get quantidade() {
        return this._quantidade;
    }

    get valor() {
        return this._valor;        
    }

    get volume() {
        return this._quantidade * this._valor;
    }

    equals(another) {
        let isEqual = JSON.stringify(data) == JSON.stringify(data) && this._quantidade == another.quantidade &&
            this._valor == another.valor;
        return isEqual;
    }
}