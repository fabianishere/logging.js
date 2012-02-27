var SimpleFormatter = require('../formatter/simple'),
	Level = require('../level'),
	fs = require('fs');

/** 
 * This {@link Handler} publishes log records to a file.
 * By default the {@link SimpleFormatter} is used to generate brief summaries.
 * 
 * @param path The path to the file to log in.
 * @author Fabian M.
 */
module.exports = function(path, level) {
	level = level || Level.FINEST;
	var formatter = this.formatter = new SimpleFormatter();
	var file = fs.openSync(path, 'w');
	this.publish = function(logrecord) {
		if (logrecord.level.value >= level.value) 
			fs.writeSync(file, formatter.format(logrecord));
	};
};
