import {} from "../../js/libs-es6/polyfill/fetch";
import {getInstance} from './controllers/NegociacaoController';

let negociacaoController = getInstance();
document.querySelector(".form").onsubmit = negociacaoController.adicionar.bind(negociacaoController);
document.querySelector("#btn-remover-negociacoes").onclick = negociacaoController.removerNegociacoes.bind(negociacaoController);
document.querySelector("#btn-importar-negociacoes").onclick = negociacaoController.importarNegociacoes.bind(negociacaoController);