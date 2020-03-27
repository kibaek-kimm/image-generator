const express      = require('express');
const fs           = require('fs');
const path         = require('path');
const bodyParser   = require('body-parser')
const Jimp         = require('jimp');
const formidable   = require('formidable');
const archiver     = require('archiver');
const xlsx         = require('xlsx');
const app2         = express();
const router       = express.Router();
const PORT         = 8082;

let imgMetadata = {};

/**
 * 이미지를 생성하는 함수
 * 색상값으로 구성 된 배열을 파라미터로 받습니다.
 * @param {*} width 
 * @param {*} height 
 * @param {*} ext 
 * @param {*} colorList 
 * @param {*} uploadDir 
 */
const generateImages = async ({
  width,
  height,
  ext,
  colorList,
  uploadDir
}) => {  
  const result = await Promise.all(
    colorList.map(async (bgColor, index) => {
      const image = new Jimp(width, height, bgColor);
      const resutlGen = await image.writeAsync(`${uploadDir}/${bgColor}.${ext}`);
      // console.log(resutlGen);
      return resutlGen;
    })   
  )

  if (result) {
    return true;
  } else {
    return false;
  }
};

const validateHexColor = hexColor => {
  if (!hexColor || typeof hexColor !== 'string') {
    return false;
  }

  const color = hexColor.replace("#", "");
  const result = color.match(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

  return !!result;
};

const convertSheetDataToArray = sheetData => {
  const resultArray = [];
  const sheetRows = Object.keys(sheetData);

  for (let i in sheetRows) {
    const key = sheetRows[i];
    if (!key.match(/^[A-Z]([0-9]{1,3})$/)) {
      continue;
    }

    const value = sheetData[key].v;

    if (validateHexColor(value)) {
      resultArray.push(value);
    } else {
      return `${key}시트에 위차한 숫자값이 유효하지 않습니다.`;
    }
  }

  return resultArray.length > 0 ? resultArray : null;
};

const zippedDirectory = (dirPath, zipName = 'target') => {
  const output = fs.createWriteStream(`${process.env.TARGET_DIR}${zipName}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.pipe(output);
  archive.directory(`${process.env.TARGET_DIR}${zipName}`, false);

  archive.on('error', (err) => {
    throw err;
  });

  archive.finalize();
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

const createImage = ({width, height, ext, data, uploadDir}) => {

};

app2.use(bodyParser.json())
app2.use('/api/v1', router)
app2.use((req, res, next) => {
  next();
})

router.post('/generate', (req, res) => {
  const newDirName = Date.now();

  if (!fs.existsSync(`${process.env.TARGET_DIR}`)){
    fs.mkdirSync(`${process.env.TARGET_DIR}`);
  }

  const form = formidable({ 
    multiples: true,
    keepExtension: true,
    uploadDir: path.resolve(__dirname, 'uploads')
   });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log('error!!!', err);
      res.status(500).send({
        status: 'fail',
        message: '엑셀파일을 로드하는데 실패했습니다.',
      })  
      return;
    }
    const {width, height, ext} = imgMetadata;
    const file = files.xlsx_file;
    const newPath = `${file.path}.xlsx`;
    const renameResult = fs.renameSync(file.path, newPath);

    if (!fs.existsSync(newPath)){
      res.status(500).send({
        status: 'fail',
        message: '엑셀파일을 로드하는데 실패했습니다.',
      })  
      return false;
    }

    const sheetData = xlsx.readFile(newPath);
    const colorSheet = sheetData.Sheets.Sheet1;
    const colorList = convertSheetDataToArray(colorSheet);

    if (!Array.isArray(colorList)) {
      res.status(500).send({
        status: 'fail',
        message: colorList,
      })  
      return false;
    }

    if (!fs.existsSync(`${process.env.TARGET_DIR}${newDirName}`)){
      fs.mkdirSync(`${process.env.TARGET_DIR}${newDirName}`);
    }

    const genResult = generateImages({
      width,
      height,
      ext,
      colorList,
      uploadDir: `${process.env.TARGET_DIR}${newDirName}`,
    });

    if (genResult) {
      const output = fs.createWriteStream(`${process.env.TARGET_DIR}${newDirName}.zip`);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });

      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');

        res.status(200).send({
          link: `${process.env.TARGET_DIR}${newDirName}.zip`
        })
      });

      archive.pipe(output);
      archive.directory(`${process.env.TARGET_DIR}${newDirName}`, false);

      archive.on('error', (err) => {
        res.status(500).send({
          status: 'fail',
          message: '이미지 압축 과정에서 실패했습니다.'
        });
        throw err;
      });

      archive.finalize();
    } else {
      res.status(500).send({
        status: 'fail',
        message: '이미지 생성에 실패했습니다.'
      });
    }

  });
});

router.post('/metadata', (req, res) => {
  imgMetadata.width = req.body.width;
  imgMetadata.height = req.body.width;
  imgMetadata.ext = req.body.ext;
  imgMetadata.mimeType = req.body.ext;

  res.status(200).send();
});

app2.listen(PORT, () => {
  console.log('test : http://127.0.0.1:' + PORT + '/');
});