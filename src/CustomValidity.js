'use strict';

import core from 'metal';
import State from 'metal-state';

class CustomValidity extends State {
	/**
	 *
	 */
	constructor(opt_config) {
		super(opt_config);

		var instance = this;

		let native = instance.rules.native,
			invalid = !(native && instance.element.validity && instance.element.validity.valid);

		if (native && instance.element.validity) {
			instance.getNativeValidationErrors_(instance.element.validity).forEach(
				function(key) {
					instance.addValidationMessage_(key, instance.element.validationMessage);
				}
			);
		}

		for (let key in this.rules) {
			if (key !== 'native') {
				let rule = rules[key];

				if (core.isBoolean(rule) && rule) {
					valid = CustomValidity.RULES[key].apply(this, [this.value])
				}
				else if (core.isObject(rule)) {
					valid = CustomValidity.RULES[key].apply(this, [this.value, ruleValue])
				}
				else if (core.isFunction(rule)) {
					valid = rule.apply(this, [this.value]);
				}

				if (!valid) {
					this.errors.push(key);
					invalid = true;
					this.addValidationMessage(key);
				}
			}
		}

		this.valid_ = !invalid;
	}

	/**
	 *
	 */
	addValidationMessage_(errorKey, defaultMessage) {
		let errorMessage = this.customMessageFn ? this.customMessageFn(errorKey) : '';

		this.validationMessages.push(errorMessage.length > 0 ? errorMessage : defaultMessage);
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
	errors: {
		validator: Array.isArray,
		value: []
	},

	/**
	 *
	 */
	rules: {
		validator: core.isObject,
		value: {}
	},

	/**
	 *
	 */
	type: {
		validator: core.isString,
		value: CustomValidity.INPUT_TYPES.TEXT
	},

	/**
	 *
	 */
	valid_: {
		validator: core.isBoolean,
		value: true
	},

	/**
	 *
	 */
	validationMessages: {
		validator: Array.isArray,
		value: []
	},

	/**
	 *
	 */
	value: {}
};

/**
 *
 */
CustomValidity.STRINGS = {
	DEFAULT: 'Please fix {field}.',
	acceptFiles: 'Please enter a value with a valid extension ({0}) in {field}.',
	alpha: 'Please enter only alpha characters in {field}.',
	alphanum: 'Please enter only alphanumeric characters in {field}.',
	date: 'Please enter a valid date in {field}.',
	digits: 'Please enter only digits in {field}.',
	email: 'Please enter a valid email address in {field}.',
	equalTo: 'Please enter the same value again in {field}.',
	iri: 'Please enter a valid IRI in {field}.',
	max: 'Please enter a value less than or equal to {0} in {field}.',
	maxLength: 'Please enter no more than {0} characters in {field}.',
	min: 'Please enter a value greater than or equal to {0} in {field}.',
	minLength: 'Please enter at least {0} characters in {field}.',
	number: 'Please enter a valid number in {field}.',
	range: 'Please enter a value between {0} and {1} in {field}.',
	rangeLength: 'Please enter a value between {0} and {1} characters long in {field}.',
	required: '{field} is required.',
	url: 'Please enter a valid URL in {field}.'
};

/**
 *
 */
CustomValidity.RULES = {
	max(value, ruleValue) {
		return (value <= ruleValue);
	},

	maxLength(value, ruleValue) {
		return (value.length <= ruleValue);
	},

	min(value, ruleValue) {
		return (value <= ruleValue);
	},

	pattern(value, ruleValue) {

	},

	required(value) {
		
	},

	step() {

	}
};

CustomValidity.NATIVE_VALIDATION_KEYS = ['patternMismatch','rangeOverflow','rangeUnderflow','stepMismatch','tooLong','tooShort','typeMismatch','valueMissing'];

export default CustomValidity;