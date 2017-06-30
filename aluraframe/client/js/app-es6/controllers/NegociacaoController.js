import {ListaNegociacoes} from "../models/entities/ListaNegociacoes";
import {Mensagem} from "../models/entities/Mensagem";
import {Negociacao} from "../models/entities/Negociacao";
import {NegociacoesView} from "../views/NegociacoesView";
import {MensagemView} from "../views/MensagemView";
import {ViewBind} from "../helpers/ViewBind";
import {NegociacaoDao} from "../models/repositories/daos/NegociacaoDao";
import {NegociacaoService} from "../services/NegociacaoService";
import {} from "../../libs-es6/jquery";

export class NegociacaoController {
    
    constructor() {
        // document.querySelector("#data"); // vaniila
        // let $ = document.querySelector.bind(document); //bind mantem o contexto do método na variável.
        // $("#data") // still vanilla
        // query("#data"); //snts
        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");
        this._listaNegociacoes = ViewBind.bind(new NegociacoesView($("#negociacoes-view")), 
            new ListaNegociacoes(), "adicionar", "removerTodas", "ordenar");
        this._mensagem = ViewBind.bind(new MensagemView($("#mensagem-view")), new Mensagem());
        this._ordenacao = {
            coluna: "",
            ordem: ""
        }

        this._initialize();
        Object.freeze(this);
    } 

    _initialize() {
        let promiseNegociacaoDao = new NegociacaoDao().select();
        promiseNegociacaoDao.then(result => {
            result.forEach(negociacao => {
                this._listaNegociacoes.adicionar(negociacao);
            });
        }).catch(error => {
            this._mensagem = "Não foi possível carregar as negociações";
        });

        setInterval(() => {
            this.importarNegociacoes();
        }, 1115000);

        let th = $("th");
        th.click = this.ordenar;
    }

    adicionar(e) {
        if (e) {
            e.preventDefault();
        }

        let negociacao = this._criarNegociacao();

        if (!negociacao) {
            return;
        }

        let promiseNegociacaoDao = new NegociacaoDao().insert(negociacao);
        promiseNegociacaoDao.then(result => {
            let negociacaoService = new NegociacaoService();

            negociacaoService.enviar(negociacao).then(() => {
                this._listaNegociacoes.adicionar(negociacao);
                this._mensagem.texto = `Negociação ${result} adicionada com sucesso.`;
                this._inicializarFormulario();
            });
        }).catch(error => {
            this._mensagem.texto = "Não foi possível adicionar a negociação";
        })
    }
    
    removerNegociacoes(e) {
        if (e) {
            e.preventDefault();
        }

        let promiseNegociacaoDao = new NegociacaoDao().delete();
        promiseNegociacaoDao.then(result => {
            this._listaNegociacoes.removerTodas();
            this._mensagem.texto = "Negociações apagadas com sucesso."
        }).catch(error => {
            this._mensagem = "Não foi possível apagar as negociações";
        });
    }

    importarNegociacoes(e) {
        if (e) {
            e.preventDefault();
        }

        let negociacaoService = new NegociacaoService();
        negociacaoService.importarNegociacoes(this._listaNegociacoes).then(negociacoes => {
            negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adicionar(negociacao);
            });
            this._mensagem.texto = `Negociações importadas com sucesso`;
        }).catch(error => this._mensagem.texto = error);
    }

    ordenar(e) {       
        let coluna = e.target.innerHTML.toLowerCase().trim();
        if (this._ordenacao.coluna == coluna) {
            this._ordenacao.ordem = "DESC";
            this._listaNegociacoes.ordenar((x, y) => y[coluna] - x[coluna]);    
        } else {
            this._ordenacao.coluna = coluna;
            this._ordenacao.ordem = "ASC";
            this._listaNegociacoes.ordenar((x, y) => x[coluna] - y[coluna]);  
        }
    }

    _criarNegociacao() {
        let data;
        try {
            data = new Date(this._inputData.val());
        } catch (ex) {
            this._mensagem.texto = "Data inválida";
            return;
        }
        
        let negociacao = new Negociacao(
            data,
            this._inputQuantidade.val(),
            this._inputValor.val()
        );

        return negociacao;
    }

    _inicializarFormulario() {
        this._inputData.val("");
        this._inputQuantidade.val(1);
        this._inputValor.val(parseFloat(0).toFixed(1));
        this._inputData.focus();
    }
}

let instance = new NegociacaoController();
export function getInstance() {
    return instance;
}