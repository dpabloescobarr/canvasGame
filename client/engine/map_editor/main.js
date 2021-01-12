function mapEditor(tiles, updateClear, edit_mode) {

    let canvasMenu   = document.getElementById("service_panel"),
        ctxMenu      = canvasMenu.getContext("2d"),
        width        = canvasMenu.width = 1000,
        height       = canvasMenu.height = 500,
        tileWidth    = 60,
        butt_update  = document.getElementById('butt_update'),
        butt_clear   = document.getElementById('butt_clear'),
        butt_on_off  = document.getElementById('butt_on_off'),
        activeTile   = document.getElementById('info_text'),
        tilesUpdate,
        map = []
        
    
    let canvasInfo   = document.getElementById('info'),
        ctxInfo      = canvasInfo.getContext("2d")

        canvasInfo.width = 403
        canvasInfo.height = 200

    setInterval(init, 400)
    drawAllTilesets(tiles)

    function init(){

        if(edit_mode()){

            tilesUpdate = localStorage.getItem('group_update_tiles')

                tilesUpdate           = JSON.parse(tilesUpdate)
                butt_update.innerText = `Обновить ${tilesUpdate.length} тайлов`
                butt_clear.innerText  = `Очистить список изменений`

                butt_update.addEventListener('click', buttonAction)
                butt_clear.addEventListener('click', buttonAction)

        }else if(butt_update.innerText){

            butt_update.innerText = ''
            butt_clear.innerText  = ''
            activeTile.innerText = ''
            activeTile.setAttribute('short_id', '')

            ctxInfo.clearRect(-100, -100, 400, 400)

            butt_update.removeEventListener('click', buttonAction)
            butt_clear.removeEventListener('click', buttonAction)
        }

        butt_on_off.addEventListener('click', buttonAction)
    }

    function buttonAction(){

        if(this.id == 'butt_update'){

            if(tilesUpdate.length){

                new sendFetch(tilesUpdate, 'update_tiles', 'POST')
                localStorage.setItem('group_update_tiles', '[]')

                console.log('Обновления карты отправлены!')

            }else{
                console.log('Нет измененных тайлов!')
            }
        }else if(this.id == 'butt_clear'){

            localStorage.setItem('group_update_tiles', '[]')
            updateClear('set', 'clear')

            console.log('Список изменений тайлов очищен!')
            
        }else if(this.id == 'butt_on_off'){

            if( butt_on_off.innerText == 'Enable') butt_on_off.innerText = 'Disable'
                else butt_on_off.innerText = 'Enable'

        }

    }

    function drawAllTilesets(tiles){
    
    
        for(let i = 0, diffHeight = 0; i < tiles.length; i++){


            for(let w = 0; w < tiles[i].width; w += tileWidth){

                if((tiles[i].width - w ) < tileWidth) break

                ctxMenu.drawImage
                            (
                                tiles[i], 
                                0, 
                                0, 
                                w + tileWidth, 
                                tiles[i].height,
                                0, 
                                diffHeight, 
                                w + tileWidth, 
                                tiles[i].height
                            );

                map.push
                        ({ 
                            tileset: i, 
                            type: w / tileWidth, 
                            imgHeight: tiles[i].height, 
                            lineWidth: w, 
                            lineHeight: diffHeight
                        })

                ctxMenu.strokeStyle = 'red'
                ctxMenu.lineWidth = 3
                ctxMenu.save();
                ctxMenu.beginPath()

                ctxMenu.stroke(smartStroke(w + tileWidth, tiles[i].height, w, diffHeight))

                ctxMenu.closePath()
                ctxMenu.restore();
            }

            diffHeight += tiles[i].height

        }
        canvasMenu.addEventListener('click', function(e){

            let tile,
                isInPath = false

            for (tile of map) {
                
                isInPath = ctxMenu.isPointInPath(

                    smartStroke 
                            (
                                tileWidth, 
                                tile.imgHeight, 
                                tile.lineWidth, 
                                tile.lineHeight
                            ),
                    e.offsetX,
                    e.offsetY,

                )
                if (isInPath) break;

            }
            
            if(isInPath){

                ctxInfo.clearRect(-100, -100, 400, 400)

                ctxInfo.drawImage
                (
                    tiles[tile.tileset], 
                    tile.lineWidth, 
                    0, 
                    tileWidth, 
                    tiles[tile.tileset].height,
                    canvasInfo.width / 2 - tileWidth / 2,
                    canvasInfo.height / 2 - tiles[tile.tileset].height,
                    tileWidth, 
                    tiles[tile.tileset].height
                );

                activeTile.setAttribute('short_id', `${tile.type} ${tile.tileset}`)
                activeTile.innerText = `Тип: ${tile.type}, сет: ${tile.tileset}`
                
            }else{
                isInPath = null
            }
            
        })

    }

    function smartStroke(tileWidth, tileHeight, lineWidth, lineHeight){

        let construct = new Path2D()

            construct.moveTo(lineWidth, lineHeight)
            construct.lineTo(tileWidth + lineWidth, lineHeight)
            construct.lineTo(tileWidth + lineWidth, tileHeight + lineHeight)
            construct.lineTo(lineWidth, tileHeight + lineHeight)
            construct.lineTo(lineWidth, lineHeight)

        return construct
    }

}