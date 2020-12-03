async function init(elem = null, v = 0, p_activeTile, p_mainMap, p_last_length = 0){

    let type = p_activeTile.type, 
        tiles,
        active = true

    if(elem == null){
    
        let x = p_activeTile.x,
            y = p_activeTile.y

        tiles = outlineRectSize(x, y, type, active, p_mainMap)

    }else{

        tiles = {
            items:  elem.items,
            passed: elem.passed
        }

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

    let restruct = {
        items:  firstFilter(tiles.items),
        passed: firstFilter(tiles.passed)
    }

    restruct.items  = restruct.items.filter(elem => elem != null).sort()
    restruct.passed = restruct.passed.filter(elem => elem != null)

    v++

    //сравниваются - новые найденные тайлы из одиночных и просмотренные тайлы
    //&& последняя длина массива с сущестующей, для реализации одиночного тайла
    //отдаем коллекцию тайлов для обводки
    if(restruct.items.length != restruct.passed.length && p_last_length != restruct.items.length) {

        return await init(restruct, v, p_activeTile, p_mainMap, restruct.items.length)
    
    //отдаем всего один тайл для его обводки
    }else if(restruct.items.length != restruct.passed.length && p_last_length == restruct.items.length){ 

        return [{

            x: p_activeTile.x,
            y: p_activeTile.y,
            top: true,
            right: true,
            bottom: true,
            left: true

        }]

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
