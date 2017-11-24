module.exports = function (message) {
    this.status(code || 401);
    this.send({
        response: {},
        error: message || 'No autorizado'
    });
};
