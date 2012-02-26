var SimpleFormatter = require('../formatter/simple');

/** 
 * This {@link Handler} publishes log records to a file.
 * By default the {@link SimpleFormatter} is used to generate brief summaries.
 * 
 * @param path The path to the file to log in.
 * @author Fabian M.
 */
module.exports = function(path) {
	var formatter = this.formatter = new SimpleFormatter();
	var file = fs.open(path, 'w');
	this.publish = function(logrecord) {
		fs.writeSync(file, formatter.format(logrecord));
	};
};
