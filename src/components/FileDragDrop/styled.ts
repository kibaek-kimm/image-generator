import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 300px;
  padding: 10px;
  background: #eee;
  box-sizing: border-box;
`

export const Inner = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 70px;
  border: 2px dashed #aaa;
  text-align: center;
  box-sizing: border-box;
  transition: background 0.3s;

  ${p => p.theme.status === 'over' && `
    background: #fff;
  `}

  p {
    font-weight: 100;
    font-size: 30px;
    margin-bottom: 20px;
    opacity: 0.6;
    letter-spacing: -0.75px;

    ${p => p.theme.status === 'uploaded' && `
      margin: 0 0 20px 0;
    `}

    strong {
      font-weight: 500;
    }
  }
`

export const InputHiddenFile = styled.input.attrs({
  type: 'file'
})`
  opacity: 0;
  position: absolute;
  left: 0;
  z-index: -1;
`