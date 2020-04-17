import xlsx from 'xlsx';
import Jimp from 'jimp';

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
  width = 100,
  height = 100,
  ext = 'png',
  colorList = [],
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

/**
 * hex형태의 유효한 색상값 체크
 * @param hexColor 
 */
export const validateHexColor = hexColor => {
  if (!hexColor || typeof hexColor !== 'string') {
    return false;
  }

  const color = hexColor.replace("#", "");
  const result = color.match(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

  return !!result;
};

/**
 * 시트 데이터 유효성 체크
 * @param sheetData 
 */
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

export const getColorSheetData = filePath => {
  const file = xlsx.readFile(filePath);
  const colorSheet = file.Sheets.Sheet1;
  const colorList = convertSheetDataToArray(colorSheet);

  return colorList;
}