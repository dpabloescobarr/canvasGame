const http      = require('http'),
	  fs        = require('fs'),
	  {Console} = require('console'),
	  sendSql   = require('./class/sendSql.js'),
	  {send}    = require('process')


	//   let ss = new sendSql('POST', 'sdas')
	//   	 ss.generateMap()

http.createServer((req, res) => {

	res.writeHead(200, { 
		'Access-Control-Allow-Origin': '*', 
		'Access-Control-Allow-Headers': 'Origin,Content-Type,Accept,X-Requested-With',
		// 'Access-Control-Max-Age': '50',
		// 'Content-Type': 'X-Requested-With',
		'Content-Type': 'application/x-www-form-urlencoded'
	});

	async function openMap(mode, elem = ''){

		const send = new sendSql(mode, elem)

		if(mode == 'getsql'){

			this.data = await send.getRegionSql()
			return JSON.stringify(this.data)

		}else if(mode == 'getimg'){
			
			this.data = await send.getImgSets()
			return JSON.stringify(this.data)

		}else if(mode == 'update_tiles'){

			this.data = await send.updateTiles()
			return JSON.stringify('Данные отправлены!')
		}


	
	}

	(async () => {

		if (req.method == 'POST') {
			
			let body = ''
			

			req.on('data', chunk => {
				body += chunk.toString()
			})


			if(req.url == '/getsql'){


				req.on('end', async() => {

					this.findTile = await openMap('getsql', body)
					res.end(this.findTile)
				})

			}else if(req.url == '/update_tiles'){

				req.on('end', async() => {

					this.findTile = await openMap('update_tiles', body)
					res.end(this.findTile)
				})

			}
			// else if(req.url == '/getcache'){


			// 	req.on('end', async() => {

			// 		this.findTile = await openMap('getcache', body)
			// 		res.end(this.findTile)
			// 	})

			// }
		}
		else if (req.method == 'GET'){
			// res.setHeader("Content-Type", "image/png");

			switch(req.url){

				case '/getimg':
					res.end(await openMap('getimg'))
			}


		}
	})()


}).listen(3000)