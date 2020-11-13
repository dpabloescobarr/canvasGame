async function init(elem = null, v = 0, p_activeTile, p_mainMap){

    let type = p_activeTile.type, 
        tiles,
        active = true

    if(elem == null){
    
        let x = p_activeTile.x,
            y = p_activeTile.y

        tiles = outlineRectSize(x, y, type, active, p_mainMap)

    }else{

        tiles = {}
        tiles.items = elem.items
        tiles.passed = elem.passed

    }


    let otherTiles = [],
        currX,
        currY


    for(let i = 0; tiles.items.length > i; i++){

        currX = tiles.items[i].match(/x:([0-9]{1,500})/)[1]
        currY = tiles.items[i].match(/y:([0-9]{1,500})/)[1]

        otherTiles[i] = outlineRectSize(Number(currX), Number(currY), type, active, p_mainMap)

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

        return await init(restruct, v, p_activeTile, p_mainMap)
    
    }else{ 

        // console.log('Перебор c числом циклов: '+v)

                //outlineShape.js
        return outlineShape(restruct.items, p_mainMap, type)
    }


}



//часть для запуска
async function wait(p_activeTile, p_mainMap){

    this.data = await init(null, 0, p_activeTile, p_mainMap)

    return this.data
}
