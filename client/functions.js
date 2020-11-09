
(function init(elem = null, v = 0){


    let index = 4,
        mainMap = 
            [
                [5,5,4,4,4,5],
                [4,5,4,4,4,4],
                [4,3,3,3,3,4],
                [4,2,2,2,2,4],
                [4,4,5,5,4,4]


            ],
        active = true,
        tiles


    if(elem == null){
    
        let x = 3,
            y = 0

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

    //хвост скрипта
    restruct.items = restruct.items.filter(elem => elem != null)
    restruct.passed = restruct.passed.filter(elem => elem != null)

    v++

    if(restruct.items.length != restruct.passed.length) init(restruct, v)
        else console.log('Перебор c числом циклов: '+v)


})()

function firstFilter(p_tiles){

    this.restruct = []

    for(let i in p_tiles){

        this.fantom = p_tiles[i]
        p_tiles[i] = true

        this.restruct[i] = (!~p_tiles.indexOf(this.fantom)) ? this.fantom : null

    }

    return this.restruct

}

function outlineRectSize(p_x, p_y, p_index, p_active, p_mainMap){


    this.tiles = []
    this.passed = []

    if(checkExist(p_x-1, p_y, p_mainMap, p_index)){

        this.tiles.push(`x:${p_x-1}, y:${p_y}`)
    }

    if(checkExist(p_x+1, p_y, p_mainMap, p_index)){

        this.tiles.push(`x:${p_x+1}, y:${p_y}`)
    }

    if(checkExist(p_x, p_y-1, p_mainMap, p_index)){

        this.tiles.push(`x:${p_x}, y:${p_y-1}`)
    }

    if(checkExist(p_x, p_y+1, p_mainMap, p_index)){

        this.tiles.push(`x:${p_x}, y:${p_y+1}`)
    }

    this.passed.push( `x:${p_x}, y:${p_y}` )


    return {
        
        items:   this.tiles,
        passed:  this.passed
    
    }
}

function checkExist(p_x, p_y, p_mainMap, p_index){

    if(p_mainMap[p_x]) {

        if(p_mainMap[p_x][p_y]){

            return (p_mainMap[p_x][p_y] == p_index) ? true : false

        }else{

            return false
        }
    }else{

        return false
    }

}

