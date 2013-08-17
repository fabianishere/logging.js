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
 
/*
 * {@link LogRecord} objects are used to pass logging requests between the logging framework and individual log Handlers.
 * When a {@link LogRecord} is passed into the logging framework it logically belongs to the framework 
 * 	and should no longer be used or updated by the client application.
 * 
 * @param level A logging level value
 * @param message The raw non-localized logging message (may be null)
 * @author Fabian M.
 */
function LogRecord(logger, level, message) {
	this.logger = logger;
	this.level = level;
	this.message = message;
	this.date = new Date();
	
	// Get the function that called the logging method.
	var prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error, stack) {
		return stack;
	};
  	var obj = {};
  	Error.captureStackTrace(obj, logger[level.name.toLowerCase()]);
  	this.frame = obj.stack[0];
  	Error.prepareStackTrace = prepareStackTrace;
  	
	return this;
}

module.exports = LogRecord;
