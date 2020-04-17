import * as React from 'react'
import { Container, Button, CircularProgress } from '@material-ui/core';
import * as styles from './styled.ts'
import Table from '../components/Table'
import FileDragDrop from '../components/FileDragDrop'
import {getColorSheetData} from './common'

const Main = () => {
  const {useState, useEffect} = React;
  const handleUploadFile = file => {
    const data = getColorSheetData(file.path);
    console.log(data);
    console.log(file)
  };

  useEffect(() => {
    console.log(11111);

  }, []);

  return (
    <Container>
      <h1>Image Generator</h1>
      <FileDragDrop onFileChange={e => handleUploadFile(e)}/>
      
      {/* <Table /> */}
      {/* <styles.ButtonArea>
        <Button variant="contained" color="primary">Default</Button>
      </styles.ButtonArea> */}
    </Container>
  )
}

export default Main;