module.exports = class getRandomInt{

    constructor(min, max){

        min = Math.ceil(min)
        max = Math.floor(max)

        this.result = Math.floor(Math.random() * (max - min + 1)) + min;

    }
}

