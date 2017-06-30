import {BaseDao} from "./BaseDao";
import {Negociacao} from "../../entities/Negociacao";

export class NegociacaoDao extends BaseDao {
    constructor() {
        super("negociacao");
    }

    _createInstance(rs) {
        let negociacao = new Negociacao(rs._data || rs.data, rs._quantidade || rs.quantidade, rs._valor || rs.valor);
        return negociacao;
    }
}