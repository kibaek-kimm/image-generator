import React, {useState, useEffect, useRef} from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import * as styles from './styled'

const FileDragDrop = ({onFileChange}) => {
  const [status, setStatus] = useState();
  const [file, setFile] = useState();
  const fieldRef = useRef();

  const handleDragOver = e => {
    e.stopPropagation();
    e.preventDefault();

    setStatus('over');
  };

  const handleDragLeave = e => {
    setStatus('default');
  };

  const handleDrop = e => {
    setStatus('uploading');
    setFile(e.dataTransfer.files[0]);
  };

  const handleChange = e => {
    setStatus('uploading');
    setFile(e.currentTarget.files[0]);
  };

  const handleFile = () => {
    if (onFileChange && typeof onFileChange === 'function') {
      onFileChange(file);
    }

    setTimeout(() => setStatus('uploaded'), 1500);
  };

  useEffect(() => {
    if (file) {
      handleFile();
    }
    console.log('file', file);
  }, [file]);

  return (
    <ThemeProvider theme={{ status }}>
      <styles.Wrapper 
        onDrop={e => handleDrop(e)}
        onDragOver={e => handleDragOver(e)}
        onDragLeave={e => handleDragLeave(e)}
      >
        <styles.Inner>
          {status === 'uploading' ? (
            <CircularProgress />
          ) : (
            <>
              <p>
                {status === 'uploaded' 
                  ? <span>업로드 성공({file.name})<br/>파일 다시 업로드하기</span>
                  : <>파일을 이곳에 <strong>Drag&amp;Drop</strong> 해주세요</> 
                }
              </p>
              <Button 
                variant="contained" 
                color="inherit"
                onClick={() => fieldRef.current.click()}
              >
                Browser Files
              </Button>
            </>
          )}
          
          <styles.InputHiddenFile ref={fieldRef} onChange={e => handleChange(e)}/>
        </styles.Inner>
      </styles.Wrapper>
    </ThemeProvider>
  )
};

export default FileDragDrop;