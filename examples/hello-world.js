var logging = require("../lib/logging"), logger = logging.get(module);

function main() {
	logger.info("Hello World!");
	logger.severe("Help!");
	logger.warning("Test {0} {1} {2}", 1, 2, 3);
}
main();