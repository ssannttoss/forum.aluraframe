import {Negociacao} from "../models/entities/Negociacao";
import {HttpService} from "./HttpService";

export class NegociacaoService {
    constructor() {
        this._httpService = new HttpService();
    }

    importarNegociacoes(listaNegociacoes) {
        // Usandor padrão de https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise
        return new Promise((resolve, reject) => Promise.all(
                [this._obterNegociacoesSemana(), 
                this._obterNegociacoesSemanaAnterior(),
                this._obterNegociacoesSemanaRetrasada()]
            ).then(negociacoesPeriodos => {
                // flaten transforma as 3 listas em um e considera apenas as informações de negociações (descarta o período)
                let negociacoes = negociacoesPeriodos.reduce((negociacoes, negociacoesPeriodo) => 
                    negociacoes.concat(negociacoesPeriodo.negociacoes), []);

                // Filtra removendo as já existentes
                // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/some
                negociacoes = negociacoes.filter(negociacao => !listaNegociacoes.negociacoes.some(n => 
                    n.equals(negociacao))
                );
                resolve(negociacoes);
            }).catch(error => reject(error))
        );
    }

    _obterNegociacoesSemana() {
        return this._importarNegociacoes("semana");
    }

    // // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise
    _obterNegociacoesSemanaAnterior() {
        return this._importarNegociacoes("anterior");
    }

    _obterNegociacoesSemanaRetrasada() {
        return this._importarNegociacoes( "retrasada");
    }

    enviar(negociacao) {
        return this._httpService.post(`negociacoes`, negociacao);
    }

    _importarNegociacoes(periodo) {
        let promisse = new Promise((resolve, reject) => {
            this._httpService.get(`negociacoes/${periodo}`)
                .then(result => {
                    resolve({ 
                        negociacoes: result.map(o => new Negociacao(new Date(o.data), o.quantidade, o.valor)),
                        periodo: "semana"
                    });
                }).catch(error => {
                    console.error(error);
                    reject(error);
                });
        });        
        return promisse;
    }    
}