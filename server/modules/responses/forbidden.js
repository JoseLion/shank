module.exports = function (code, message, extraData) {
    // Set status code
    this.status(code || 403);
    this.send({
        response: {},
        error: message || 'Esta solicitud está prohibida'
    });
};