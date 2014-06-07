/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Fabian M. <mail.fabianm@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var path = require("path");

/*
 * Logging.js is a lightweight logging library for Node.js based on the 
 *	java.util.logging package.
 */
function logging() {
	this.singleton = new logging.LoggerFactory();
	return this;
}

/* 
 * Return a new {@link Logger} instance if it doesn't exist already,
 *	return the one from the cache otherwise.
 *
 * @param module The module to get the {@link Logger} instance of.
 * @return The {@link Logger} instance.
 */
logging.prototype.get = function(module) {
	return this.singleton.get(module);
};

/*
 * A {@link LoggerFactory} creates new {@link Logger} instances.
 */
logging.LoggerFactory = function() {
	this.cache = {};
	return this;
};

/* 
 * Return a new {@link Logger} instance if it doesn't exist already,
 *	return the one from the cache otherwise.
 *
 * @param module The module to get the {@link Logger} instance of.
 * @return The {@link Logger} instance.
 */
logging.LoggerFactory.prototype.get = function(module) {
	if (this.cache.hasOwnProperty(module))
		return this.cache[module];
	return this.cache[module] = new logging.Logger(module);
};

/*
 * A {@link Logger} object is used to log messages for a specific system or 
 *	application module.
 *
 * @param module The module of this {@link Logger} instance.
 */
logging.Logger = function(module) {
	var instance = this;
	Object.defineProperty(this, "module", {value : module, writable : false});
	Object.defineProperty(this, "name", {value : path.basename(module.filename), 
		writable : false});
		
	var levels = {}
	Object.defineProperty(this, "levels", {
		get : function() {
			return levels; 
		},
		set : function(value) {
			for (var key in levels) {
				instance[levels[key].name.toLowerCase()] = null;
			}
			for (var key in value) {
				if (value[key].ignore)
					continue;
				instance[value[key].name.toLowerCase()] = (function(level) {
					return function() {
						instance.log.apply(this, [level].concat(Array.prototype.slice.call(arguments)));
					};
				})(value[key]);
			}
			levels = value;
		}
	});
	this.levels = logging.Levels;
	this.level = this.levels.INFO;
	this.filter = function(record) { return true; };
	this.handlers = [];
	return this;
};

/*
 * Determines whether the given level is high enough to be logged by this 
 *	{@link Logger} instance.
 *
 * @param level The level to check.
 * @return <code>true</code> if the given level is high enough to be logged
 *	by this {@link Logger} instance, <code>false</code> otherwie.
 */
logging.Logger.prototype.isLoggable = function(level) {
	return level.value >= this.level.value;
};

/*
 * Logs the given message with the given level.
 *
 * @param level The level of this message.
 * @param message The message to log.
 */
logging.Logger.prototype.log = function(level, message) {
	var record = new logging.Record(level, message);
	if (message instanceof Error) {
		record.message = null;
		record.thrown = message;
	}
	record.parameters = arguments;
	record.parameters =  Array.prototype.slice.call(record.parameters).slice(2);
	
	this.logr(record);
};

/*
 * Logs the given {@link logging.Record} instance.
 *
 * @param record The {@link logging.Record} instance to log.
 */
logging.Logger.prototype.logr = function(record) {
	if (!this.isLoggable(record.level))
		return;
	if (this.filter && !this.filter(record))
		return;
	this.handlers.forEach(function(handler) {
		handler(record);
	});
};

/*
 * {@link Record} objects are used to pass logging requests between the logging 
 *	framework and individual log handlers.
 * When a {@link Record} is passed into the logging framework it logically 
 * 	belongs to the framework and should no longer be used or updated by the 
 *	client application.
 *
 * When creating a new {@link Record}, the {@link Record#date} property will 
 *	be set to the current time, the {@link Record#level} and the 
 * 	{@link Record#message} properties will be set and the other properties 
 *	will be initialised to empty values.
 * 
 * @param level A logging level value
 * @param message The raw non-localised logging message (may be null)
 */
logging.Record = function(level, message) {
	this.level = level;
	this.message = message;
	this.date = new Date();
  	this.loggerName = "";
	this.parameters = [];
	this.thrown = null;
	return this;
}


/**
 * The {@link Level} object defines a set of standard logging levels that can be 
 *	used to control logging output.
 * The logging Level objects are ordered and are specified by ordered integers. 
 * Enabling logging at a given level also enables logging at all higher levels. 
 * Clients should normally use the predefined {@link Level} constants such as 
 *	{@link Level#SEVERE}. 
 * The levels in descending order are:
 * <ul>
 * 	<li>SEVERE (highest value)</li>
 * 	<li>WARNING</li>
 * 	<li>INFO</li>
 * 	<li>CONFIG</li>
 * 	<li>FINE (lowest value)</li>
 * </ul>
 */
logging.Levels = {
	/*
	 * ALL indicates that all messages should be logged. This level is initialised
	 * 	to {@link Number#MIN_VALUE}.
	 *
	 * The ignore field is to let the {@link Logger} know not to add an all log method.
	 */
	ALL : {name : "ALL", value : Number.MIN_VALUE, ignore : true},

	/*
	 * FINE is a message level providing tracing information.
	 *
	 * In general the FINE level should be used for information that will be 
	 *	broadly interesting to developers who do not have a specialized interest
	 * 	in the specific subsystem.
	 * FINE messages might include things like minor (recoverable) failures. 
	 * Issues indicating potential performance problems are also worth logging 
	 *	as FINE
	 *
	 * This level is initialised to 500.
	 */
	FINE : {name : "FINE", value : 500},

	/*
	 * CONFIG is a message level for static configuration messages. 
	 *
	 * CONFIG messages are intended to provide a variety of static configuration 
	 *	information, to assist in debugging problems that may be associated with 
	 * 	particular configurations. 
	 * For example, CONFIG message might include the CPU type, the graphics 
	 *	depth, the GUI look-and-feel, etc. 
	 *
	 * This level is initialised to 700.
	 */
	CONFIG : {name : "CONFIG", value : 700},

	/*
	 * INFO is a message level for informational messages. 
	 *
	 * Typically INFO messages will be written to the console or its equivalent. 
	 * So the INFO level should only be used for reasonably significant 
	 * 	messages that will make sense to end users and system administrators. 
	 * 
	 * This level is initialised to 800.
	 */
	INFO : {name : "INFO", value : 800},

	/*
	 * WARNING is a message level indicating a potential problem. 
	 *
	 * In general WARNING messages should describe events that will be of 
	 *	interest to end users or system managers, or which indicate 
	 *	potential problems 
	 *
	 * This level is initialised to 900.
	 */
	WARNING : {name : "WARNING", value : 900},

	/*
	 * SEVERE is a message level indicating a serious failure.
	 *
	 * In general SEVERE messages should describe events that are of 
	 *	considerable importance and which will prevent normal program execution. 
	 * They should be reasonably intelligible to end users and to 
	 *	system administrators.
	 * 
	 * This level is initialised to 1000.
	 */
	SEVERE : {name : "SEVERE", value : 1000},

	/*
	 * OFF is a special level that can be used to turn off logging. 
	 *	This level is initialised to {@link Number#MAX_VALUE}.
	 */
	OFF : {name : "OFF", value : Number.MAX_VALUE, ignore : true}
};

module.exports = new logging();