// HTML Structure
// <div class='js-formField'>
//     <div class='js-formLabel'>Some Label:</div>
// 	   <div class='js-formInput u-width300' data-required data-type='text' data-minLength='12'><input type='text' name='someName'><i></i></div>
// </div>

function initForm() {
	// add required field icons
	$('[data-required]').each(function() {
		var input = $(this).find('input');
		var width = input.width();

		input.after('<i class="js-formIcon fa fa-asterisk"></i>');
		input.width(width - 18);
	});

	// add select icons
	$('.js-formInput select').each(function() {
		var select = $(this);
		var width = select.width();

		select.after('<i class="js-formIcon fa fa-sort"></i>');
		select.width(width - 14);
	})

	checkFields();

	$('[data-required] input').keyup(function(){checkFields();});
}

function checkFields(warn) {
	// warn dictates if we should show warnings to the user
	if (typeof(warn) == 'undefined') {
		warn = false;
	}

	var allValid = true;
	// check each field for validity agaisnt the rules set in the html
	$('.js-formField').each(function() {
		var inputWrapper = $(this).find('.js-formInput');
		var input = $(this).find('.js-formInput input');
		var icon = $(this).find('.js-formInput i');
		var warning = $(this).find('.js-formWarn');

		// set rules
		var required = (typeof inputWrapper.data('required') !== 'undefined');
		// types are string (default), int, float, phone, and email
		if (typeof inputWrapper.data('type') !== 'undefined') {
			var type = inputWrapper.data('type');
		} else {
			var type = 'string';
		}

		if (required) {
			var value = input.val();
			var valid = false;

			// test block
			if (type == 'int' && Math.floor(value) == value && $.isNumeric(value)) {
				valid = true;
			} else if (type == 'float' && value % 1 != 0 && $.isNumeric(value)) {
				valid = true;
			} else if (type == 'phone' && value.replace(/[^0-9]/g, '').length >= 10) {
				valid = true;
			} else if (type == 'email' && /.+@.+\..+/i.test(value)) {
				valid = true;
			} else if (type == 'string' && value != '') {
				valid = true;
			}

			// if confirm against is set check it against the other defined field
			if (typeof inputWrapper.data('confirmagainst') !== 'undefined') {
				var confirmAgainst = inputWrapper.data('confirmagainst');
				if (value != $("input[name='"+confirmAgainst+"']").val()) {
					valid = false;
				}
			}

			if (valid) {
				warning.removeClass('isShown');
				icon.removeClass('fa-asterisk');
				icon.addClass('fa-check');
			} else {
				if (warn) warning.addClass('isShown');
				allValid = false;
				icon.removeClass('fa-check');
				icon.addClass('fa-asterisk');
			}
		}
	})

	return allValid;
}