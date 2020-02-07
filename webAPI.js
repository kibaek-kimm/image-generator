const express 		= require('express');
const fs 					= require('fs');
const bodyParser 	= require('body-parser')
const Jimp 				= require('jimp');
const app2 				= express();
const router			= express.Router();
const PORT 				= 8082;

/**
 * 이미지를 생성하는 함수
 * 색상값으로 구성 된 배열을 파라미터로 받습니다.
 * @param {*} width 
 * @param {*} height 
 * @param {*} bgColorList 
 * @param {*} dirPath 
 * @param {*} extType 
 */
var generateImages = function({
	width,
	height,
	bgColorList,
	extType,
	dirPath
}) {

	bgColorList.map(function(bgColor, index) {
		new Jimp(width, height, bgColor, function(err, image) {
			if (err) throw err
	
			image.writeAsync(`${dirPath}/${bgColor}.${extType}`)
				.catch(err => {
					console.error('[Jimp ERROR] \n', err);
				})
		});
	});
}

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

app2.use(bodyParser.json())
app2.use('/api/v1', router)
app2.use(function timeLog(req, res, next) {
	console.log('Time: ', Date.now());
	next();
})

router.post('/generate', async function (req, res) {
	// var mimeType = getImageMimeType(req.body.ext_type);
	var extType = req.body.ext_type;
	var width = req.body.width
	var height = req.body.is_square ? req.body.width : req.body.height
	var bgColor = req.body.bg_color
	var newDirName = Date.now();

	res.setHeader('Content-Type', 'application/json');

	if (!fs.existsSync(`${process.env.TARGET_DIR}`)){
		fs.mkdirSync(`${process.env.TARGET_DIR}`);
	}

	if (!fs.existsSync(`${process.env.TARGET_DIR}${newDirName}`)){
		fs.mkdirSync(`${process.env.TARGET_DIR}${newDirName}`);
	}
	
	var result = await generateImages({
		width,
		height,
		extType,
		bgColorList: bgColor,
		dirPath: `${process.env.TARGET_DIR}${newDirName}`
	});

	res.status(200).send('success');
});

app2.listen(PORT, function () {
	console.log('test : http://127.0.0.1:' + PORT + '/');
});