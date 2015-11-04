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
var path = require("path"), util = require("util"), fs = null;
var cache = {}, root = null;

/**
 * Logging.js is a lightweight logging library for Node.js based on the 
 *	java.util.logging library.
 */
function logging() {}

/**
 * Return the root {@link logging.Logger} instance.
 *
 * @return The root {@link logging.Logger} instance. 
 */
logging.root = function() {
	return root || (root = new logging.Logger("root"));
};

/**
 * Return a new {@link logging.Logger} instance if it doesn't exist already,
 *	return the one from the cache otherwise.
 *
 * @param module The module to get the {@link logging.Logger} instance of.
 * @return The {@link logging.Logger} instance.
 */
logging.get = function(module) {
	if (cache.hasOwnProperty(module))
		return cache[module];
	return cache[module] = new logging.Logger(module);
};

/**
 * A {@link logging.Logger} object is used to log messages for a specific 
 *	system or application module.
 *
 * @param module The module of to create a {@link logging.Logger} instance for.
 */
logging.Logger = function(module) {
	var instance = this;
	var levels = {};

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
	this.useParentHandlers = true;
	
	var name = null, parent = null;
	
	if (typeof module === 'string') {
		name = module;
		module = null;
		
		if (name != "root") {
			var split = name.split(".");
			split.pop();
			parent = split.length < 1 ? logging.root() : logging.get(split.join("."));
		}
	} if (module == null || typeof module !== 'object') {
		return;
	} else {
		name = path.basename(module.filename);
		parent = module.parent == null ? logging.root() : logging.get(module);
	}
	
	Object.defineProperty(this, "name", {value : name, writable : false});
	Object.defineProperty(this, "module", {value : module, writable : false});
	Object.defineProperty(this, "parent", {value : parent, writable : false});
	return this;
};

/**
 * Configure a {@link logging.Logger} instance.
 *
 * @param config The configuration object to configure the logger with.
 * @return The {@link logging.Logger} instance.
 */
logging.Logger.prototype.configure = function(config) {
	if (config == null || typeof config !== "object")
		return this;
	if (config.handler)
		this.handlers = [];
	module.paths = this.module ? this.module.paths.concat(module.paths) : module.paths;
	for (var index = 0; index < config.handlers.length; index++) {
		var handlerConfig = config.handlers[index];
		if (typeof handlerConfig === "string") {
			this.handlers.push(new resolve(handlerConfig)());
		} else if (handlerConfig instanceof logging.Handler) {
			this.handlers.push(handlerConfig);
		} else if (handlerConfig != null && handlerConfig === "object") {
			var constructor = resolve(handlerConfig.name);
			var instance = Object.create(constructor);
			var handler = constructor.apply(instance, [] || handlerConfig.arguments);
			
			if (typeof handlerConfig.filter === "string")
				handler.filter = resolve(handlerConfig.filter);
			else if (!!(handlerConfig.filter && handlerConfig.filter.constructor 
					&& handlerConfig.filter.call && handlerConfig.filter.apply))
				handler.filter = handlerConfig.filter;
					
			if (typeof handlerConfig.level === "string")
				handler.level = this.levels[handlerConfig.level];
			else if(handlerConfig.level && handlerConfig.level.value && handlerConfig.level.name)
				handler.level = handlerConfig.level;
				
			if (typeof handlerConfig.formatter === "string")
				handler.formatter = resolve(handlerConfig.formatter);
			else if (!!(handlerConfig.formatter && handlerConfig.formatter.constructor 
					&& handlerConfig.formatter.call && handlerConfig.formatter.apply))
				handler.formatter = handlerConfig.formatter;;
			this.handlers.push(handler);
		}
	}
	if (config.levels)
		this.levels = levels;
	if (config.level)
		this.level = this.levels[level];
	return this;
};

/**
 * Reset the configuration of a {@link logging.Logger} instance.
 *
 * @return The {@link logging.Logger} instance with its configuration
 *	reset.
 */
logging.Logger.prototype.reset = function() {
	this.levels = logging.Levels;
	this.level = this.levels.INFO;
	this.filter = function(record) { return true; };
	this.handlers = [];
	this.useParentHandlers = true;
	return this;
};

/**
 * Determine whether the given level is high enough to be logged by a 
 *	{@link logging.Logger} instance.
 *
 * @param level The level to check.
 * @return <code>true</code> if the given level is high enough to be logged
 *	by this {@link logging.Logger} instance, <code>false</code> otherwie.
 */
