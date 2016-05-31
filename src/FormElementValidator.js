'use strict';

import core from 'metal';
import dom from 'metal-dom';
import State from 'metal-state';

/**
 * Element validator instance for to validate a form element.
 */
class FormElementValidator extends State  {
	constructor(opt_config) {
		super(opt_config);

		var instance = this;
		let formElement = instance.formElement;
		
		instance.setForm_(formElement);
		instance.createErrorContainer_();

		dom.on(formElement, 'input', function(event) {
			if (event.target.matches(':invalid')) {
				var errorContainer = instance.addErrorContainer_();

				this.addFieldErrors(event.target.validity);

				console.log('input:invalid');
			}
			else {
				var errorContainer = this.errorContainer_;

				if (errorContainer) {
					errorContainer.remove();
					errorContainer = null;
				}

				console.log('input:valid');
			}
		}.bind(this));

		dom.on(formElement, 'blur', function(event) {
			if (event.target.matches(':invalid')) {
				var errorContainer = instance.addErrorContainer_();

				this.addFieldErrors(event.target.validity);

				console.log('blur:invalid');
			}
			else {
				var errorContainer = this.errorContainer_;

				if (errorContainer) {
					errorContainer.remove();
					errorContainer = null;
				}

				console.log('blur:valid');
			}
		}.bind(this));

		dom.on(formElement, 'valid', function(event) {
			if (event.target.matches(':valid')) {
				console.log('valid');
			}
		}.bind(this));

		dom.on(formElement, 'invalid', function(event) {
			var errorContainer = instance.addErrorContainer_();

			if (event.target.matches(':invalid')) {
				event.preventDefault();

				this.addFieldErrors(event.target.validity);

				console.log('invalid');
			}
		}.bind(this));
	}

	/**
	 *
	 */
	createErrorContainer_() {
		var errorContainer;

		if(!this.errorContainer_) {
			errorContainer = document.createElement('div');

			errorContainer.className = "form-validator-stack help-block";
		}

		return errorContainer;
	}

	addErrorContainer_() {
		var errorContainer = this.errorContainer_;

		if (!errorContainer) {
			errorContainer = this.createErrorContainer_();

			let parentElement = dom.closest(this.formElement, '.form-group');

			if (parentElement) {
				parentElement.appendChild(errorContainer);
			}
			else {
				let nextSibling = this.formElement.nextElementSibling;

				if (nextSibling) {
					this.form_.insertBefore(errorContainer, nextSibling);
				}
				else {
					this.form_.appendChild(errorContainer);
				}
			}

			this.errorContainer_ = errorContainer;
		}
		
		return errorContainer;
	}

	/**
	 * Adds a validation error in the field.
	 *
	 * @method addFieldError
	 * @param {Node} field
	 * @param ruleName
	 */
	addFieldError(ruleName) {
		var errorContainer = this.errorContainer_;
		var divElement = document.createElement('div');

		divElement.innerHTML = this.strings[ruleName];
		errorContainer.appendChild(divElement);
	}

	/**
	 * Adds a validation error in the field.
	 *
	 * @method addFieldError
	 * @param {Node} field
	 * @param ruleName
	 */
	addFieldErrors(validity) {
		var requiedFailed = validity['valueMissing'];

		if (requiedFailed) {
			this.addFieldError('required');
		}

		if (this.showAllMessages) {
			for(errorKey in validity) {
				let errorValue = validity[errorKey];

				if (errorValue) {
					this.addFieldError(errorKey);
				}
			}
		}
	}

	/**
	 * Obtains parent form based on form element 
	 */
	setForm_(formElement) {
		this.form_ = dom.parent(formElement, "form");
	}

	/**
	 * 
	 */
	setFormElement_(value) {
		return core.isElement(value) ? value : document.getElementById(value);
	}
}

FormElementValidator.STATE = {
	/**
	 * An html form element which will be validated.
	 * Setter method always 
	 * @type {string|node}
	 */
	formElement: {
		setter: 'setFormElement_'
	},

	/**
	 * Defines if all validation messages will be showed or not.
	 *
	 * @attribute showAllMessages
	 * @default false
	 * @type Boolean
	 */
	showAllMessages: {
		validator: core.isBoolean,
		value: false
	},

	/**
	 * Defines if the validation messages will be showed or not.
	 *
	 * @attribute showMessages
	 * @default true
	 * @type Boolean
	 */
	showMessages: {
		validator: core.isBoolean,
		value: true
	},

	/**
	 * Collection of strings used to label elements of the UI.
	 *
	 * @attribute strings
	 * @type Object
	 */
	strings: {
		validator: core.isObject,
		value: {
			email: 'Please enter a valid email address in {field}.',
			max: 'Please enter a value less than or equal to {0} in {field}.',
			maxLength: 'Please enter no more than {0} characters in {field}.',
			min: 'Please enter a value greater than or equal to {0} in {field}.',
			minLength: 'Please enter at least {0} characters in {field}.',
			number: 'Please enter a valid number in {field}.',
			range: 'Please enter a value between {0} and {1} in {field}.',
			rangeLength: 'Please enter a value between {0} and {1} characters long in {field}.',
			required: '{field} is required.',
			url: 'Please enter a valid URL in {field}.'
		}
	},

	/**
	 * If `true` the field will be validated on blur event.
	 *
	 * @attribute validateOnBlur
	 * @default true
	 * @type Boolean
	 */
	validateOnBlur: {
		validator: core.isBoolean,
		value: true
	},

	/**
	 * If `true` the field will be validated on input event.
	 *
	 * @attribute validateOnInput
	 * @default false
	 * @type Boolean
	 */
	validateOnInput: {
		validator: core.isBoolean,
		value: false
	},
};

export default FormElementValidator;