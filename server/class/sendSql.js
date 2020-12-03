const { timeStamp } = require("console");
const { resolve } = require("path");
const { inherits } = require("util");

module.exports = class sendSql{

	constructor(mode, elem){

		//очистка от кавычек так как данные в json
		this.elem  = elem.replace(/\"/g, '')
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
			  console.log("Подключение к серверу MySQL успешно установлено");
			}

		});

	}
	//метод получения регионов

	// getRegionCache(){

	// 	this.values = nearesTile(this.elem)


			


	// 	function nearesTile(elem){

	// 		let coords  = elem.split('.'),
	// 			y       = Number(coords[0]),
	// 			x       = Number(coords[1]),

	// 			regions = [
	// 				`${y-1}.${x-1}`, `${y-1}.${x}`, `${y-1}.${x+1}`, `${y}.${x-1}`, `${y}.${x}`, `${y}.${x+1}`, `${y+1}.${x-1}`,`${y+1}.${x}`, `${y+1}.${x+1}`
	// 			]

	// 		regions = regions.filter(x => !/-/g.test(x))

	// 		return [regions]

	// 	}


	// }

	getRegionSql(){

		return new Promise(resolve => {


			this.sql = "SELECT type, region, y, x FROM commercial_card WHERE region IN ?";

			this.values = nearesTile(this.elem, 'cache')

			this.connection.query(this.sql, [[this.values]], function (err, result) {

				//формируем карту
				this.main = []
				this.array = []
				this.pureReg = []

				for(let i = 0; result.length > i; i++){

					this.x      = result[i].x
					this.y      = result[i].y
					this.strReg = String(result[i].region)

					if(!this.array[this.x]) this.array[this.x] = []

					this.array[this.x][this.y] = {

						type:   result[i].type,
						region: result[i].region,
						x:      this.x,
						y:      this.y

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

		function nearesTile(elem){

			let coords  = elem.split('.'),
				y       = Number(coords[0]),
				x       = Number(coords[1]),

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
                // regions = [
				// 	`${y-1}.${x-1}`, `${y-1}.${x}`, `${y-1}.${x+1}`, `${y}.${x-1}`, `${y}.${x}`, `${y}.${x+1}`, `${y+1}.${x-1}`,`${y+1}.${x}`, `${y+1}.${x+1}`
				// ]
				
			regions = regions.filter(x => !/-/g.test(x))

			return regions

		}


	}

	updateTile(){

		// function getRandomIntInclusive(min, max) {
		// 	min = Math.ceil(min);
		// 	max = Math.floor(max);
		// 	return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
			
		//   }
 

		// for(let i = 0, t = 1, v, x = 0, y = 0; 25*25 > i; i++, x++){


		// 	v = getRandomIntInclusive(0,5)
			
		// 	this.sql = "INSERT INTO commercial_card(type,x,y, region, owner) VALUES ?";
		// 	this.values = [
		// 				[v,x,y,t,t]
		// 			];

		// 	this.connection.query(this.sql, [this.values], function (err, result) {

		// 		if (err) throw err;
		// 		console.log( result.affectedRows);
		// 	});


		// 	if(x == 24){

		// 		x = -1
		// 		y++

		// 	}

		// 	if(25*25 - 1 == i && t < 6) {

		// 		i = 0
		// 		t++
			
		// 	}

		// }
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