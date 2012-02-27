var SimpleFormatter = require('../formatter/simple'),
	Level = require('../level');

/** 
 * This {@link Handler} publishes log records to <code>STDERR</code>. 
 * By default the {@link SimpleFormatter} is used to generate brief summaries.
 * 
 * @author Fabian M.
 */
module.exports = function(level) {
	level = level || Level.FINEST;
	var formatter = this.formatter = new SimpleFormatter();
	this.publish = function(logrecord) {
		if (logrecord.level.value >= level.value) 
			console.error(formatter.format(logrecord));
	};
};
