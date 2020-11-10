// async function init(elem = null, v = 0){

//     let index = 4, tiles,
//         active = true,

//         mainMap = 
//             [
//                 [5,5,4,4,4,5],
//                 [4,5,4,4,4,4],
//                 [4,3,3,3,3,4],
//                 [4,2,2,2,2,4],
//                 [4,4,5,4,4,4]


//             ]


//     if(elem == null){
    
//         let x = 0,
//             y = 4

//         tiles = outlineRectSize(x, y, index, active, mainMap)

//     }else{

//         tiles = {}
//         tiles.items = elem.items
//         tiles.passed = elem.passed

//     }


//     let otherTiles = []
//     let currX, currY


//     for(let i = 0; tiles.items.length > i; i++){

//         currX = tiles.items[i].match(/x:([0-9]{1,500})/)[1]
//         currY = tiles.items[i].match(/y:([0-9]{1,500})/)[1]

//         otherTiles[i] = outlineRectSize(Number(currX), Number(currY), index, active, mainMap)

//     }


//     otherTiles.forEach((elem, i, arr) => {
        
//         tiles.items = tiles.items.concat(arr[i].items)
//         tiles.passed = tiles.passed.concat(arr[i].passed)

//     })

//     let restruct = {}

//     restruct.items = firstFilter(tiles.items)
//     restruct.passed = firstFilter(tiles.passed)

    
//     restruct.items = restruct.items.filter(elem => elem != null).sort()
//     restruct.passed = restruct.passed.filter(elem => elem != null)

//     v++
    
//     //хвост скрипта
//     if(restruct.items.length != restruct.passed.length) {

//         return await init(restruct, v)
    
//     }else{ 

//         console.log('Перебор c числом циклов: '+v)
//         return restruct
//     }


// }

// //фильтрация от дубликатов
// function firstFilter(p_tiles){

//     this.restruct = []

//     for(let i in p_tiles){

//         this.fantom = p_tiles[i]
//         p_tiles[i] = true

//         this.restruct[i] = (!~p_tiles.indexOf(this.fantom)) ? this.fantom : null

//     }

//     return this.restruct

// }
// //забираем ближайшие к выбранному тайлу, слитные однотипы, по типу сторон креста
// function outlineRectSize(p_x, p_y, p_index, p_active, p_mainMap){


//     this.tiles = []
//     this.passed = []

//     if(checkExist(p_x-1, p_y, p_mainMap, p_index)){

//         this.tiles.push(`x:${p_x-1}, y:${p_y}`)
//     }

//     if(checkExist(p_x+1, p_y, p_mainMap, p_index)){

//         this.tiles.push(`x:${p_x+1}, y:${p_y}`)
//     }

//     if(checkExist(p_x, p_y-1, p_mainMap, p_index)){

//         this.tiles.push(`x:${p_x}, y:${p_y-1}`)
//     }

//     if(checkExist(p_x, p_y+1, p_mainMap, p_index)){

//         this.tiles.push(`x:${p_x}, y:${p_y+1}`)
//     }

//     this.passed.push( `x:${p_x}, y:${p_y}` )


//     return {
        
//         items:   this.tiles,
//         passed:  this.passed
    
//     }
// }
// //проверяем на существование тайла в массиве
// function checkExist(p_x, p_y, p_mainMap, p_index){

//     if(p_mainMap[p_x]) {

//         if(p_mainMap[p_x][p_y]){

//             return (p_mainMap[p_x][p_y] == p_index) ? true : false

//         }else{

//             return false
//         }
//     }else{

//         return false
//     }

// }

// //часть для запуска
// async function wait(){

//     this.data = await init()

//     return this.data
// }

// wait().then(data =>{

    

//     console.log(data.items)



// })



let result = [
    'x:0, y:2', 'x:0, y:3',
    'x:0, y:4', 'x:1, y:2',
    'x:1, y:3', 'x:1, y:4',
    'x:1, y:5', 'x:2, y:5',
    'x:3, y:5', 'x:4, y:3',
    'x:4, y:4', 'x:4, y:5'
  ]

let mainMap = 
  [
      [5,5,4,4,4,5],
      [4,5,4,4,4,4],
      [4,3,3,3,3,4],
      [4,2,2,2,2,4],
      [4,4,5,4,4,4]


  ]

let index = 4,
    currX, currY,
    frames = [],
    top, right, bottom, left

for(let i = 0; result.length > i; i++){

    currX = Number(result[i].match(/x:([0-9]{1,500})/)[1])
    currY = Number(result[i].match(/y:([0-9]{1,500})/)[1])

    top    = checkRouteMap(currX, currY, mainMap, index, 'top')
    right  = checkRouteMap(currX, currY, mainMap, index, 'right')
    bottom = checkRouteMap(currX, currY, mainMap, index, 'bottom')
    left   = checkRouteMap(currX, currY, mainMap, index, 'left')

    frames[i] = writeState(currX, currY, top, right, bottom, left)

}

console.log(frames)


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