/**
 * {@link LogRecord} objects are used to pass logging requests between the logging framework and individual log Handlers.
 * When a {@link LogRecord} is passed into the logging framework it logically belongs to the framework 
 * 	and should no longer be used or updated by the client application.
 * 
 * @param level A logging level value
 * @param msg The raw non-localized logging message (may be null)
 * @author Fabian M.
 */
module.exports = function(level, msg) {
	if (typeof level != 'object' || typeof msg != 'string')
		return null;
	this.level = level;
	this.message = msg;
	this.date = new Date();
};
