import {ConnectionFactory} from "../../../services/ConnectionFactory";
import {Entity} from "../../entities/Entity";

export class BaseDao {
    constructor(store) {
        this._connection = ConnectionFactory.getConnection()
        this._store = store;
    }
    
    insert(entity) {
        return this._modify(entity, true);
    }

    _createInstance(rs) {
        throw new Error("Not implemented");
    }

    select() {
        let promise = new Promise((resolve, reject) => {
            this._connection.then(connection => {
                let transaction = connection.transaction(this._store, "readwrite");
                let store = transaction.objectStore(this._store);
                let cursor = store.openCursor();
                let entities = [];
                cursor.onsuccess = (e) => {
                    console.debug(`onsuccess opencursor: ${e.target}`);
                    let current = e.target.result;

                    if (current) {
                        console.debug(`current: ${current}`);
                        let rs = current.value;
                        let entity = this._createInstance(rs);
                        entities.push(entity);
                        current.continue();
                    } else {
                        resolve(entities);
                    }
                }

                cursor.onerror = (e) => {
                    reject(e.target.error); // DOMError
                }
            });
        });

        return promise;
    }

    delete() {
        let promise = new Promise((resolve, reject) => {
            this._connection.then(connection => {
                let transaction = connection.transaction(this._store, "readwrite");
                let store = transaction.objectStore(this._store);
                let request = store.clear();
                request.onsuccess = (e) => {
                    console.debug(`onsuccess clear: ${e.target.result}`);
                    resolve(e.target.result);
                }

                request.onerror = (e) => {
                    reject(e.target.error); // DOMError
                }
            });
        });

        return promise;
    }

    _modify(entity, adding) {
        if (!Entity.isEntity(entity)) {
            throw new Error("Invalid type");
        }        

        let promise = new Promise((resolve, reject) => {
            this._connection.then(connection => {
                let transaction = connection.transaction(this._store, "readwrite");

                let store = transaction.objectStore(this._store);
                let eventPropertyChanged = entity._propertyChanged;
                delete entity._propertyChanged;
                let request = adding ? store.add(entity) : store.put(entity);
                
                request.onsuccess = (e) => {
                    entity._propertyChanged = eventPropertyChanged;
                    console.info(`ID: ${e.target.result}`);
                    resolve(e.target.result); //ID of the added object
                }

                request.onerror = (e) => {
                    reject(e.target.error); // DOMError
                }
            });
        });

        return promise;
    }
}