Backbone.sync = (function() {

	/*
	 * Generate 4 random hex digits.
	 * 
	 * Generating a random number between 0x20000 and 0x10000 and taking
	 * the last four digits avoids having to explicitly left pad with 0.
	 */
	var hex4 = function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};

	/*
	 * Generate a random GUID.
	 */
	var makeGuid = function guid() {
		return hex4() + hex4() + "-" + hex4() + "-" + hex4() + "-" + hex4() + "-" + hex4() + hex4() + hex4();
	};
	
	var sync = function(model, op, data) {
	}

	/* provide a default implementation of makeGuid */
	sync.makeGuid = makeGuid;

	return sync;

})();
