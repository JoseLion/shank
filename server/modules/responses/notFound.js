module.exports = function (uri, extraData) {
    this.status(404);
    this.send({
        error: {
            message: uri + ' not found.',
            code: 404,
            extraData: extraData || undefined
        }
    });
}
