async function init(elem = null, v = 0){

    let index = 4, tiles,
        active = true,

        mainMap = 
            [
                [5,5,4,4,4,5],
                [4,5,4,4,4,4],
                [4,3,3,3,3,4],
                [4,2,2,2,2,4],
                [4,4,5,4,4,4]


            ]


    if(elem == null){
    
        let x = 0,
            y = 4

        tiles = outlineRectSize(x, y, index, active, mainMap)

    }else{

        tiles = {}
        tiles.items = elem.items
        tiles.passed = elem.passed

    }


    let otherTiles = []
    let currX, currY


    for(let i = 0; tiles.items.length > i; i++){

        currX = tiles.items[i].match(/x:([0-9]{1,500})/)[1]
        currY = tiles.items[i].match(/y:([0-9]{1,500})/)[1]

        otherTiles[i] = outlineRectSize(Number(currX), Number(currY), index, active, mainMap)

    }


    otherTiles.forEach((elem, i, arr) => {
        
        tiles.items = tiles.items.concat(arr[i].items)
        tiles.passed = tiles.passed.concat(arr[i].passed)

    })

    let restruct = {}

    restruct.items = firstFilter(tiles.items)
    restruct.passed = firstFilter(tiles.passed)

    
    restruct.items = restruct.items.filter(elem => elem != null).sort()
    restruct.passed = restruct.passed.filter(elem => elem != null)

    v++
    
    if(restruct.items.length != restruct.passed.length) {

        return await init(restruct, v)
    
    }else{ 

        console.log('Перебор c числом циклов: '+v)

        return outlineShape(restruct.items, mainMap, index)
    }


}



//часть для запуска
async function wait(){

    this.data = await init()

    return this.data
}

wait().then(data =>{

    

    console.log(data)



})