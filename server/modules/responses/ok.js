module.exports = function (response, error) {
    this.status(200);
    this.json({response: response || {}, error: error || ''});
};