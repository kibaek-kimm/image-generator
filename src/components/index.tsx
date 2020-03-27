import * as React from 'react'
import xlsx from 'xlsx';

const Main = () => {
  const {useState, useEffect} = React;
  const handleUploadFile = e => {
    const file = e.currentTarget.files[0];
    const sheetData = xlsx.readFile(file.path);
    console.log(file);
  };

  useEffect(() => {
    console.log(1111);
    window.ipcRenderer.on('pong', (event, arg) => {
      console.log(args)
    })
    window.ipcRenderer.send('ping')
  }, []);

  return (
    <div>
      <label htmlFor="test">엑셀파일 업로드</label>
      <input type="file" onChange={handleUploadFile}/>

    </div>
  )
}

export default Main;