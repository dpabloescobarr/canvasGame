window.onload = function() {

    localStorage.setItem('last_position', '1.1')
    localStorage.setItem('last_window', '500 -500')

    var canvas     = document.getElementById("canvas"),
        ctx        = canvas.getContext("2d"),
        width      = canvas.width = window.innerWidth,
        height     = canvas.height = window.innerHeight,
        tileWidth  = 60,
        tileHeight = 30,
        activeTile = null,
        infoTile,                                                //используется только для запоминания значения чтобы выдать его при клике на тайл
        centerRegion,                                        

        activeScale = {
            status: false
        },

        tiles = [],
        newStroke,
        img          = document.createElement("img"),
        lastPosition = localStorage.getItem('last_position'),
        lastWindow   = localStorage.getItem('last_window'),
        map,
        on_off = true                                                    //нужен для первого запуска

    //получаем карту
    let getMap = {

        //запрашиваем расширенную карту для кэша
        update_cache: async function (lastPosition){

            this.map   = await new sendFetch(lastPosition, 'getsql', 'POST')
            localStorage.setItem('cache', this.map)

        },
        //получаем нужные регионы из кэша
        get_local: function (lastPosition){

            let coords      = lastPosition.split('.'),
                y           = Number(coords[0]),
                x           = Number(coords[1]),
                cache       = JSON.parse(localStorage.getItem('cache')),
                dirtPoints  = [],
                clearPoints = [],

                regions = [`${y-1}.${x-1}`, `${y-1}.${x}`, `${y-1}.${x+1}`, `${y}.${x-1}`, `${y}.${x}`, `${y}.${x+1}`, `${y+1}.${x-1}`,`${y+1}.${x}`, `${y+1}.${x+1}`]
                    .filter(x => !/-/g.test(x))
                    
            dirtPoints[0] = []

            for(let v = 0, i = 0; v < cache[i].length; v++){

                if(regions.find(elem => elem == cache[i][v].region)){

                    dirtPoints[i][v] = {

                        type:   cache[i][v].type,
                        region: cache[i][v].region,
                        x:      cache[i][v].x,
                        y:      cache[i][v].y
                        
                    }
                }

                if(v == cache[i].length - 1){
                    v = -1
                    i++

                    if(i == cache.length - 1) break

                    dirtPoints[i] = []

                }
            }

            dirtPoints.map(elem =>{

                if(elem.length){

                    this.lineRegions = elem.filter(item => item != null && item != undefined)

                    clearPoints.push(this.lineRegions)
                }
            })
            //запоминаем центральную точку данного окружения
            centerRegion = lastPosition

            dirtPoints = null,
            cache      = null,
            regions    = null

            return clearPoints
        }
    }



    function init(){

        if(centerRegion && centerRegion != lastPosition || !centerRegion){
            
            console.log('ss')
            // await getMap.update_cache(lastPosition)
            map = getMap.get_local(lastPosition)
            //отрисовка карты
            drawNewRegions(map)
            
        }

        //оптимизация. При движениях курсора, начинается работа
        if(on_off || activeTile){
            
            this.x = ctx.getTransform().e
            this.y = ctx.getTransform().f

            ctx.clearRect(-5000, -5000, 10000, 10000)
            draw(map)

            if(on_off) on_off = false

            activeTile = null

        }
        requestAnimationFrame(init)

    }


    img.addEventListener("load", function() {

        lastPosition = before.position(lastPosition)
        lastWindow   = before.window(lastWindow).split(' ')
    
        //начальная видимая область карты
        ctx.translate(lastWindow[0], lastWindow[1])

        init()
    })

    let before = {

        position: function(lastPosition){

            if(lastPosition) return lastPosition
                else return '1.1'
        },

        window: function(lastWindow){

            if(lastWindow) return lastWindow
                else return '498.5 -500'
        }
    }
    
    img.src = "tileset.png"
    

    function drawNewRegions(map) {

        tiles = []

        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[0].length; y++) {
                
                tiles.push({ x: map[x][y].x, y: map[x][y].y, type: map[x][y].type, region: map[x][y].region, active: false })
            }
        }
    }
    
    async function draw(p_mainMap) {

        if(activeTile){

            newStroke  = await wait(activeTile, p_mainMap)

            //присваиваем полученной фигуре статус активного
            for(let i = 0; tiles.length > i; i++){
                
                for(stroke of newStroke){

                    if(tiles[i].x == stroke.x && tiles[i].y == stroke.y){

                        tiles[i].active = true

                        if(stroke.top)    tiles[i].top    = stroke.top
                        if(stroke.right)  tiles[i].right  = stroke.right
                        if(stroke.bottom) tiles[i].bottom = stroke.bottom
                        if(stroke.left)   tiles[i].left   = stroke.left

                    }
                }
            }

        }
        
        tiles.map(elem => drawImageTile(elem))
    }

    //здесь сдвиг на одну сторону по часовой. т.е bottom это left
    //карта сторон тайла задана по обзору на массив, а не визуально
    function smartStroke(p_mode, p_type, p_top, p_right, p_bottom, p_left){

        let construct = new Path2D(),
            noStroke = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            fit = 8

        //оптимизация. все тайлы которые находятся выше, не обводятся
        noStroke.find(elem =>{

            if(p_type && elem == p_type) p_mode = true

        })

        if(p_mode){

            construct.lineTo(tileWidth / 2 + 2, tileHeight / 2 + fit)
            construct.lineTo(2, tileHeight + fit)
            construct.lineTo(-tileWidth / 2 + 2, tileHeight / 2 + fit)
            construct.lineTo(3, fit)
            
            return construct

        }else{

            if(p_top) {

                construct.moveTo(-tileWidth / 2 + 2, tileHeight / 2 + fit)
                construct.lineTo(3, fit)
            }
            if(p_right){


                construct.moveTo(2, tileHeight + fit)
                construct.lineTo(-tileWidth / 2 + 2, tileHeight / 2 + fit)
            }
            if(p_bottom){


                construct.moveTo(tileWidth / 2 + 2, tileHeight / 2 + fit)
                construct.lineTo(2, tileHeight + fit)

            }
            if(p_left){
                

                construct.moveTo(2, fit)
                construct.lineTo(tileWidth / 2 + 2, tileHeight / 2 + fit)
            }

            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.stroke(construct);
            ctx.closePath()
        }

    }

    //отрисовка тайлов-картинок и одного квадрата вокруг тайл-картинки
    function drawImageTile({ x, y, type, active, top, right, bottom, left }) {

        const xx = (x - y) * tileWidth / 2
        const yy = (x + y) * tileHeight / 2

        ctx.save();
        ctx.translate(xx, yy)


        if (active) ctx.strokeStyle = 'red'
            else ctx.strokeStyle = '#ffffff00'

        //обводим за тайлом
        smartStroke(false, type, top, false, false, left)

        ctx.drawImage(img, type * tileWidth, 0, tileWidth, img.height,
        	-tileWidth / 2, 0, tileWidth, img.height);

        //обводим перед тайлом
        smartStroke(false, type, false, right, bottom, false)

        ctx.restore();

    }

    canvas.addEventListener('mousemove', function(e){

        let tile,
            isInPath = false

        for (tile of tiles) {

            isInPath = ctx.isPointInPath(
                smartStroke(true),
                e.clientX - (tile.x - tile.y) * tileWidth / 2,
                e.clientY - (tile.x + tile.y) * tileHeight / 2,

            )
            
            if (isInPath) break
        }
        

        if(isInPath) {

            infoTile          = tile
            activeTile        = tile
            activeTile.active = true

            //очистка при смене одного типа тайлов на другой курсором
            tiles.map(elem => elem.active = false)

        }else{
            activeTile = null;

            //очистка при уходе курсора из области самой карты
            tiles.map(elem => elem.active = false)

        }

        //система захвата курсором карты для масштабирования
        if(activeScale.status){

            ctx.setTransform(1, 0, 0, 1, e.clientX - activeScale.diffX, e.clientY - activeScale.diffY)

        }

    })

    canvas.addEventListener('mousedown', function(e){

        //фиксируем расстояние курсора на холсте для правильного ведения карты
        activeScale = {

            status: true,
            diffX: e.clientX - ctx.getTransform().e,
            diffY: e.clientY - ctx.getTransform().f
        }

    })

    canvas.addEventListener('mouseup', (e) => {

        activeScale.status = false

        if(infoTile){
            
            let x = ctx.getTransform().e,
                y = ctx.getTransform().f

            //записываем последнюю позицию экрана на карте
            localStorage.setItem('last_window', `${x} ${y}`)

            //записываем последнюю координату где находился игрок
            localStorage.setItem('last_position', infoTile.region)

            //перезаписываем переменную с последними координатами,
            //нужно для подгрузки окружающих регионов
            lastPosition = localStorage.getItem('last_position')

        }

    })

    canvas.addEventListener('mouseout', function(e) {

        if (activeTile) activeTile.active = false;
        
        activeTile = null;
        activeScale.status = false
    })

    canvas.addEventListener('click', async function(e){
        
        // const data = await new sendFetch(infoTile, 'currtile', 'POST')
        console.log(infoTile)
    })
    

}