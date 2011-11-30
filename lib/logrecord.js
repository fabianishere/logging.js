/**
 * {@link LogRecord} objects are used to pass logging requests between the logging framework and individual log Handlers.
 * When a {@link LogRecord} is passed into the logging framework it logically belongs to the framework 
 * 	and should no longer be used or updated by the client application.
 * Note that if the client application has not specified an explicit source method name and 
 * 	source class name, then the {@link LogRecord} class will infer them automatically when they are 
 * 	first accessed (due to a call on getSourceMethodName or getSourceClassName) by analyzing 
 * 	the call stack. 
 * Therefore, if a logging Handler wants to pass off a {@link LogRecord} to another thread, 
 * 	or to transmit it over RMI, and if it wishes to subsequently obtain method name or 
 * 	class name information it should call one of getSourceClassName or getSourceMethodName 
 * 	to force the values to be filled in.
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