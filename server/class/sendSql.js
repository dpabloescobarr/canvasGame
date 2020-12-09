// const { timeStamp } = require("console");

const fs = require('fs');
const { resolve } = require('path');

module.exports = class sendSql{

	constructor(mode, elem){
		
		//очистка от кавычек так как данные в json
		this.elem  = elem
		this.mode  = mode
		this.mysql = require("mysql2")
		  
		this.connection = this.mysql.createConnection({
		  host: "server212.hosting.reg.ru",
		  user: "u0511543",
		  database: "u0511543_default",
		  password: "2Rhw_ibv"
		});

		this.connection.connect(function(err){

			if (err) {

			  console.error("Ошибка: " + err.message);

			}else{

				switch(mode){

					case 'getimg':
						console.log('Получение картинок')
						break
					
					case 'getsql':
						console.log('Обновление кэша регионов')
						break

				}
			 
			}

		});

	}
	updateTiles(){

		if(typeof this.elem == 'string' && this.elem.length > 45){

			let elem = JSON.parse(this.elem)

			elem.map(item => {

				if(typeof item.region == 'string' && typeof item.tileset == 'number'){

					this.sql = "UPDATE commercial_card SET tileset = "+item.tileset+", type = "+item.type+" WHERE x = "+item.x+" AND y = "+item.y+"";
					this.connection.query(this.sql)
				}
			})
			console.log(`Обновление тайлов. Кол-во: ${elem.length}, посл. элемент: x_${elem[elem.length-1].x}, y_${elem[elem.length-1].y}`)

		}else{
			console.log('Ошибка типа данных!')
		}
	}
	//получение тайлсетов в зашифрованном виде json текста
	getImgSets(){

		const dir = './server/models'

		let getFiles = new Promise(resolve =>{

			fs.readdir(dir, (err, files) => {
				resolve(files)
			})
		})

		async function toReadFile(file_name){

			return await new Promise(resolve => {

				fs.readFile(`${dir}/${file_name}`, function (err, data) {   

					if (err) throw err

					const base64 = Buffer.from(data).toString('base64');

					resolve(base64)
					
				})
			})
		}

		async function waitFiles(){

			const files = await getFiles
			let images = [],
				oneImg

			for(let file of files){

				oneImg = await toReadFile(file)
				images.push(oneImg)
			}

			return images

		}

		return waitFiles()

	}
	//метод подготовки кэширования
	getRegionSql(){
		
		return new Promise(resolve => {

			let elem = this.elem.replace(/\"/g, '')

			this.sql = "SELECT type, tileset, region, y, x FROM commercial_card WHERE region IN ?";

			this.values = nearesTile(elem, 'cache')

			this.connection.query(this.sql, [[this.values]], function (err, result) {

				//формируем карту
				this.main = []
				this.array = []
				this.pureReg = []
					
				let resultX, 
					resultY,
					trigersRegions

				for(let i = 0; result.length > i; i++){

					resultX = result[i].x,
					resultY = result[i].y

					this.strReg = String(result[i].region)

					if(!this.array[resultX]) this.array[resultX] = []

					trigersRegions = nearesTile(elem, 'trigers')
					

					this.array[resultX][resultY] = {

						type:    result[i].type,
						tileset: result[i].tileset,
						region:  result[i].region,
						x:       resultX,
						y:       resultY,
						triger:  (trigersRegions.find(item => item == this.strReg)) ? true : false

						}
				}

				//фильтруем сначала изнутри потом наружний массив
				this.array.map((elem, index) =>{

					if(elem != null && elem != undefined){

						this.pureReg[index] = elem.filter(x => x != null && x != undefined)
					}
				})
				this.pureReg = this.pureReg.filter(x => x != null && x != undefined)


				resolve(this.pureReg)
				
			});
		})

		function nearesTile(elem, mode){

			let coords  = elem.split('.'),
				y       = Number(coords[0]),
				x       = Number(coords[1]),
				regions

			switch(mode){
				
				//регионы для кэширования
				case 'cache':
					regions = [

						`${y-5}.${x-5}`, `${y-5}.${x-4}`, `${y-5}.${x-3}`, `${y-5}.${x-2}`, `${y-5}.${x-1}`,      `${y-5}.${x}`,     `${y-5}.${x+1}`,`${y-5}.${x+2}`, `${y-5}.${x+3}`, `${y-5}.${x+4}`, `${y-5}.${x+5}`,
						`${y-4}.${x-5}`, `${y-4}.${x-4}`, `${y-4}.${x-3}`, `${y-4}.${x-2}`, `${y-4}.${x-1}`,      `${y-4}.${x}`,     `${y-4}.${x+1}`,`${y-4}.${x+2}`, `${y-4}.${x+3}`, `${y-4}.${x+4}`, `${y-4}.${x+5}`,
						`${y-3}.${x-5}`, `${y-3}.${x-4}`, `${y-3}.${x-3}`, `${y-3}.${x-2}`, `${y-3}.${x-1}`,      `${y-3}.${x}`,     `${y-3}.${x+1}`,`${y-3}.${x+2}`, `${y-3}.${x+3}`, `${y-3}.${x+4}`, `${y-3}.${x+5}`,
						`${y-2}.${x-5}`, `${y-2}.${x-4}`, `${y-2}.${x-3}`, `${y-2}.${x-2}`, `${y-2}.${x-1}`,      `${y-2}.${x}`,     `${y-2}.${x+1}`,`${y-2}.${x+2}`, `${y-2}.${x+3}`, `${y-2}.${x+4}`, `${y-2}.${x+5}`,
						`${y-1}.${x-5}`, `${y-1}.${x-4}`, `${y-1}.${x-3}`, `${y-1}.${x-2}`, `${y-1}.${x-1}`,      `${y-1}.${x}`,     `${y-1}.${x+1}`,`${y-1}.${x+2}`, `${y-1}.${x+3}`, `${y-1}.${x+4}`, `${y-1}.${x+5}`,
			
						`${y}.${x-5}`, `${y}.${x-4}`,    `${y}.${x-3}`,    `${y}.${x-2}`,   `${y}.${x-1}`,        `${y}.${x}`,       `${y}.${x+1}`,   `${y}.${x+2}`,     `${y}.${x+3}`, `${y}.${x+4}`,   `${y}.${x+5}`,
						
						`${y+1}.${x-5}`, `${y+1}.${x-4}`, `${y+1}.${x-3}`, `${y+1}.${x-2}`, `${y+1}.${x-1}`,      `${y+1}.${x}`,      `${y+1}.${x+1}`,`${y+1}.${x+2}`, `${y+1}.${x+3}`, `${y+1}.${x+4}`, `${y+1}.${x+5}`,
						`${y+2}.${x-5}`, `${y+2}.${x-4}`, `${y+2}.${x-3}`, `${y+2}.${x-2}`, `${y+2}.${x-1}`,      `${y+2}.${x}`,      `${y+2}.${x+1}`,`${y+2}.${x+2}`, `${y+2}.${x+3}`, `${y+2}.${x+4}`, `${y+2}.${x+5}`,
						`${y+3}.${x-5}`, `${y+3}.${x-4}`, `${y+3}.${x-3}`, `${y+3}.${x-2}`, `${y+3}.${x-1}`,      `${y+3}.${x}`,      `${y+3}.${x+1}`,`${y+3}.${x+2}`, `${y+3}.${x+3}`, `${y+3}.${x+4}`, `${y+3}.${x+5}`,
						`${y+4}.${x-5}`, `${y+4}.${x-4}`, `${y+4}.${x-3}`, `${y+4}.${x-2}`, `${y+4}.${x-1}`,      `${y+4}.${x}`,      `${y+4}.${x+1}`,`${y+4}.${x+2}`, `${y+4}.${x+3}`, `${y+4}.${x+4}`, `${y+4}.${x+5}`,
						`${y+5}.${x-5}`, `${y+5}.${x-4}`, `${y+5}.${x-3}`, `${y+5}.${x-2}`, `${y+5}.${x-1}`,      `${y+5}.${x}`,      `${y+5}.${x+1}`,`${y+5}.${x+2}`, `${y+5}.${x+3}`, `${y+5}.${x+4}`, `${y+5}.${x+5}`
					]
					break

				//тригеры регионов для обновления кэша в дальнейшем
				case 'trigers':
					regions = [

                        `${y-4}.${x-4}`, `${y-4}.${x-3}`, `${y-4}.${x-2}`, `${y-4}.${x-1}`,`${y-4}.${x}`,`${y-4}.${x+1}`,`${y-4}.${x+2}`, `${y-4}.${x+3}`, `${y-4}.${x+4}`,
                        `${y-3}.${x+4}`,`${y-2}.${x+4}`,`${y-1}.${x+4}`,`${y}.${x+4}`,`${y+1}.${x+4}`,`${y+2}.${x+4}`,`${y+3}.${x+4}`,
                        `${y+4}.${x-4}`, `${y+4}.${x-3}`, `${y+4}.${x-2}`, `${y+4}.${x-1}`,`${y+4}.${x}`,`${y+4}.${x+1}`,`${y+4}.${x+2}`, `${y+4}.${x+3}`, `${y+4}.${x+4}`,
                        `${y-3}.${x-4}`,`${y-2}.${x-4}`,`${y-1}.${x-4}`,`${y}.${x-4}`,`${y+1}.${x-4}`,`${y+2}.${x-4}`,`${y+3}.${x-4}`
                        
					]
					break
			}
			regions = regions.filter(x => !/-/g.test(x))

			return regions

		}


	}

	//метод генерации областей карты по координатам
	generateMap(){

		//1 регион 15*15 тайлов

		const getRandomInt = require('./getRandomInt.js')
		
		this.sql = "TRUNCATE TABLE  commercial_card;";

		this.connection.query(this.sql, function (err, result) {


		});

		
		let square = {
// 40 1600
				owner:    1,
				fromX:    0,
				fromY:   0,
				beforeX: 480,
				beforeY: 480,
				side:    30
			}

		square.quantityX = (square.beforeX - square.fromX) / square.side
		square.quantityY = (square.beforeY - square.fromY) / square.side

		square.counter = square.quantityX * square.quantityY

		let x = square.fromX,
			y = square.fromY
		
	
		for(let i = 0; i < square.counter; i++){

			this.randomInt = new getRandomInt(4,15).result
			square.region = String(`${y/square.side}.${x/square.side}`)

			makeRegion.call(this, this.randomInt, square.region, x, y, 1)

			
			if(square.beforeX - x > square.side && square.beforeY - y == square.side){

				x += square.side
				y = square.fromY

			}else if(square.beforeY - y > square.side){

				y += square.side
		
			}

			// break
		}


		function makeRegion(type, region, startX, y, owner){
			
			for(let i = 0; 900 > i; i++, x++){

				type = new getRandomInt(4,15).result

				this.sql = "INSERT INTO commercial_card(type,x,y, region, owner) VALUES ?";
				this.values = [
							[type,x,y,region,owner]
						];

				this.connection.query(this.sql, [this.values]);

				if(x == startX + square.side - 1){

					y++
					x = startX -1

				}


			}
		

		}






	}


}