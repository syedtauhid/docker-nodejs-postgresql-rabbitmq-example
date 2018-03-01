function exitHandler(options, err) {
    if (options.cleanup) options.cleanupFunction();
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

module.exports.setExitHandler = (cleanupFunction) => {
    process.on('exit', exitHandler.bind(null, {
        cleanup: true,
        cleanupFunction: cleanupFunction
    }));
    process.on('SIGINT', exitHandler.bind(null, {
        exit: true
    }));
    process.on('SIGUSR1', exitHandler.bind(null, {
        exit: true
    }));
    process.on('SIGUSR2', exitHandler.bind(null, {
        exit: true
    }));
    process.on('uncaughtException', exitHandler.bind(null, {
        exit: true
    }));
}