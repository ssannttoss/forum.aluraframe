export class HttpService {
    _handleErrors(response) {
        if (response.ok) {
            return response;
        }
        throw new Error(`Status: ${response.status} ${response.statusText} - url: ${response.url}`);
    }

    get(url) {
        if (self.fetch) {
            // https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch   
            // polifill https://github.com/github/fetch
            let promise = fetch(url)
                            .then(response => this._handleErrors(response))
                            .then(response => response.json());
            return promise;
        } else {
            let promise = new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.onload = () => {
                    if (xhr.status == 200) {   
                        let object = JSON.parse(xhr.responseText);                            
                        resolve(object);
                    } else {
                        console.error(`Requisição falhou. Erro: ${xhr.responseText}`);
                        reject("Não foi possível processar a requisição");
                    }
                    
                };
                xhr.send();
            });
            return promise;
        }
    }

    post(url, params) {
        if (self.fetch) {
            let promise = fetch(url, {
                headers: { "Content-type": "application/json" },
                method: "post",
                body: JSON.stringify(params)
            })
            .then(response => {
                return this._handleErrors(response);
            }).catch(error => console.log(error));

            return promise;
        } else {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4) {

                        if (xhr.status == 200) {

                            resolve(JSON.parse(xhr.responseText));
                        } else {

                            reject(xhr.responseText);
                        }
                    }
                };
                xhr.send(JSON.stringify(params)); // usando JSON.stringifly para converter objeto em uma string no formato JSON.
            });
        }
    }
}