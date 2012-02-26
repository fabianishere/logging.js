var SimpleFormatter = require('../formatter/simple'),
	fs = require('fs');

/** 
 * This {@link Handler} publishes log records to <code>STDERR</code>. 
 * By default the {@link SimpleFormatter} is used to generate brief summaries.
 * 
 * @author Fabian M.
 */
module.exports = function() {
	var formatter = this.formatter = new SimpleFormatter();
	this.publish = function(logrecord) {
		console.error(formatter.format(logrecord));
	};
};
