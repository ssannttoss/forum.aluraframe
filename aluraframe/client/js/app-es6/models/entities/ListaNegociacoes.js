import {Entity} from "./Entity";

export class ListaNegociacoes extends Entity {
    constructor() {
        super();
        this._negociacoes = [];
        Object.freeze(this);
    }

    adicionar(negociacao) {
        this._negociacoes.push(negociacao);
    }

    get negociacoes() {
        // cria um novo array. proteção da referência ao objeto lista da classe.
        return [].concat(this._negociacoes);
    }

    removerTodas() {
        // https://appendto.com/2016/02/empty-array-javascript/
        this._negociacoes.length = 0;
    }

    volumeTotal() {
        //IIFE https://developer.mozilla.org/en-US/docs/Glossary/IIFE  
        // (function() {
        //     let total = 0;
        //     this.negociacoes.forEach(n => total += n.volume);
        //     return total;
        // })()

        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=control
        return this._negociacoes.reduce((total, n) => total + n.volume, 0.0);
    }

    ordenar(criterio) {
        return [].concat(this._negociacoes.sort(criterio));
    }
}