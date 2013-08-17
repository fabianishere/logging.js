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
 * <li>DEBUG</li>
 * </ul>
 */
module.exports = {
	/*
	 * ALL indicates that all messages should be logged. This level is initialized
	 * 	to {@link Number#MIN_VALUE}.
	 *
	 * The ignore field is to let the Logger know not to add a all log method.
	 */
	ALL : {name : "ALL", value : Number.MIN_VALUE, ignore : true},
	
	/*
	 * DEBUG is a message level for debug messages. This level is initialized
	 * 	to 10.
	 */
	DEBUG : {name : "DEBUG", value : 10},
	
	/*
	 * CONFIG is a message level for static configuration messages. This 
	 *	level is initialized to 20.
	 */
	CONFIG : {name : "CONFIG", value : 20},
	
	/*
	 * INFO is a message level for informational messages. This level is 
	 *	initialized to 30.
	 */
	INFO : {name : "INFO", value : 30},
	
	/*
	 * WARNING is a message level indicating a potential problem. This level is
	 *	initialized to 40.
	 */
	WARNING : {name : "WARNING", value : 40},
	
	/*
	 * SEVERE is a message level indicating a serious failure. This level is
	 *	initialized to 50.
	 */
	SEVERE : {name : "SEVERE", value : 50},
	
	/*
	 * OFF is a special level that can be used to turn off logging. 
	 *	This level is initialized to {@link Number#MAX_VALUE}.
	 */
	OFF : {name : "OFF", value : Number.MAX_VALUE, ignore : true}
};
