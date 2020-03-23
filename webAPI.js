const express     = require('express');
const fs           = require('fs');
const bodyParser   = require('body-parser')
const Jimp         = require('jimp');
const app2         = express();
const router      = express.Router();
const PORT         = 8082;

/**
 * 이미지를 생성하는 함수
 * 색상값으로 구성 된 배열을 파라미터로 받습니다.
 * @param {*} width 
 * @param {*} height 
 * @param {*} bgColorList 
 * @param {*} dirPath 
 * @param {*} extType 
 */
const generateImages = async ({
  width,
  height,
  bgColorList,
  extType,
  dirPath
}) => {

  const result = await Promise.all(
    bgColorList.map(async (bgColor, index) => {
      const image = new Jimp(width, height, bgColor)
      const resutlGen = await image.writeAsync(`${dirPath}/${bgColor}.${extType}`);
      return resutlGen;
    })   
  )
}

const getImageMimeType = val => {
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
app2.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
})

router.post('/generate', (req, res) => {
  // const mimeType = getImageMimeType(req.body.ext_type);
  const extType = req.body.ext_type;
  const width = req.body.width
  const height = req.body.is_square ? req.body.width : req.body.height
  const bgColor = req.body.bg_color
  const newDirName = Date.now();

  res.setHeader('Content-Type', 'application/json');

  if (!fs.existsSync(`${process.env.TARGET_DIR}`)){
    fs.mkdirSync(`${process.env.TARGET_DIR}`);
  }

  if (!fs.existsSync(`${process.env.TARGET_DIR}${newDirName}`)){
    fs.mkdirSync(`${process.env.TARGET_DIR}${newDirName}`);
  }
  
  const result = generateImages({
    width,
    height,
    extType,
    bgColorList: bgColor,
    dirPath: `${process.env.TARGET_DIR}${newDirName}`
  });

  result.then(result => {
    res.status(200).send({
      data: 'success'
    })  
  })
  .catch(err => {
    res.status(500).send({
      data: 'fail'
    })
  })
});

app2.listen(PORT, () => {
  console.log('test : http://127.0.0.1:' + PORT + '/');
});