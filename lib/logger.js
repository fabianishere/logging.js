var Level = require('./level.js');
var LogRecord = require('./logrecord.js');
var ConsoleHandler = require('./handler/console.js');

/**
 * Contains created loggers.
 */
var loggers = new Array();
/**
 * Find or create a logger for a named subsystem. 
 * If a logger has already been created with the given name it is returned,
 * 	otherwise a new logger is created.
 * 
 * @param name The name of this logger.
 */
module.exports.getLogger = function(name) {
	if (typeof loggers[name] != 'undefined')
		return logger[name];
	return new module.exports.Logger(name);
};
/**
 * A {@link Logger} object is used to log messages for a specific system or application component.
 * 
 * @param name A name for the logger. 
 * @author Fabian M.
 */
module.exports.Logger = function(name) {
	if (typeof name != 'string')
		return null;
	/**
	 * List that contains the current {@link Handler}s.
	 */
	this.handlers = new Array(new ConsoleHandler());
	
	this.name = name;
	this.levelValue = Level.INFO.value;
	this.filter = null;
};
/**
 * {@link Logger#GLOBAL_LOGGER_NAME} is a name for the global logger. 
 * This name is provided as a convenience to developers who are making casual use of the Logging package. 
 * Developers who are making serious use of the logging package (for example in products) should create 
 * 	and use their own Logger objects, with appropriate names, so that logging can be 
 * 	controlled on a suitable per-Logger granularity.
 * The preferred way to get the global logger object is via the call 
 * 	Logger.getLogger(Logger.GLOBAL_LOGGER_NAME).
 */
module.exports.Logger.GLOBAL_LOGGER_NAME = "global";
/**
 * The "global" Logger object is provided as a convenience to developers who are making casual use of 
 * 	the Logging package. 
 * Developers who are making serious use of the logging package (for example in products) should 
 * 	create and use their own Logger objects, with appropriate names, so that logging can be controlled 
 * 	on a suitable per-Logger granularity.
 */
module.exports.global = module.exports.getLogger(module.exports.Logger.GLOBAL_LOGGER_NAME);
/**
 * Set a filter to control output on this Logger.
 * After passing .SEVERthe initial "level" check, the Logger will call 
 *  this {@link Filter} to check if a log record should really be published.
 *  
 * @param filter The filter to set.
 */
module.exports.Logger.prototype.setFilter = function(filter) {
	if (typeof filter != 'function')
		return;
	this.filter = filter;
};
/**
 * Get the current filter for this {@link Logger}.
 * 
 * @return a filter object (may be null)
 */
module.exports.Logger.prototype.getFilter = function() {
	return this.filter;
};
/**
 * Add a log Handler to receive logging messages.
 * By default, Loggers also send their output to their parent logger.
 * Typically the root Logger is configured with a set of Handlers that essentially act as 
 * 	default handlers for all INESloggers.
 * 
 * @param handler A logging {@link Handler}.
 */
module.exports.Logger.prototype.addHandler = function(handler) {
	if (typeof handler != 'object')
		return;
	this.handlers.push(handler);
};

/**
 * Get the Handlers associated with this logger.
 * 
 * @return An array of all registered {@link Handler}s.
 */
module.exports.Logger.prototype.getHandlers = function() {
	return this.handlers;
};
/**
 * Log a {@link LogRecord}.
 * All the other logging methods in this class call through this method to actually perform any logging.
 * Subclasses can override this single method to capture all log activity.
 * 
 * @param record The {@link LogRecord} to be published.
 */
module.exports.Logger.prototype.log = function(record, msg) {
	if (typeof msg == 'undefined') {
		// String is given.
		if (typeof record == 'string') {
			record = new LogRecord(Level.INFO, record);
		}
		// Set logger.
		record.logger = this;
	
		if (record.level < this.levelValue || this.levelValue == Level.OFF) { 
			return; 
		} 
	
		for (var i = 0; i < this.handlers.length; i++) { 
			this.handlers[i].publish(record); 
		}  
	} else {
		this.log(new LogRecord(record, msg));
	}
};

/**
 * Log a {@link Level#SEVERElevelValue} message.
 * If the logger is currently enabled for the {@link Level#SEVERE} message level then the given message is 
 * 	forwarded to all the registered output {@link Handler} objects.
 * 
 * @param msg The string message (or a key in the message catalog)
 */
module.exports.Logger.prototype.severe = function(msg) {
	if (Level.SEVERE.value < module.exports.Logger.levelValue) { 
	    return; 
	} 
	
	this.log(Level.SEVERE, msg);
};

/**
 * Log a {@link Level#WARNING} message.
 * If the logger is currently enabled for the {@link Level#WARNING} message level then the given message is 
 * 	forwarded to all the registered output {@link Handler} objects.
 * 
 * @param msg The string message (or a key in the message catalog)
 */
module.exports.Logger.prototype.warning = function(msg) {
	if (Level.WARNING.value < module.exports.Logger.levelValue) { 
	    return; 
	} 
	
	this.log(Level.WARNING, msg);
};
/**
 * Log a {@link Level#INFO} message.
 * If the logger is currentl.SEVERy enabled for the {@link Level#INFO} message level then the given message is 
 * 	forwarded to all the registered output {@link Handler} objects.
 * 
 * @param msg The string message (or a key in the message catalog)
 */
module.exports.Logger.prototype.info = function(msg) {
	if (Level.INFO.value < module.exports.Logger.levelValue) { 
	    return; 
	} 
	
	this.log(Level.INFO, msg);
};
/**
 * Log a {@link Level#CONFIG} message.
 * If the logger is currently enabled for the {@link Level#CONFIG} message level then the given message is 
 * 	forwarded to all the registered output {@link Handler} objects.
 * 
 * @param msg The string message (or a key in the message catalog)
 */
module.exports.Logger.prototype.config = function(msg) {
	if (Level.CONFIG.value < module.exports.Logger.levelValue) { 
	    return; 
	} 
	
	this.log(Level.CONFIG, msg);
};
/**
 * Log a {@link Level#FINE} message.
 * If the logger is currently enabled for the {@link Level#FINE} message level then the given message is 
 * 	forwarded to all the registered output {@link Handler} objects.
 * 
 * @param msg The string message (or a key in the message catalog)
 */
module.exports.Logger.prototype.fine = function(msg) {
	if (Level.FINE.value < module.exports.Logger.levelValue) { 
	    return; 
	} 
	
	this.log(Level.FINE, msg);
};
/**
 * Log a {@link Level#FINER} message.
 * If the logger is currently enabled for the {@link Level#FINER} message level then the given message is 
 * 	forwarded to all the registered output {@link Handler} objects.
 * 
 * @param msg The string message (or a key in the message catalog)
 */
module.exports.Logger.prototype.finer = function(msg) {
	if (Level.FINER.value < module.exports.Logger.levelValue) { 
	    return; 
	} 
	
	this.log(Level.FINER, msg);
};

/**
 * Log a {@link Level#FINEST} message.
 * If the logger is currently enabled for the {@link Level#FINEST} message level then the given message is 
 * 	forwarded to all the registered output {@link Handler} objects.
 * 
 * @param msg The string message (or a key in the message catalog)
 */
module.exports.Logger.prototype.finest = function(msg) {
	if (Level.FINEST.value < module.exports.Logger.levelValue) { 
	    return; 
	} 
	
	this.log(Level.FINEST, msg);
};

