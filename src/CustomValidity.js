'use strict';

import { core, object } from 'metal';
import State from 'metal-state';

class CustomValidity extends State {
	/**
	 *
	 */
	constructor(opt_config) {
		super(opt_config);

		var instance = this;

		instance.validationMessages_ = [];

		let native = instance.rules.native;

		if (native && instance.element.validity) {
			instance.getNativeValidationErrors_(instance.element.validity).forEach(
				function(key) {
					instance.addValidationMessage_(key, instance.element.validationMessage);
				}
			);
		}

		for (let key in this.rules) {
			var valid = false;

			if (key !== 'native') {
				let rule = this.rules[key];

				if (core.isBoolean(rule) && rule) {
					valid = CustomValidity.RULES[key].apply(this, [this.element.value])
				}
				else if (core.isObject(rule)) {
					valid = CustomValidity.RULES[key].apply(this, [this.element.value, rule.value])
				}
				else if (core.isFunction(rule)) {
					valid = rule.apply(this, [this.element.value]);
				}

				if (!valid) {
					this.addValidationMessage_(key, instance.strings[key]);
				}
			}
		}

		this.valid_ = !(this.validationMessages_.length > 0);
	}

	/**
	 *
	 */
	addValidationMessage_(errorKey, defaultMessage) {
		let errorMessage = this.customMessageFn ? this.customMessageFn(errorKey) : '';

		this.validationMessages_.push(errorMessage.length > 0 ? errorMessage : defaultMessage);
	}

	/**
	 *
	 */
	getNativeValidationErrors_(nativeValidity) {
		let errors = [];

		CustomValidity.NATIVE_VALIDATION_KEYS.forEach(function(key) {
			if (nativeValidity[key] === true) {
				errors.push(key);
			}
		});

		return errors;
	}

	getValidationMessages() {
		return this.validationMessages_;
	}
}

/**
 *
 */
CustomValidity.INPUT_TYPES = {
	EMAIL: 'email',
	TEXT: 'text'
};

/**
 *
 */
CustomValidity.STATE = {
	/**
	 *
	 */
	customMessageFn: {
		validator: core.isFunction
	},

	/**
	 *
	 */
	element: {
		validator: core.isObject
	},

	/**
	 *
	 */
	rules: {
		validator: core.isObject,
		setter: val => {
			return object.mixin(
				{
					native: true
				},
				val
			);
		},
		valueFn: () => {}
	},

	/**
	 *
	 */
	strings: {
		validator: core.isStrings,
		setter: val => {
			return object.mixin(CustomValidity.STRINGS, val);
		},
		valueFn: () => {}
	},

	/**
	 *
	 */
	valid_: {
		validator: core.isBoolean,
		value: true
	}
};

/**
 *
 */
CustomValidity.STRINGS = {
	DEFAULT: 'Please fix field.',
	acceptFiles: 'Please enter a value with a valid extension in field.',
	alpha: 'Please enter only alpha characters in field.',
	alphanum: 'Please enter only alphanumeric characters in field.',
	date: 'Please enter a valid date in field.',
	digits: 'Please enter only digits in field.',
	email: 'Please enter a valid email address in field.',
	equalTo: 'Please enter the same value again in field.',
	iri: 'Please enter a valid IRI in field.',
	max: 'Please enter a value less than or equal to {0} in field.',
	maxLength: 'Please enter no more than {0} characters in {field}.',
	min: 'Please enter a value greater than or equal to {0} in {field}.',
	minLength: 'Please enter at least {0} characters in {field}.',
	number: 'Please enter a valid number in {field}.',
	range: 'Please enter a value between {0} and {1} in {field}.',
	rangeLength: 'Please enter a value between {0} and {1} characters long in {field}.',
	required: 'Field is required.',
	url: 'Please enter a valid URL in {field}.'
};

/**
 *
 */
CustomValidity.RULES = {
	/**
	 *
	 */
	max(value, ruleValue) {
		if (value) {
			return (value <= ruleValue);
		}

		return true;
	},

	/**
	 *
	 */
	maxLength(value, ruleValue) {
		if (value) {
			return (value.length <= ruleValue);
		}

		return true;
	},

	/**
	 *
	 */
	min(value, ruleValue) {
		if (value) {
			return (value >= ruleValue);
		}

		return true;
	},

	/**
	 *
	 */
	minLength(value, ruleValue) {
		if (value) {
			return (value.length >= ruleValue);
		}

		return true;
	}, 

	/**
	 *
	 */
	pattern(value, ruleValue) {

	},

	/**
	 *
	 */
	required(value) {
		return !!value;
	},

	/**
	 *
	 */
	step() {

	}
};

CustomValidity.REGEX = {
	alpha: /^[a-z_]+$/i,

	alphanum: /^\w+$/,

	digits: /^\d+$/,

	// Regex from Scott Gonzalez Email Address Validation: http://projects.scottsplayground.com/email_address_validation/
	email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,

	// Regex from Scott Gonzalez IRI: http://projects.scottsplayground.com/iri/demo/
	iri: /^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,

	number: /^[+\-]?(\d+([.,]\d+)?)+([eE][+-]?\d+)?$/,

	// Regex from Scott Gonzalez Common URL: http://projects.scottsplayground.com/iri/demo/common.html
	url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
},

CustomValidity.NATIVE_VALIDATION_KEYS = ['patternMismatch','rangeOverflow','rangeUnderflow','stepMismatch','tooLong','tooShort','typeMismatch','valueMissing'];

export default CustomValidity;