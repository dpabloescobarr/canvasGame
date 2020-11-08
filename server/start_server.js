const http = require('http');
const fs = require('fs');




http.createServer((req, res) => {

	res.writeHead(200, { 
		'Access-Control-Allow-Origin': '*', 
		'Access-Control-Allow-Headers': 'Origin,Content-Type,Accept,X-Requested-With',
		// 'Access-Control-Max-Age': '50',
		// 'Content-Type': 'X-Requested-With',
		'Content-Type': 'application/x-www-form-urlencoded'
	});

	function openMap(mode, elem = ''){

		if(elem != 'null' && elem != ''){
		
			elem = JSON.parse(elem)

		}else if(elem == 'null'){

			mode = false

		}

		this.map  = __dirname.replace('\server', '')+'map.json'
		this.file = fs.readFileSync(this.map, 'utf8', function (err, data) {

			if (err) throw err;

			return data

		});

		switch (mode){

			case 'open':
				return this.file

			case 'change':

				this.file     = JSON.parse(this.file)
				this.findTile = this.file[elem.x][elem.y]

				//проверка на существование типа тайла из запроса с основной картой
				if(this.findTile == elem.index) return 'true'
					else return 'false'

			default:
				return 'false'
		}
	}


	if (req.method == 'POST') {
		
		let body = ''
		
		req.on('data', chunk => {
			body += chunk.toString()
		})
		
		req.on('end', () => {

			this.findTile = openMap('change', body)

			res.end(this.findTile)
		
			
		})

	}else if (req.method == 'GET'){

		
		switch(req.url){

			case '/getmap':
				res.end(openMap('open'));
		}


	}


}).listen(3000)


