class sendFetch{

    constructor(p_activeTile, operation, mode){

        this.p_activeTile = p_activeTile
        this.operation = operation
        this.mode = mode

        return this.init()

    }

    init(){

        async function postData(url = '', data = {}, mode) {

            const response = await fetch(url, {
                
                method:  mode, // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *client

                body: ( mode == 'POST') ? JSON.stringify(data) : null

            });

                return response.text()

        }

        return postData('http://localhost:3000/'+ this.operation,  this.p_activeTile,  this.mode)

            .then((data) => {
                
                return data

            });
    



    }


}