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
var path = require("path"), impl = require("./impl");
var Handler = require("./handler"), Level = require("./level"), LogRecord = require("./record");
var loggers = [], root = null;

/*
 * A {@link Logger} object is used to log messages for a specific system or 
 *	application module.
 *
 * @param module The module of this Logger instance.
 */
function Logger(module) {
	this.handlers = [];
	this.levels = {};

	// Initialize variables that depend on parameters.
	if (module == "root") {
		this.name = "root";
		return this;
	}
	if (module == null || typeof module !== 'object') {
		return;
	}
	var parent;
	if (!module.parent) {
		parent = Logger.root();
	} else {
		parent = new Logger(parent);
	}
	
	this.module = module;
	this.parent = parent;
	this.name = path.basename(this.module.filename, path.extname(this.module.filename));
	this.pkg = this._find_pkg();
	this.setLevels(parent.levels);
	this.setLevel(parent.level);
	
	return this;
}

/*
 * Find or create a logger for a module.
 *
 * @param module The module of the logger to find or create.
 * @return The logger that has been found or has been created.
 */
Logger.get = function(module) {
	for (var index = 0; index < loggers.length; index++) {
		if (loggers[index].module == module) {
			return loggers[index];
		}
	}
	var logger = new Logger(module);
	loggers.push(logger);
	return logger;
};

/*
 * Returns the root Logger.
 * 
 * @return The root Logger.
 */
Logger.root = function() {
	if (root) {
		return root;
	}
	root = new Logger("root");
	root.setLevels(Level);
	root.setLevel(Level.INFO);
	return root;
};

/*
 * Configures this Logger.
 *
 * @param configuration The configuration to use.
 * @return This logger.
 */
Logger.prototype.configure = function(configuration) {
	if (configuration == null || typeof configuration !== 'object') {
		return this;
	}
	if (configuration.handlers) {
		this.handlers = this.handlers.concat(configuration.handlers);
	}
	this.setLevels(configuration.levels || this.levels);
	this.setLevel(configuration.level || this.level);
	return this;
};

/*
 * Adds a new Handler to this Logger.
 *
 * @param handler The handler to add.
 */
Logger.prototype.addHandler = function(handler) {
	if (handler) {
		this.handlers.push(handler);
	}
};

/*
 * Removes the given Handler from this Logger.
 *
 * @param handler The handler to remove.
 */
Logger.prototype.removeHandler = function(handler) {
	return this.handlers.remove(handler);
};

/*
 * Set the possible Levels for this Logger. 
 *
 * @param levels An object containing possible level with name and priority.
 */
Logger.prototype.setLevels = function(levels) {
	if (levels == null || typeof levels !== 'object') {
		return;
	}
	
	// Remove old logging methods.
	for (var key in this.levels) {
		if (levels.hasOwnProperty(key)) {
			this[key.toLowerCase()] = null;
		}
	}
	this.levels = levels
	
	// Create new logging methods.
	for (var key in this.levels) {
		if (levels.hasOwnProperty(key) && !this[key] &&
				this.validLevel(this.levels[key]) && this.levels[key].ignore != true) {
			this[key.toLowerCase()] = (function(level) { 
				return function() {
					this.log.apply(this, [level].concat(Array.prototype.slice.call(arguments)));
				};
			})(this.levels[key]);
		}
	}
};

/*
 * Set the Level for this Logger.
 *
 * @param level The Level to set for this Logger.
 */
Logger.prototype.setLevel = function(level) {
	if (this.validLevel(level)) {
		this.level = level;
	}
};

/*
 * Check if this Logger would actually log a given LogRecord.
 *
 * @param record The LogRecord to check.
 * @return <code>true</code> if this Logger would actually log a given LogRecord, 
 *	<code>false</code> otherwise
 */
Logger.prototype.logable = function(record) {
	return record.level.value >= this.level.value; 
};

/*
 * Logs the given message with the given level.
 *
 * @param level The level of this message.
 * @param message The message to log.
 */
Logger.prototype.log = function(level, message) {
	if (!level) {
		return;
	}
	if (typeof message == 'string' || message instanceof String) {
		var args = Array.prototype.slice.call(arguments).slice(2);
	 	message = message.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	}
	var record = new LogRecord(this, level, message);
	for (var index = 0; index < this.handlers.length; index++) {
		if (this.logable(record)) {
			this.handlers[index].publish(record);
		}
	}
	if (this.parent) {
		this.parent.log.apply(this.parent, Array.prototype.slice.call(arguments));
	}
};

/*
 * Checks if the given Level is a valid Level for <b>this</b> Logger.
 *
 * @return <code>true</code> if the Level is valid, <code>false</code> otherwise.
 */
Logger.prototype.validLevel = function(level) {
	return level != null && typeof level === 'object' && level.name && 
		level.value && (level.name in this.levels);
};

/*
 * Finds the package of this Logger's module.
 *
 * @return The package of the module represented as a dot-separated name.
 */
Logger.prototype._find_pkg = function() {
	var search_path = module.paths;
	if (process.env["NODE_PATH"])
		search_path = search_path.concat(process.env["NODE_PATH"].split(":"));
	var correct_path = "";
	
	for (index = 0; index < search_path.length; index++) {
		var search_split = path.resolve(search_path[index]).split(path.sep);
		var module_path_split = this.module.filename.split(path.sep);
		var split_index = 0;
		
		while (true) {
			if (split_index >= search_split.length || 
				split_index >= module_path_split.length) {
				correct_path = search_path[index];
				break;
			}
			if (search_split[split_index] != module_path_split[split_index]) {
				break;
			}
			split_index++;
		}
	}
	if (correct_path == "") {
		return this.name;
	}
	return path.relative(correct_path, this.module.filename).replace(path.sep, '.');	
};

/*
 * Basic configuration for a Logger.
 * To use this configuration, call .configure() and use this object as parameter.
 */
Logger.BasicConfiguration = {
	level : Level.INFO,
	handlers : [new impl.ConsoleHandler()]
};

Logger.Handler = Handler;
Logger.LogRecord = LogRecord;
Logger.Level = Level;
Logger.impl = impl;

module.exports = Logger;
