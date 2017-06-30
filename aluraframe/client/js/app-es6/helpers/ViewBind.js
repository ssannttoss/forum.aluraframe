import {View} from "../Views/View";
import {ProxyFactory} from "../../libs-es6/ProxyFactory";
 
export class ViewBind {
    /**
     * 
     * @param {*} view 
     * @param {*} model 
     * @param {*} properties REST operator https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
     */
    static bind(view, model, ...properties) {
        if (!View.isView(view)) {
            throw new Error("Invalid type");
        }

        let proxy = ProxyFactory.create(model, properties, view.update, view);
        view.update(model);
        return proxy;
    }
}

