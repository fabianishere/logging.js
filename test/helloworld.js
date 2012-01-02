/**
 * Hello world for NodeLog.
 *
 * @author Fabian M.
 */
var logger = require('../lib/logger').getLogger("HelloWorld");

logger.severe("Hello world");
logger.warning("Hello world");
logger.info("Hello world");
logger.config("Hello world");

// These messages aren't shown because the levelValue is higher that the 
// 	values of FINE, FINER and FINEST.
logger.fine("Hello world");
logger.finer("Hello world");
logger.finest("Hello world");