logging.Logger.prototype.isLoggable = function(level) {
	return level.value >= this.level.value;
};

/**
 * Log the given message with the given level.
 *
 * @param level The level of this message.
 * @param message The message to log.
 */
logging.Logger.prototype.log = function(level, message) {
	var record = new logging.Record(level, message);
	record.loggerName = this.name;
	record.parameters = arguments;
	record.parameters =  Array.prototype.slice.call(record.parameters).slice(2);
	
	if (message instanceof Error) {
		record.message = null;
		record.thrown = message;
	}
	record.inferCaller();
	this.logr(record);
};

/**
 * Log a {@link logging.Record} instance.
 *
 * @param record The {@link logging.Record} instance to log.
 */
logging.Logger.prototype.logr = function(record) {
	if (!this.isLoggable(record.level))
		return;
	if (this.filter && !this.filter(record))
		return;
	this.handlers.forEach(function(handler) {
		if (handler.isLoggable(record))
			handler.publish(record);
	});
	if (this.parent && this.useParentHandlers)
		this.parent.logr(record);
};

/**
 * {@link logging.Record} objects are used to pass logging requests between the 
 *	logging framework and individual log handlers.
 * When a {@link logging.Record} is passed into the logging framework it 
 *	logically belongs to the framework and should no longer be used or updated 
 *	by the client application.
 *
 * When creating a new {@link logging.Record}, the {@link logging.Record#date} 
 *	property will be set to the current time, the {@link logging.Record#level} 
 *	and the {@link logging.Record#message} properties will be set and the other 
 *	properties will be initialised to empty values.
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
	this.frame = {};
	return this;
};

/**
 * Infer the caller's module and method name.
 *
 * @param filter A function to filter the stack frame.
 */
logging.Record.prototype.inferCaller = function(filter) {
	filter = filter || function(stack) {
		for (var index = stack.length; index > 0; index--)
			if (stack[index - 1].getFileName() == __filename)
				return stack[index];
	};
	var prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error, stack) {
		return stack;
	};
	this.frame = filter(new Error().stack);
	Error.prepareStackTrace = prepareStackTrace;
};

/**
 * A {@link logging.Handler} object takes log messages from a Logger and exports
 * 	them. 
 * It might for example, write them to a console or write them to a file, or 
 *	send them to a network logging service, or forward them to an OS log, or 
 *	whatever.
 * A {@link logging.Handler can be disabled by doing a 
 *	<code>this.level = logging.level.OFF</code> and can be re-enabled by doing a 
 *	<code>this.level</code> assignment with an appropriate level.
 */
logging.Handler = function() {	
	this.formatter = function(record) { return record.message };
	this.level = logging.Levels.ALL;
	this.filter = function(record) { return true; }
};

/*
 * Publish a {@link logging.Record}.
 *
 * @param record The {@link logging.Record} to publish.
 */
logging.Handler.prototype.publish = function(record) {};

/**
 * Determine whether this {@link logging.Handler} would actually log a given 
 *	{@link logging.Record}.
 *
 * @param record The {@link logging.Record} to check.
 * @return <code>true</code> if this {@link logging.Handler} would actually log 
 *	the given {@link logging.Record}, <code>false</code> otherwise.
 */
logging.Handler.prototype.isLoggable = function(record) {
	return record.level.value >= this.level.value; 
};

/**
 * The {@link logging.Level} object defines a set of standard logging levels 
 *	that can be used to control logging output.
 * The logging {@link Level} objects are ordered and are specified by ordered 
 * 	integers. 
 * Enabling logging at a given level also enables logging at all higher levels. 
 * Clients should normally use the predefined {@link logging.Level} constants 
 *	such as {@link logging.Level#SEVERE}. 
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
	/**
	 * ALL indicates that all messages should be logged. This level is initialised
	 * 	to {@link Number#MIN_VALUE}.
	 *
	 * The ignore field is to let the {@link Logger} know not to add an all log method.
	 */
	ALL : {name: "ALL", value: Number.MIN_VALUE, ignore: true},

	/**
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
	FINE : {name: "FINE", value: 500, color: "magenta"},

	/**
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
	CONFIG : {name: "CONFIG", value: 700, color: "cyan"},

	/**
	 * INFO is a message level for informational messages. 
	 *
	 * Typically INFO messages will be written to the console or its equivalent. 
	 * So the INFO level should only be used for reasonably significant 
	 * 	messages that will make sense to end users and system administrators. 
	 * 
	 * This level is initialised to 800.
	 */
	INFO : {name: "INFO", value: 800, color: "blue"},

	/**
	 * WARNING is a message level indicating a potential problem. 
	 *
	 * In general WARNING messages should describe events that will be of 
	 *	interest to end users or system managers, or which indicate 
	 *	potential problems 
	 *
	 * This level is initialised to 900.
	 */
	WARNING : {name: "WARNING", value: 900, color: "yellow"},

	/**
	 * SEVERE is a message level indicating a serious failure.
	 *
	 * In general SEVERE messages should describe events that are of 
	 *	considerable importance and which will prevent normal program execution. 
	 * They should be reasonably intelligible to end users and to 
	 *	system administrators.
	 * 
	 * This level is initialised to 1000.
	 */
	SEVERE : {name: "SEVERE", value: 1000, color: "red"},

	/**
	 * OFF is a special level that can be used to turn off logging. 
	 *	This level is initialised to {@link Number#MAX_VALUE}.
	 */
	OFF : {name: "OFF", value: Number.MAX_VALUE, ignore: true}
};

