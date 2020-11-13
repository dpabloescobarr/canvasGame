window.onload = function() {

    var canvas     = document.getElementById("canvas"),
        ctx        = canvas.getContext("2d"),
        width      = canvas.width = window.innerWidth,
        height     = canvas.height = window.innerHeight,
        tileWidth  = 60,
        tileHeight = 30,
        activeTile = null,

        activeScale = {
            status: false
        };

    let tiles = [],
        newStroke,
        img = document.createElement("img")
    
        
    let getMap = async function (){

        this.map = await new sendFetch(activeTile, 'getmap', 'GET')

        return JSON.parse(this.map)
    }

    img.addEventListener("load", async function() {

            const map = await getMap()
            
            init(map)
            
            setInterval(() => {

                ctx.clearRect(-width, -1000, 3000, 3000)
                draw(map)

            },30)



    })
    
    img.src = "tileset.png"

    ctx.translate(width / 2, 10)


    function init(map) {

        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[x].length; y++) {
                tiles.push({ x, y, type: map[x][y], active: false })

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

                        if(stroke.top)  tiles[i].top = stroke.top
                        if(stroke.right)  tiles[i].right= stroke.right
                        if(stroke.bottom)  tiles[i].bottom = stroke.bottom
                        if(stroke.left)  tiles[i].left = stroke.left

                    }
                }
            }

        }
        
        tiles.forEach(elem => drawImageTile(elem))
    }

    //здесь сдвиг на одну сторону по часовой. т.е bottom это left
    //карта сторон тайла задана по обзору на массив, а не визуально
    function flag(p_top, p_right, p_bottom, p_left){

        let construct = new Path2D()

        if(p_top) {
            construct.moveTo(-tileWidth / 2 + 2, tileHeight / 2 + 9)
            construct.lineTo(3, 9)
        }
        if(p_right){

            construct.moveTo(2, tileHeight + 9)
            construct.lineTo(-tileWidth / 2 + 2, tileHeight / 2 + 9)
        }
        if(p_bottom){

            construct.moveTo(tileWidth / 2 + 2, tileHeight / 2 + 9)
            construct.lineTo(2, tileHeight + 9)

        }
        if(p_left){
            
            construct.moveTo(2, 9)
            construct.lineTo(tileWidth / 2 + 2, tileHeight / 2 + 9)
        }

        return construct
    }

    let detector = new Path2D()
        detector.moveTo(2, 9)
        detector.lineTo(tileWidth / 2 + 2, tileHeight / 2 + 9)
        detector.lineTo(2, tileHeight + 9)
        detector.lineTo(-tileWidth / 2 + 2, tileHeight / 2 + 9)
        detector.lineTo(3, 9)

    //отрисовка тайлов-картинок и одного квадрата вокруг тайл-картинки
    function drawImageTile({ x, y, type, active, top, right, bottom, left }) {

        const xx = (x - y) * tileWidth / 2
        const yy = (x + y) * tileHeight / 2

        ctx.save();
        ctx.translate(xx, yy)


        ctx.drawImage(img, type * tileWidth, 0, tileWidth, img.height,
        	-tileWidth / 2, 0, tileWidth, img.height);

        if (active) ctx.strokeStyle = 'red'
            else ctx.strokeStyle = '#ffffff00'


        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.stroke(flag(top, right, bottom, left));
        ctx.closePath()
        ctx.restore();

    }




    canvas.addEventListener('mousemove', (e)=>{

            let tile,
                isInPath = false

            for (tile of tiles) {

                isInPath = ctx.isPointInPath(
                    detector,
                    e.clientX - (tile.x - tile.y) * tileWidth / 2,
                    e.clientY - (tile.x + tile.y) * tileHeight / 2,

                )
                
                if (isInPath) break;
            }
            

            if (isInPath) {

                activeTile = tile;
                activeTile.active = true;

                //отчистка при смене одного типа тайлов на другой курсором
                tiles.map(elem => elem.active = false)

            }else{
                activeTile = null;

                //отчистка при уходе курсора из области самой карты
                tiles.map(elem => elem.active = false)

            }

            //система захвата курсором карты для масштабирования
            if(activeScale.status){

                ctx.setTransform(1, 0, 0, 1, e.clientX - activeScale.diffX, e.clientY - activeScale.diffY)

            }
        

    })
    //фиксируем расстояние курсора на холсте для правильного ведения карты
    canvas.addEventListener('mousedown', function(e){

        activeScale = {

            status: true,
            diffX: e.clientX - ctx.getTransform().e,
            diffY: e.clientY - ctx.getTransform().f
        }

    })

    canvas.addEventListener('mouseup', function(e){

        activeScale.status = false

    })

    canvas.addEventListener('mouseout', function(e) {

        if (activeTile) activeTile.active = false;
        
        activeTile = null;
        activeScale.status = false
    })

    canvas.addEventListener('click', async function(e){


        const data = await new sendFetch(activeTile, 'currtile', 'POST')
    

    })
    

}