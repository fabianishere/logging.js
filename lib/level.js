/**
 * The {@link Level} object defines a set of standard logging levels 
 *	that can be used to control logging output.
 * The logging Level objects are ordered and are
 * 	specified by ordered integers. 
 * Enabling logging at a given level also enables
 * 	logging at all higher levels. 
 * Clients should normally use the predefined
 * 	{@link Level} constants such as {@link Level#SEVERE}. 
 * The levels in descending order are:
 * <ul>
 * <li>SEVERE (highest value)</li>
 * <li>WARNING</li>
 * <li>INFO</li>
 * <li>CONFIG</li>
 * <li>FINE</li>
 * <li>FINER</li>
 * <li>FINEST (lowest value)</li>
 * </ul>
 * 
 * @param name
 *            The name of the {@link Level}, for example "SEVERE".
 * @param value
 *            An integer value for the level.
 * @version 1.3
 * @author Fabian M.
 */
var Level = function(name, value) {
	if (typeof name != 'string' || typeof value != 'number')
		return null;
	/**
	 * The non-localized name of the level.
	 */
	this.name = name;
	/**
	 * The integer value of the level.
	 */
	this.value = value;
};
/**
 * Converts a {@link Level} object to a string.
 */
Level.prototype.toString = function() {
	return this.value;
};
/**
 * Compares one {@link Level} to the other.
 * 
 * @param other
 *            The {@link Level} to compare this {@link Level} with.
 */
Level.prototype.equals = function(other) {
	if (typeof other.value != 'number')
		return false;
	return number == other.value;
};

/**
 * {@link Level#OFF} is a special level that can be used to turn off logging.
 * This level is initialized to {@link Number#MAX_VALUE}.
 */
Level.OFF = new Level("OFF", Number.MAX_VALUE),
/**
 * {@link Level#SEVERE} is a message level indicating a serious failure. 
 * In general {@link Level#SEVERE} messages should describe events that are of
 * 	considerable importance and which will prevent normal program execution. 
 * They should be reasonably intelligible to end users and to system administrators.
 * This level is initialized to 1000.
 */
Level.SEVERE = new Level("SEVERE", 1000),
/**
 * {@link Level#WARNING} is a message level indicating a potential problem.
 * In general {@link Level#WARNING} messages should describe events that will be of
 * 	interest to end users or system managers, or which indicate potential problems. 
 * This level is initialized to 900.
 */
Level.WARNING = new Level("WARNING", 900),
/**
 * {@link Level#INFO} is a message level for informational messages. 
 * Typically {@link Level#INFO} messages will be written to the console or its equivalent.
 * So the {@link Level#INFO} level should only be used for reasonably
 * 	significant messages that will make sense to end users and system admins.
 * This level is initialized to 800.
 */
Level.INFO = new Level("INFO", 800),
/**
 * {@link Level#CONFIG} is a message level for static configuration messages.
 * {@link Level#CONFIG} messages are intended to provide a variety of static
 * 	configuration information, to assist in debugging problems that may be
 * 	associated with particular configurations. 
 * For example, {@link Level#CONFIG}
 * 	message might include the CPU type, the graphics depth, the GUI
 * 	look-and-feel, etc.
 * This level is initialized to 700.
 */
Level.CONFIG = new Level("CONFIG", 700),
/**
 * {@link Level#FINE} is a message level providing tracing information. 
 * All of {@link Level#FINE}, {@link Level#FINER}, and {@link Level#FINEST} are
 * 	intended for relatively detailed tracing. 
 * The exact meaning of the three levels will vary between subsystems, 
 *	but in general, {@link Level#FINEST} should be used 
	for the most voluminous detailed output, {@link Level#FINER}
 * 	for somewhat less detailed output, and {@link Level#FINE} for the lowest
 * 	volume (and most important) messages. 
 * In general the {@link Level#FINE} level should be used 
 *	for information that will be broadly interesting to developers
 * 	who do not have a specialized interest in the specific subsystem.
 * {@link Level#FINE} messages might include things like minor (recoverable) failures. 
 * Issues indicating potential performance problems are also worth
 * 	logging as {@link Level#FINE}. 
 * This level is initialized to 500.
 */
Level.FINE = new Level("FINE", 500),
/**
 * {@link Level#FINER} indicates a fairly detailed tracing message. 
 * By default logging calls for entering, returning, or throwing an 
 *	exception are traced at this level. 
 * This level is initialized to 400.
 */
Level.FINER = new Level("FINER", 400),
/**
 * {@link Level#FINEST} indicates a highly detailed tracing message. 
 * This level is initialized to 300.
 */
Level.FINEST = new Level("FINEST", 300),
/**
 * {@link Level#ALL} indicates that all messages should be logged. 
 * This level is initialized to {@link Number#MIN_VALUE}.
 */
Level.ALL = new Level("ALL", Number.MIN_VALUE);

module.exports = Level;
