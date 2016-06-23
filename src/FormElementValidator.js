'use strict';

import core from 'metal';
import dom from 'metal-dom';
import templates from './FormElementValidator.soy';
import Component from 'metal-component';
import Soy from 'metal-soy';

class FormElementValidator extends Component  {
	attached() {
		this.formElement = this.element.querySelector('input, select, textarea');

		if (this.validateOnInput) {
			dom.on(this.formElement, 'input', this.validate_.bind(this));
		}
		if (this.validateOnBlur) {
			dom.on(this.formElement, 'blur', this.validate_.bind(this));
		}

		dom.on(this.formElement, 'invalid', this.validate_.bind(this));
	}

	/**
	 * This method just set status and errorMessage attributes now.
	 * In an improved version it will do some validation logic as well.
	 * @param {Object} event
	 * @protected
	 */
	validate_(event) {
		event.preventDefault();
		event.stopPropagation();

		if (dom.match(event.target, ':invalid')) {
			this.errorMessage = this.formElement.validationMessage;
			this.status = this.statusClasses.hasError;
		}
		else {
			this.errorMessage = "";
			this.status = this.statusClasses.hasSuccess;
		}
	}
}

FormElementValidator.STATE = {
	/**
	 * Contains a form element string
	 * @type {string}
	 */
	formElementField: {
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
Soy.register(FormElementValidator, templates);

export default FormElementValidator;
