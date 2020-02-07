var elemLoading = document.getElementById('loading-layer');

var fieldWidthSize = document.getElementById('size_width');
var fieldHeightSize = document.getElementById('size_height');
var checkSquare = document.getElementById('check_square');

var colorPicker = document.getElementById('color_picker');
var fieldColor = document.getElementById('color_text');
var checkColorType = document.getElementById('select_color_type');

var fieldExtType = document.getElementById('img_ext_type');

var btnSubmit = document.getElementById('btn-generate');

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var checkValidation = function() {
	if (
		!fieldWidthSize.value || 
		(!fieldHeightSize.value && checkSquare.checked === false) ||
		!fieldColor.value ||
		(fieldColor.value.length !== 3 && fieldColor.value.length !== 6)
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

colorPicker.addEventListener('change', function(event) {
	fieldColor.value = event.target.value.replace(/#/g, '');
	checkValidation();
});

fieldColor.addEventListener('keyup', function() {
	checkValidation();
})

btnSubmit.addEventListener('click', function(event) {
	event.preventDefault();

	if (!checkValidation()) {
		return;
	}

	elemLoading.style.display = 'block';

	const requestData = new FormData();
	requestData.append('width', fieldWidthSize.value);
	requestData.append('height', fieldHeightSize.value);
	requestData.append('is_square', checkSquare.checked);
	requestData.append('bg_color', [fieldColor.value]);
	requestData.append('ext_type', fieldExtType.value);

	const jsonRequestData = {
		width: fieldWidthSize.value,
		height: fieldHeightSize.value,
		is_square: checkSquare.checked,
		bg_color: ['#' + fieldColor.value],
		ext_type: fieldExtType.value,
	};


	fetch('http://127.0.0.1:8082/api/v1/generate', {
		method: 'POST',
		headers : { 
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
				// body: requestData
		body: JSON.stringify(jsonRequestData)
	})
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			var image = new Image();
			image.onload = function() {
				ctx.drawImage(image, 0, 0);
				elemLoading.style.display = 'none';
			};
			image.src = json.data;
		});
});

checkValidation();