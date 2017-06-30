/**
 * Module Pattern alterado para Systemjs
 * https://scotch.io/bar-talk/4-javascript-design-patterns-you-should-know
 * https://medium.freecodecamp.com/javascript-modules-a-beginner-s-guide-783f7d7a5fcc
 */
const dbName = "aluraframe";
const version = 1;
const stores = ["negociacao"];
let connection = null;
let close = null; // Monkey Patch
/**
 * Module Pattern
    */
export class ConnectionFactory {
    constructor() {
        throw new Error("Static cannot be instatiated");
    }

    static getDbName() {
        return dbName;
    }

    static getConnection() {
        let promise  = new Promise((resolve, reject) => {
            let openRequest = window.indexedDB.open(dbName, version);

            openRequest.onupgradeneeded = e => {                    
                ConnectionFactory._createStores(e.target.result);
            }

            openRequest.onsuccess = e => {
                if (!connection) {
                    connection = e.target.result;

                    /**
                     * Monkey Patch - Sem usar function por causa do escopo dinâmico ao invés de arrow function
                        * http://me.dt.in.th/page/JavaScript-override/
                        * https://davidwalsh.name/monkey-patching
                        * https://stackoverflow.com/questions/5741877/is-monkey-patching-really-that-bad
                        */
                    close = connection.close.bind(connection);
                    // bind é necessário para manter o contexto de quem é "dono da função"
                    // outra opção seria usar Reflec.apply na chamada da função ();
                    connection.close = function() {
                        throw new Error("Cannot call connection.close(). Use ConnectionFactory.close() instead.");
                    };
                }
                
                resolve(connection);
            }

            openRequest.onerror = e => {
                console.error(e.target.error);
                reject(e.target.error.name);
            }
        });

        return promise;
    }

    static _createStores(connection) {
        stores.forEach(store => {
            if (connection.objectStoreNames.contains(store)) {
                connection.deleteObjectStore(store);
            }

            let result = connection.createObjectStore(store, {autoIncrement: true});
        });
    }

    static closeConnection() {
        if (connection) {  
            close();
            connection = null;
        }
    }
}