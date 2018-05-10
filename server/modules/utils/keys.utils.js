let regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i;

module.exports = {
  get_key_error: (message) => {
    let match =  message.match(regex);
    return (match[1] || match[2]);
  }
};