module.exports = function (message) {
    // Set status code
    this.status(code || 401);
    this.send({
        response: {},
        error: message || 'No autorizado'
    });
};