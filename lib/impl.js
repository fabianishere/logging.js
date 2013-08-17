/*
 * Copyright 2013 Fabian M.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var util = require("util"), fs = require("fs");
var Level = require("./level"), Handler = require("./handler");

/* 
 * This {@link Handler} publishes log records to <code>STDERR</code>. 
 * By default the {@link SimpleFormatter} is used to generate brief summaries.
 * 
 * @author Fabian M.
 */
function ConsoleHandler(level, formatter) {
	this.level = level || Level.ALL;
	this.formatter = formatter || new SimpleFormatter();
	this.publish = function(record) {
		if (this.logable(record)) 
			console.error(this.formatter.format(record));
	};
}

util.inherits(ConsoleHandler, Handler);

/** 
 * This {@link Handler} publishes log records to a file.
 * By default the {@link SimpleFormatter} is used to generate brief summaries.
 * 
 * @param path The path to the file to log in.
 * @author Fabian M.
 */
function FileHandler(path, level, formatter) {
	this.level = level || Level.ALL;
	this.formatter = formatter || new SimpleFormatter();
	var file = fs.openSync(path, 'a');
	this.publish = function(record) {
		if (this.logable(record)) 
			fs.writeSync(file, this.formatter.format(record) + "\n");
	};
}

util.inherits(FileHandler, Handler);


/**
 * Print a brief summary of the {@link LogRecord} in a human readable format.
 * The summary will typically be 1 or 2 lines.
 * 
 * @author Fabian M.
 */
function SimpleFormatter() {
	this.format = function(record) {
		var message = record.date.toUTCString() + " " + record.logger.name 
			+ ":" + record.frame.getFunctionName() + "\n";
		message += record.level.name + ": ";
		
		if (record.message instanceof Error) {
			message += record.message.message + "\n";
			/*
			 * Adds the stacktrace but removes the header that looks like:
			 *
			 * 	Error: message.
			 *
			 * as it is already logged as:
			 *
			 *	SEVERE: message.
			 *
			 */			
			message += record.message.stack.split("\n").slice(1).join("\n");
			return message;
		}
		message += record.message
		return message;
	};
}

module.exports = {};
module.exports.ConsoleHandler = ConsoleHandler;
module.exports.FileHandler = FileHandler;
module.exports.SimpleFormatter = SimpleFormatter;
