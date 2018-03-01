module.exports.delay = (timeout, arg1, arg2) => {
    return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, arg1, arg2), timeout)
    });
}