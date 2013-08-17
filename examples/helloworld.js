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
var logging = require("../lib/logging");
 
// .configure(BasicConfiguration) adds a ConsoleHandler and sets the level to INFO.
var logger = logging.get(module).configure(logging.BasicConfiguration); 

function hello_world() {
	logger.severe("Hello World!");
	logger.warning("Hello World!");
	logger.info("Hello World!");

	// These messages aren't shown when the level of the logger is higher
	//  than the level of these messages
	logger.config("Hello World!");
	logger.debug("Hello World!");
}

hello_world(); // CONFIG and DEBUG aren't shown.

logger.setLevel(logging.Level.DEBUG);
hello_world();

