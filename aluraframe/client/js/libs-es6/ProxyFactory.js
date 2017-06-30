export class ProxyFactory {
    static create(object, handlers, action, context, before = false) {
        return new Proxy(object, {
            get(target, handler, receiver) {
                if ((!ProxyFactory._hasHandlerFilter(handlers) || handlers.includes(handler)) && typeof(target[handler]) == typeof(Function)) {
                    return function() {
                        ProxyFactory._runAction(context, action, [target], before);    
                        let result = Reflect.apply(target[handler], target, arguments);
                        ProxyFactory._runAction(context, action, [target], !before);    
                        return result;
                    }
                } else {
                    return target[handler]; //ou Reflect.get(target, handler, receiver);
                }
            }, 

            set(target, handler, value, receiver) {
                if (!ProxyFactory._hasHandlerFilter(handlers) || handlers.includes(handler)) {
                    ProxyFactory._runAction(context, action, [target], before);                                    
                    target[handler] = value;
                    ProxyFactory._runAction(context, action, [target], !before);            
                    return target[handler] == value;  // Mantendo o return booleano do Reflect.set  
                }
            } 
        });
    }

    static _hasHandlerFilter(handlers) {
        return handlers && handlers.length > 0;
    }

    static _runAction(context, action, args, canRun) {
        if (!canRun) {
            return;
        }
        if (context) {
            Reflect.apply(action, context, args);
        } else {
            action(args);
        }
    }
}