/**
 * Formatters for messages published by {@link logging.Handler} instances.
 */
logging.formatter = function() {}

/**
 * Format the given message with the given arguments.
 *
 * @param message The message to format.
 * @param varargs The arguments.
 * @return The formatted message.
 */
logging.formatter.format = function(message, varargs) {
	if (!(typeof message == 'string' || message instanceof String))
		return message;
	var args = varargs;
	message = message.replace(/{(\d+)}/g, function(match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
	return message;
};

/**
 * Print a brief summary of the {@link logging.Record} in a human readable 
 *	format. 
 * The summary will typically be 1 or 2 lines.
 *
 * @param record The record to format.
 */
logging.formatter.SimpleFormatter = function(record) {
	var message = record.date.toUTCString() + " " + record.loggerName 
				+ ":" + (record.frame ? record.frame.getFunctionName() : "null") + "\n";
	message += record.level.name + ": ";
	message += logging.formatter.format(record.message, record.parameters);
	if (message.thrown)
		message += record.thrown.stack.split("\n").slice(1).join("\n");
	return message;
};

/**
 * Basic {@link logging.Handler} implementations.
 */
logging.handler = function() {}

/**
 * This {@link logging.Handler} publishes log records to <code>STDERR</code>. 
 * By default the {@link logging.formatter.SimpleFormatter} is used to generate
 * 	brief summaries.
 * 
 * @author Fabian M.
 */
logging.handler.ConsoleHandler = function() {
	logging.Handler.call(this);
	this.formatter = logging.formatter.SimpleFormatter;
	this.publish = function(record) {
		console.error(this.formatter(record));
	};
}

util.inherits(logging.handler.ConsoleHandler, logging.Handler);

/** 
 * This {@link logging.Handler} publishes log records to a file.
 * By default the {@link logging.formatterSimpleFormatter} is used to generate 
 *	brief summaries.
 * 
 * @param path The path to the file to log in.
 * @author Fabian M.
 */
logging.handler.FileHandler = function(path) {
	logging.Handler.call(this);
	fs = fs || require("fs");
	this.formatter = logging.formatter.SimpleFormatter;
	var file = fs.openSync(path, 'a');
	this.publish = function(record) {
		if (this.logable(record)) 
			fs.writeSync(file, this.formatter(record) + "\n");
	};
}

util.inherits(logging.handler.FileHandler, logging.Handler);

/**
 * Resolve the given path and return the object.
 *
 * @param path The path to resolve.
 * @param object The object to use.
 * @return The found object.
 */
function resolve(obj, path) {
	var split;
	if (typeof obj == "string" && !path) {
		split = obj.split(":");
		if (split.length < 1)
			split = [obj];
		return resolve(require(split.shift()), split);
	} else if (!path) {
		return obj;
	}
	split = path.split(":");
	if (split.length < 1)
		return obj;
	return resolve(obj[split.shift()], split.join(":"));
}

/*
 * Basic configuration for a {@link logging.Logger} instance.
 */
logging.BasicConfiguration = {
	handlers: [new logging.handler.ConsoleHandler()]
};

/*
 * Apply the {@link logging.BasicConfiguration} to the root 
 *	{@link logging.Logger} instance so you don't have to configure every 
 *	{@link logging.Logger} instance to print some logs.
 *
 * If you don't want the {@link logging.BasicConfiguration} on your root 
 * 	{@link logging.Logger} instance, just call {@link logging.Logger#reset()} 
 *	on it.
 */
logging.root().configure(logging.BasicConfiguration);

module.exports = logging;
