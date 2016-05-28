'use strict';

import core from 'metal';
import dom from 'metal-dom';
import Constraints from './Constraints';
import State from 'metal-state';

class FormElementValidator extends State  {
	constructor(opt_config) {
		super(opt_config);

		this.constraints = [];

		let instance = this;
		let formElement = this.formElement;
		let type = this.type;
		
		this.setForm_(formElement);
		this.setNativeValidation_(formElement);
		this.checkTypeConsistency_(formElement);
		this.addConstraints_();

		dom.on(formElement, 'input', function(event) {
			 if (event.target.matches(':invalid')) {
              console.log('input:invalid');
            } else {
               console.log('input:valid');
            }
		});

		dom.on(formElement, 'blur', function(event) {
            if (event.target.matches(':invalid')) {
              console.log('blur:invalid');
            } else {
               console.log('blur:valid');
            }
		});

		dom.on(formElement, 'invalid', function(event) {
			let formElement = event.currentTarget;
			event.preventDefault();
			console.log('invalid');
		});
	}

	/**
	 * Adds constraints based on the element's type.
	 */
	addConstraints_() {
		let type = this.type,
			constraint;

		if (this.isNativeValidation_) {
			switch (type) {
				case 'email':
					constraint = Constraints.email;
					break;
				case 'url':
					constraint = Constraints.url;
					break;
				case 'required':
					constraint = Constraints.required;
					break;
			}

			if (this.isRequired_()) {
				this.constraints.push(Constraints.required);
			}

			if (constraint) {
				this.constraints.push(constraint);
			}
		}

		var custom = this.custom;

		if (custom && core.isFunction(custom)) {
			this.constraints.push(custom);
		}
	}

	isRequired_() {
		return this.formElement.required;
	}

	/**
	 * Re-check needed
	 */
	checkTypeConsistency_(formElement) {
		let type = this.type,
			formElementType = formElement.getAttribute('type');

		if(type && formElementType && type !== formElementType) {
			throw new Error('Inconsistent types!');
		}

		type = type || formElementType || (this.custom ? 'custom' : undefined);

		if (!type) {
			throw new Error('Invalid type');
		}
		else {
			this.type = type;
		}
	}

	/**
	 * Calls original checkValidity() on the form element and the custom validation
	 */
	validate_(validity) {
		if (validity.valid) {
			this.constraints.forEach(
				function(item){
					item();
				});
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
		var formElement = document.getElementById(value);

		return formElement;
	}

	/**
	 * Checks native validation is weather or not.
	 */
	setNativeValidation_(formElement) {
		this.isNativeValidation_ = typeof formElement.willValidate !== "undefined";
	}
}

FormElementValidator.STATE = {
	/**
	 * Extends base constraints with a custom logic.
	 */
	custom: {

	},

	/**
	 *
	 */
	formElement: {
		setter: 'setFormElement_'
	},

	/**
	 *
	 */
	forceNativeValidation: {
		validator: core.isBoolean,
		value: true
	},

	/**
	 *
	 */
	type: {

	}
};

export default FormElementValidator;