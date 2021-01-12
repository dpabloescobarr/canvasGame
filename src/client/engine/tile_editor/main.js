window.addEventListener('load', () => {

    let canvas       = document.getElementById("canvas"),
        ctx          = canvas.getContext("2d"),
        width        = canvas.width = 800,
        height       = canvas.height = 98,
        tileWidth    = 60,
        tilesUpdate,
        map = [],
        placeImg = document.getElementById('images'),
        oneTileSet
    

    oneTileSet     = document.createElement("img")
    oneTileSet.src = 'models/0.png'

    oneTileSet.addEventListener('click', function(){

        let height =  98,
            width  =  60,
            scale  = {

                beginX: 60,
                beginY: 10,
                leftR:   3,
                rightL:  3
            },
            noDraw = []
        
        this.size = DrawImage(this, scale, height, width)


        croopingImage(this.size, scale, height, width)
    })


    placeImg.appendChild(oneTileSet)


    function DrawImage(img, scale, height, width){

        ctx.clearRect(-100, -100, 300, 300)

        let size = { 
                
                beginX: scale.beginX,
                beginY: scale.beginY,
                leftR:  scale.leftR,
                rightL: scale.rightL
            },

            afterX  = scale.beginX,
            afterY  = scale.beginY,
            offsetX = 0
            

        for(let l = 1, r = 1; scale.rightL >= r; l++){

            ctx.drawImage(img, afterX - 10, afterY, width, height,
                offsetX, 0, width, height);   

            // let step = (((offsetX / 60) * width) - 30) + width,
            //     fit  = 3

            // let neckline = new Path2D()
            //     neckline.moveTo(step, 50)
            //     neckline.lineTo(step - (width / 2), 65)
            //     neckline.lineTo(step, height)
            //     neckline.lineTo(step + width / 2, 65)
            //     neckline.lineTo(step, 50)
                

            // ctx.beginPath()
            // ctx.lineWidth = 1
            // ctx.strokeStyle = 'black'
            // ctx.stroke(neckline)
            // ctx.closePath()


            if(scale.leftR == l){

                scale.beginX -= 30
                scale.beginY += 15

                afterX = scale.beginX
                afterY = scale.beginY

                l = 0
                r++

            }else{

                afterX += 30
                afterY += 15
            }
            
            offsetX += width
        }
        // drawImage(корды откуда на имг,  )

        // let construct = new Path2D()

        //     construct.moveTo(0,0)
        //     construct.lineTo(10,10)

            
        //     ctx.beginPath()
        //     ctx.lineWidth = 3
        //     ctx.stroke(construct);
        //     ctx.closePath()

        return size
    }
    
    function croopingImage(size, scale, height, width){

        console.log(size)

    }

})
