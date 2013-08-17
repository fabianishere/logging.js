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
 * Handler object takes log messages from a Logger and exports them. 
 *
 * @author Fabian M.
 */
function Handler() {
	this.level = Level.ALL;
	this.formatter = null;
	return this;
}

/*
 * Publish a LogRecord.
 *
 * @param record The LogRecord to publish.
 */
Handler.prototype.publish = function(record) {};

/*
 * Checks if the given Handler is a valid Handler.
 *
 * @return <code>true</code> if the Handler is valid, <code>false</code> otherwise.
 */
Handler.validHandler = function(handler) {
	return handler != null && !!(handler.publish 
			&& handler.publish.constructor && handler.publish.call 
			&& handler.publish.apply);
};

/*
 * Check if this Handler would actually log a given LogRecord.
 *
 * @param record The LogRecord to check.
 * @return <code>true</code> if this Handler would actually log a given LogRecord, 
 *	<code>false</code> otherwise
 */
Handler.prototype.logable = function(record) {
	return record.level.value >= this.level.value; 
};
module.exports = Handler;
