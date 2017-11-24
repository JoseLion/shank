module.exports = function (message, code, extraData) {
    this.status(code || 500);
    if (extraData instanceof Error) {
        extraData = extraData.toString();
    }

    this.send({
        response: {},
        error: message || 'Lo sentimos, se ha producido un error en el servidor. Espere un poco y vuelva a intentarlo.'
    });
};
