'use strict';

import core from 'metal';
import dom from 'metal-dom';
import templates from './FormFieldValidator.soy';
import Component from 'metal-component';
import Soy from 'metal-soy';

class FormFieldValidator extends Component  {
	attached() {
		this.delegate('invalid', 'input, select, textarea', this.validate_.bind(this));
	}

	/**
	 * This method just set status and errorMessage attributes now.
	 */
	handleValidationResult_(errorMessage, status) {
		this.errorMessage = errorMessage;
		this.status = status;
	}

	/**
	 * Synchronization logic for `validationOnBlur` state.
	 * @param {boolean} newVal
	 */
	syncValidateOnBlur(newVal) {
		if (newVal) {
			this.blurHandle_ = this.delegate('blur', 'input, select, textarea', this.validate_.bind(this));
		} else if (this.blurHandle_) {
			this.blurHandle_.removeListener();
		}
	}

	/**
	 * Synchronization logic for `validationOnInput` state.
	 * @param {boolean} newVal
	 */
	syncValidateOnInput(newVal) {
		if (newVal) {
			this.inputHandle_ = this.delegate('input', 'input, select, textarea', this.validate_.bind(this));
		} else if (this.inputHandle_) {
			this.inputHandle_.removeListener();
		}
	}

	/**
	 * Handles native and custom validation as well.
	 * Custom validation logic is aligned to Constraints API
	 * @param {Object} event
	 * @protected
	 */
	validate_(event) {
		event.preventDefault();
		event.stopPropagation();

		var invalid = !event.target.validity.valid;

		if (this.nativeValidation && invalid) {

		}

		event.target.setCustomValidity('');
		if (this.customFunction && !this.customFunction(event)) {
			customValid = false;
		}

		if (invalid) {
			this.handleValidationResult_(event.target.validationMessage, this.statusClasses.hasError);
		}
		else if (!customValid) {
			event.target.setCustomValidity(this.customErrorMessage);
			this.handleValidationResult_(this.customErrorMessage, this.statusClasses.hasError);
		}
		else {
			this.handleValidationResult_('', this.statusClasses.hasSuccess);
		}	
	}
}

FormFieldValidator.STATE = {
	/**
	 * @type {function}
	 */
	customMessageFn: {
		validator: core.isFunction
	},

	/**
	 * Contains the generated error message
	 * @type {string}
	 */
	errorMessage_: {
		validator: core.isString
	},

	/**
	 * Contains a form element string
	 * @type {string}
	 */
	field: {
	   validator: core.isString
	},

	/**
	 *
	 */
	nativeValidation: {
		validator: core.isBoolean,
		value: true
	},

	/**
	 *
	 */
	rules: {
		validator: core.isObject
	},

	/**
	 * Current status based on a validation logic.
	 * It will be set either statusClasses.hasError or statusClasses.hasSuccess
	 * @type {string}
	 */
	status_: {
		validator: core.isString
	},

	/**
	 * An object for to set status
	 * @type {Object}
	 * @default { hasError: 'has-error', hasSuccess: 'has-success' }
	 */
	statusClasses: {
		validator: core.isObject,
		value: {
			hasError: 'has-error',
			hasSuccess: 'has-success'
		}
	},

	/**
	 * If `true` the field will be validated on blur event.
	 * @type {boolean}
	 * @default true
	 */
	validateOnBlur: {
		validator: core.isBoolean,
		value: true
	},

	/**
	 * If `true` the field will be validated on input event.
	 * @type {boolean}
	 * @default true
	 */
	validateOnInput: {
		validator: core.isBoolean,
		value: true
	}
};
Soy.register(FormFieldValidator, templates);

FormFieldValidator.RULES = {
	max(value, limit) {
		return (value <= limit);
	},

	maxLength(value, limit) {
		return (val.length <= limit);
	},

	min(value, limit) {
		return (value <= limit);
	},

	pattern(value, pattern) {

	},

	required(value) {
		
	},

	step() {

	}
};

export default FormFieldValidator;
