function outlineShape(p_tiles, p_mainMap, p_index){

    let currX, currY,
        frames = [],
        top, right, bottom, left

    for(let i = 0; p_tiles.length > i; i++){

        currX = Number(p_tiles[i].match(/x:([0-9]{1,500})/)[1])
        currY = Number(p_tiles[i].match(/y:([0-9]{1,500})/)[1])

        top    = checkRouteMap(currX, currY, p_mainMap, p_index, 'top')
        right  = checkRouteMap(currX, currY, p_mainMap, p_index, 'right')
        bottom = checkRouteMap(currX, currY, p_mainMap, p_index, 'bottom')
        left   = checkRouteMap(currX, currY, p_mainMap, p_index, 'left')

        frames[i] = writeState(currX, currY, top, right, bottom, left)

    }

    return frames

}