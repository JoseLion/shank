module.exports = function (message, code, fields, extraData) {
    this.status(400);
    this.send({
        error: {
            message: message || 'Request could not be handled.',
            code: code || undefined,
            fields: fields || undefined,
            extraData: extraData || undefined
        }
    });
};
