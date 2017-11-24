module.exports = function (code, message, extraData) {
    this.status(code || 403);
    this.send({
        response: {},
        error: message || 'Esta solicitud está prohibida'
    });
};
