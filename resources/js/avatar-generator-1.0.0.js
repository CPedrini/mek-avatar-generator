;CP = {
	avatar: {
		frame: null,
		proportion: null,
		image: null,
		background: null,
		vertical: null,
		horizontal: null,
	},
	upload: {
		image: null,
		width: null,
		height: null,
	},
	settings: {
		proportions: [
			'scale',
			'contain',
			'original'
		],
		vertical: [
			'top',
			'middle',
			'bottom'
		],
		horizontal: [
			'left',
			'center',
			'right'
		]
	},
	generateImage: function(canvas) {
		console.log(CP);
		
		var ctx = canvas.getContext("2d"),
			image_1 = new Image(),
			image_2 = new Image();

		//image_1.setAttribute('crossOrigin', 'anonymous');
		//image_2.setAttribute('crossOrigin', 'anonymous');

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = CP.avatar.background;
		ctx.fillRect(0, 0, 300, 300);

		image_1.src = CP.upload.image;

		image_1.onload = function() {
			var height = image_1.height,
				width  = image_1.width,
				x = 0,
				y = 0;

			switch (CP.avatar.proportion)
			{
				case 'scale':
					if (width >= height)
					{
						height = 300 * height / width;
						width = 300;
					} else {
						width = 100 * height / width;
						height = 300;
					}
					break;
				case 'contain':
					height = 300;
					width = 300;
					break;
				case 'original':
					// Do nothing
					break;
			}

			switch (CP.avatar.vertical)
			{
				case 'top':
					y = 0;
					break;
				case 'middle':
					y = (300 - height) / 2;
					break;
				case 'bottom':
					y = 300 - height;
					break;
			}

			switch (CP.avatar.horizontal)
			{
				case 'left':
					x = 0;
					break;
				case 'center':
					x = (300 - width) / 2;
					break;
				case 'right':
					x = 300 - width;
					break;
			}

			ctx.drawImage(image_1, x, y, width, height);

			image_2.src = CP.avatar.frame;

			image_2.onload = function() {
				ctx.drawImage(image_2, 0, 0, 300, 300);
			}
		};
	}
};

$(document).ready(function() {
	CP.avatar.proportion = $('form input[name="inputImageProportion"]').val();
	CP.avatar.frame = $('.frames a.selected img').attr('src');
	CP.avatar.background = $('#inputBackgroundColor').val();
	CP.avatar.vertical = $('form input[name="inputImagePositionY"]').val();
	CP.avatar.horizontal = $('form input[name="inputImagePositionX"]').val();
	
	$('#inputBackgroundColor').parent('.input-group').colorpicker({
		format: 'hex',
	}).on('changeColor.colorpicker', function(event) {
		CP.avatar.background = event.color.toHex();

		if (CP.upload.image != null)
		{
			var canvas = document.getElementById("avatar-canvas");

			CP.generateImage(canvas);
		}
	});

	$('.frames a').click(function(event) {
		$('.frames a').toggleClass('selected', false);
		$(this).toggleClass('selected', true);

		CP.avatar.frame = $(this).find('img').attr('src');

		if (CP.upload.image != null)
		{
			var canvas = document.getElementById("avatar-canvas");

			CP.generateImage(canvas);
		}

		event.preventDefault();
	});

	$('form input[name="inputImageProportion"]').change(function() {
		var selected_proportion = $(this).val();

		if (CP.settings.proportions.indexOf(selected_proportion) != -1)
			CP.avatar.proportion = selected_proportion;

		if (CP.upload.image != null)
		{
			var canvas = document.getElementById("avatar-canvas");

			CP.generateImage(canvas);
		}
	});

	$('form input[name="inputImagePositionY"]').change(function() {
		var selected_position = $(this).val();

		if (CP.settings.vertical.indexOf(selected_position) != -1)
			CP.avatar.vertical = selected_position;

		if (CP.upload.image != null)
		{
			var canvas = document.getElementById("avatar-canvas");

			CP.generateImage(canvas);
		}
	});

	$('form input[name="inputImagePositionX"]').change(function() {
		var selected_position = $(this).val();

		if (CP.settings.horizontal.indexOf(selected_position) != -1)
			CP.avatar.horizontal = selected_position;

		if (CP.upload.image != null)
		{
			var canvas = document.getElementById("avatar-canvas");

			CP.generateImage(canvas);
		}
	});

	$('form input[type="file"]').change(function() {
		if (this.files && this.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				var img = new Image();

				img.src = e.target.result;
				
				CP.upload.image = e.target.result;
				CP.upload.width = img.width;
				CP.upload.height = img.height;

				var canvas = document.getElementById("avatar-canvas");

				CP.generateImage(canvas);

				$('form a').removeAttr('disabled');
				$('#avatar-canvas').toggleClass('transparent', true);
			}

			reader.readAsDataURL(this.files[0]);
		}
	});

	$('form a').click(function(event) {
		var canvas = document.getElementById("avatar-canvas");

		this.href = canvas.toDataURL();
	});
});