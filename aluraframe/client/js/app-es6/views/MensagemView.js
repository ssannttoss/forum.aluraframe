import {View} from "./View";

export class MensagemView extends View {
    // override
    _template(model) {
        // return $("<p>").addClass("alert").addClass("alert-info").text(model.texto); //jquery 
        return `<p class="alert alert-info">${model.texto}</p>`;
    }
}