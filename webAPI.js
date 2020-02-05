var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser')
var Jimp = require('jimp');
var app2 = express();
var PORT = 8082;

/**
 * 이미지를 생성하는 함수
 * 색상값으로 구성 된 배열을 파라미터로 받습니다.
 * @param {*} width 
 * @param {*} height 
 * @param {*} colorList 
 * @param {*} targetDir 
 * @param {*} extType 
 */
var generateImages = function(width, height, colorList, targetDir, extType) {
	colorList.map(function(bgColor, index) {
		var image = new Jimp(width, height, bgColor, function(err, image) {
			if (err) throw err
	
			image.writeAsync(`${targetDir}/${bgColor}.${extType}`)
				.then(function(data, image) {
					console.log('file: ',image );
				})
		});
	});
}

app2.use(bodyParser.json())

var getImageMimeType = function(val) {
	switch(val) {
		case 'png':
			return 'image/png';
		case 'jpg':
			return 'image/jpeg';
		case 'gif':
			return 'image/gif';
	}
};

app2.get('/test', function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
	res.end('{"testcode":"200", "text":"Electorn Test~"}');
 });

app2.post('/generate', async function (req, res) {
	var mimeType = getImageMimeType(req.body.ext_type);
	res.setHeader('Content-Type', mimeType);

	var extType = req.body.ext_type;
	var width = req.body.width
	var height = req.body.is_square ? req.body.width : req.body.height
	var bgColor = '#' + req.body.bg_color
	var dirName = path.join(__dirname, '/public/images/')
	var newDirName = Date.now();

	if (!fs.existsSync(`${dirName}${newDirName}`)){
		fs.mkdirSync(`${dirName}${newDirName}`);
	}
	
	// console.log(image);

	console.log(typeof bgColor);
	var result = await generateImages(width, height, bgColor, `${dirName}${newDirName}`, extType);

	res.send(200, 'success');
	
});

app2.listen(PORT, function () {
	console.log('test : http://127.0.0.1:' + PORT + '/');
});