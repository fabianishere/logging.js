/**
 * Print a brief summary of the {@link LogRecord} in a human readable format.
 * The summary will typically be 1 or 2 lines.
 * 
 * @author Fabian M.
 */
module.exports = function() {
	this.format = function(logrecord) {
		return logrecord.date.toUTCString() + " " + logrecord.logger.name + "\n"
				+ logrecord.level.name + ": " + logrecord.message;
	};
};