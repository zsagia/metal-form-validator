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
	 * In an improved version it will do some validation logic as well.
	 * @param {Object} event
	 * @protected
	 */
	validate_(event) {
		event.preventDefault();
		event.stopPropagation();

		var invalid, customValid = true;

		event.target.setCustomValidity('');
		if (this.customFunction && !this.customFunction(event)) {
			customValid = false;
		}

		invalid = dom.match(event.target, ':invalid');

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
	 * If customFunction is existed then it will be ran when the native validation was successful.
	 * @type {Function}
	 */
	customFunction: {
		validator: core.isFunction
	},

	/**
	 * CustomErrorMessage will be displayed if the customValidation failed.
	 * @type {string}
	 */
	customErrorMessage: {
		validator: core.isString
	},

	/**
	 * Contains a form element string
	 * @type {string}
	 */
	fieldElement: {
	   validator: core.isString
	},

	/**
	 * Contains the generated error message
	 * @type {string}
	 */
	errorMessage: {
		validator: core.isString
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
	},

	/**
	 * Current status based on a validation logic.
	 * It will be set either statusClasses.hasError or statusClasses.hasSuccess
	 * @type {string}
	 */
	status: {
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
	}
};
Soy.register(FormFieldValidator, templates);

export default FormFieldValidator;
