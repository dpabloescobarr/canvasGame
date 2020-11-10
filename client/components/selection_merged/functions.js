//фильтрация от дубликатов
function firstFilter(p_tiles){

    this.restruct = []

    for(let i in p_tiles){

        this.fantom = p_tiles[i]
        p_tiles[i] = true

        this.restruct[i] = (!~p_tiles.indexOf(this.fantom)) ? this.fantom : null

    }

    return this.restruct

}

//забираем ближайшие к выбранному тайлу, слитные однотипы, по типу сторон креста
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

//проверяем на существование тайла в массиве
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
//смотрим соседние тайлы и определяем его обводку
function checkRouteMap(p_x, p_y, p_mainMap, p_index, p_side){

    if(p_side == 'top' && p_mainMap[p_x-1]){
        
        return (p_mainMap[p_x-1][p_y] != p_index) ? true : false

    }else if(p_side == 'right' && p_mainMap[p_x][p_y+1]){

    
        return (p_mainMap[p_x][p_y+1] != p_index) ? true : false


    }else if(p_side == 'bottom' && p_mainMap[p_x+1]) {

        return (p_mainMap[p_x+1][p_y] != p_index) ? true : false

    }else if(p_side == 'left' && p_mainMap[p_x][p_y-1]){
        

        return (p_mainMap[p_x][p_y-1] != p_index) ? true : false

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