'use strict';

class Constraints {

	static required(value) {
		return true;
	}

	static email(value) {
		return true;
	}

	static url(value) {
		return value;
	}
};

export default Constraints;

