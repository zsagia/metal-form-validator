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

		var formElement = this.formElement;
		
		instance.setForm_(formElement);

		if (this.validateOnInput) {
			dom.on(formElement, 'input', this.validate.bind(this));
		}

		if (this.validateOnBlur) {
			dom.on(formElement, 'blur', this.validate.bind(this));
		}

		dom.on(formElement, 'invalid', this.validate.bind(this));
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
		}
		
		return this.errorContainer_ = errorContainer;
	}

	/**
	 * Adds a validation error in the field.
	 *
	 * @method addFieldError
	 * @param {Node} field
	 * @param ruleName
	 */
	addOrRemoveFieldError(ruleName, failed) {
		var errorContainer = this.errorContainer_,
			errorField = this.getErrorField(ruleName);

		if (failed && !errorField) {
			errorField = document.createElement('div');
			errorField.innerHTML = this.strings[ruleName];
			errorField.className = ruleName;

			errorContainer.appendChild(errorField);
		}
		else if (!failed && errorField) {
			errorField.remove();
		}
	}

	/**
	 * Adds a validation error in the field.
	 *
	 * @method addFieldError
	 * @param {Node} field
	 * @param ruleName
	 */
	addOrRemoveFieldErrors(validity) {
		this.addErrorContainer_()

		for(errorKey in validity) {
			let errorValue = validity[errorKey];

			this.addOrRemoveFieldError(errorKey, errorValue);
		}

		if (this.errorContainer_.childNodes.length) {
			dom.addClasses(dom.closest(this.formElement, '.form-group'), 'has-error');
		}
	}

	/**
	 *
	 */
	getErrorField(ruleName) {
		var errorContainer = this.errorContainer_,
			divElement = errorContainer.getElementsByClassName(ruleName);

		return divElement ? divElement[0] : null;
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

	validate(event) {
		if (event.target.matches(':invalid')) {
			event.preventDefault();

			this.addOrRemoveFieldErrors(event.target.validity);
		}
		else {
			if (this.errorContainer_) {
				dom.removeClasses(dom.closest(this.formElement, '.form-group'), 'has-error');
				dom.addClasses(dom.closest(this.formElement, '.form-group'), 'has-success');

				this.errorContainer_.remove();
				this.errorContainer_ = null;
			}
			else {
				dom.addClasses(dom.closest(this.formElement, '.form-group'), 'has-success');
			}
		}
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
			valueMissing: '{field} is required.',
			typeMismatch: 'Please enter a valid value in {field}.'
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
		value: true
	},
};

export default FormElementValidator;