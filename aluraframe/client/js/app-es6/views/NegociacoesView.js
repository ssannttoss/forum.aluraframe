import {View} from "./View";
import {} from "../../libs-es6/jquery";

export class NegociacoesView extends View {
    // override
    _template(model) {
        return `
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>QUANTIDADE</th>
                        <th>VALOR</th>
                        <th>VOLUME</th>
                    </tr>
                </thead>
            
                <tbody>
                    ${model.negociacoes.map(n => `
                        <tr id="${n.id}">
                            <td class="negociacao-data">${n.data}</td>
                            <td class="negociacao-quantidade">${n.quantidade}</td>
                            <td class="negociacao-valor">${n.valor}</td>
                            <td class="negociacao-volume">${n.volume}</td>
                        </tr>
                    `).join("")}
                </tbody>
            
                <tfoot>
                    <td class="total" colspan="3"></td>
                    <td>${
                        model.volumeTotal()
                    }</td>
                </tfoot>
            </table>
        `;
    }    
}