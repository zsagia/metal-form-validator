'use strict';

import State from 'metal-state';

class FormValidator extends State {
	constructor(opt_config) {
		super(opt_config);
	}

	setElementValidators_(value) {
		
	}
};

FormValidator.STATE = {
	/**
	 *
	 */
	elementValidators: {
		setter: 'setElementValidators_',
		validator: Array.isArray,
		value: []
	}
};

export default FormValidator;
