var {dialog} = require('electron').remote;
var fs = require('fs');

// $(document).ready(function() {
  var mode = 'excel'; // excel or custom
  var elemLoading = document.getElementById('loading-layer');

  var fieldWidthSize = document.getElementById('size_width');
  var fieldHeightSize = document.getElementById('size_height');
  var checkSquare = document.getElementById('check_square');

  var colorPicker = document.getElementById('color_picker');
  var fieldColor = document.getElementById('color_text');
  var checkColorType = document.getElementById('select_color_type');
  var xlsxFile = document.getElementById('xlsx_file');

  var fieldExtType = document.getElementById('img_ext_type');

  var btnSubmit = document.getElementById('btn-generate');

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var checkValidation = function() {
    if (
      !fieldWidthSize.value || 
      (!fieldHeightSize.value && checkSquare.checked === false) ||
      !xlsxFile
      // !fieldColor.value ||
      // (fieldColor.value.length !== 3 && fieldColor.value.length !== 6)
    ) {
      btnSubmit.disabled = true;
      return false;
    }

    btnSubmit.disabled = false;
    return true;
  };


  fieldWidthSize.addEventListener('keyup', checkValidation);
  fieldHeightSize.addEventListener('keyup', checkValidation);

  checkSquare.addEventListener('change', function(event) {
    if (event.currentTarget.checked === true) {
      fieldHeightSize.disabled = true;
    } else {
      fieldHeightSize.disabled = false;
    }

    checkValidation();
  });


  checkColorType.addEventListener('change', function(event) {
    if (event.currentTarget.checked === true) {
      colorPicker.disabled = true;
      fieldColor.readOnly = false;
    } else {
      colorPicker.disabled = false;
      fieldColor.readOnly = true;
    }

    checkValidation();
  });

  var startGenerate = function() {
    event.preventDefault();

    if (!checkValidation()) {
      return;
    }

    elemLoading.style.display = 'block';

    const requestData = new FormData();
    requestData.append('xlsx_file', xlsxFile.files[0]);

    fetch('http://127.0.0.1:8082/api/v1/metadata', {
      method: 'POST',
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        width: fieldWidthSize.value,
        height: fieldHeightSize.value,
        ext: fieldExtType.value 
      })
    })
    .then(function() {
      fetch('http://127.0.0.1:8082/api/v1/generate', {
        method: 'POST',
        body: requestData
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          console.log(json);
          elemLoading.style.display = 'none'

          if (json.status === 'fail') {
            alert(json.message);
            return false;
          }

          dialog.showSaveDialog(() => {
            fs.writeFile('colors.zip', json.link,);
          });
          // var a = document.createElement('a');
          // a.href = json.link;
          // a.download = json.link;
          // a.style.display = 'none';
          // document.body.appendChild(a);
          // a.click();
          // // delete a;
        })
        .catch(err => {
          console.log(err)
          alert('ERROR!!!');
        })
    })
  };

  colorPicker.addEventListener('change', function(event) {
    fieldColor.value = event.target.value.replace(/#/g, '');
    checkValidation();
  });

  fieldColor.addEventListener('keyup', function() {
    checkValidation();
  })

  btnSubmit.addEventListener('click', startGenerate);

  checkValidation();

// })