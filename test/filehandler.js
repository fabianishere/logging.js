/**
 * Hello world for NodeLog.
 *
 * @author Fabian M.
 */
var FileHandler = require('../lib/handler/file')
var logger = require('../lib/logger').getLogger("HelloWorldService").addHandler(new FileHandler("file.log"));

logger.info("This will be printed to a file");