import React from 'react'
import ReactDOM from 'react-dom';
import Main from './components'
import fs from 'fs'

window.fs = fs;

ReactDOM.render(<Main />, document.getElementById('app'));
