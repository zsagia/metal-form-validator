'use strict';

import core from 'metal';
import dom from 'metal-dom';
import templates from './FormFieldValidator.soy';
import Component from 'metal-component';
import CustomValidity from './CustomValidity.js';
import Soy from 'metal-soy';

class FormFieldValidator extends Component  {
	attached() {
		this.delegate('invalid', 'input, select, textarea', this.validate_.bind(this));
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

		var element = event.target;
		var customValidity = new CustomValidity({
			customMessageFn: this.customMessageFn,
			element: element,
			rules: this.rules,
			type: element.type,
			value: element.value
		});

		this.errorMessage_ = customValidity.validationMessages[0];
		this.status_ = customValidity.valid_ ? this.statusClasses.hasSuccess : this.statusClasses.hasError;
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

export default FormFieldValidator;
