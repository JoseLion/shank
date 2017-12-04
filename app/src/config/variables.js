// shank.levelaptesting.com
// 192.168.100.6
const endPoint = 'shank.levelaptesting.com'

const Host = `http://${endPoint}:3000/`;
const ApiHost = Host + 'api/';
const ClienHost = `${endPoint}:8000/`;

const AuthToken = 'shank-auth-token';
const ApiKey = 'MTU2NDJkYzcxZjkwNTk4NjdlNjVlYWRjZTI5Zjdl';
const AssetsURL = `http://${endPoint}:3000/uploads`;
const Timeout = 60000;
const version = '2.9';

export {Host, ApiHost, AuthToken, ApiKey, AssetsURL, Timeout, version, ClienHost};
