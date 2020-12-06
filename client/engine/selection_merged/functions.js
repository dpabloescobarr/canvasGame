//фильтрация от дубликатов
function firstFilter(p_tiles){

    this.restruct = []

    for(i in p_tiles){

        this.fantom = p_tiles[i]
        p_tiles[i] = true

        this.restruct[i] = (!~p_tiles.indexOf(this.fantom)) ? this.fantom : null

    }

    return this.restruct

}

//забираем ближайшие к выбранному тайлу, слитные однотипы, по типу сторон креста
function outlineRectSize(p_x, p_y, p_type, p_active, p_mainMap){


    this.tiles = []
    this.passed = []

    if(checkExist(p_x-1, p_y, p_mainMap, p_type)){

        this.tiles.push(`x:${p_x-1}, y:${p_y}`)
    }

    if(checkExist(p_x+1, p_y, p_mainMap, p_type)){

        this.tiles.push(`x:${p_x+1}, y:${p_y}`)
    }

    if(checkExist(p_x, p_y-1, p_mainMap, p_type)){

        this.tiles.push(`x:${p_x}, y:${p_y-1}`)
    }

    if(checkExist(p_x, p_y+1, p_mainMap, p_type)){

        this.tiles.push(`x:${p_x}, y:${p_y+1}`)
    }

    this.passed.push( `x:${p_x}, y:${p_y}` )


    return {
        
        items:   this.tiles,
        passed:  this.passed
    
    }
}

//проверяем на существование тайла в массиве
function checkExist(p_x, p_y, p_mainMap, p_type){

    if(p_mainMap[p_x]) {

        if(p_mainMap[p_x][p_y]){

            return (p_mainMap[p_x][p_y] == p_type) ? true : false

        }else{

            return false
        }
    }else{

        return false
    }

}
//смотрим соседние тайлы и определяем его обводку
function checkRouteMap(p_x, p_y, p_mainMap, p_type, p_side){

    if(p_side == 'top' && p_mainMap[p_x-1]){
        
        return (p_mainMap[p_x-1][p_y] != p_type) ? true : false

    }else if(p_side == 'right' && p_mainMap[p_x][p_y+1]){

    
        return (p_mainMap[p_x][p_y+1] != p_type) ? true : false


    }else if(p_side == 'bottom' && p_mainMap[p_x+1]) {

        return (p_mainMap[p_x+1][p_y] != p_type) ? true : false

    }else if(p_side == 'left' && p_mainMap[p_x][p_y-1]){
        

        return (p_mainMap[p_x][p_y-1] != p_type) ? true : false

    }else{
        
        return true
    }

}

//пишем характеристики для каждого однотипного тайла фигуры
function writeState(p_x, p_y, p_top, p_right, p_bottom, p_left){

    return {

        x: p_x,
        y: p_y,
        top: p_top,
        right: p_right,
        bottom: p_bottom,
        left: p_left    
    
    }

}

function outlineShape(p_tiles, p_mainMap, p_type){

    let currX, currY,
        frames = [],
        top, right, bottom, left

    for(let i = 0; p_tiles.length > i; i++){

        currX = Number(p_tiles[i].match(/x:([0-9]{1,500})/)[1])
        currY = Number(p_tiles[i].match(/y:([0-9]{1,500})/)[1])

        top    = checkRouteMap(currX, currY, p_mainMap, p_type, 'top')
        right  = checkRouteMap(currX, currY, p_mainMap, p_type, 'right')
        bottom = checkRouteMap(currX, currY, p_mainMap, p_type, 'bottom')
        left   = checkRouteMap(currX, currY, p_mainMap, p_type, 'left')

        frames[i] = writeState(currX, currY, top, right, bottom, left)

    }

    return frames

}