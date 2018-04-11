// shank.levelaptesting.com
// 192.168.10.152
const endPoint = '192.168.10.152';
const port = '3000';

const Host = `http://${endPoint}:${port}/`;
const ApiHost = Host + 'api/';
const FileHost = ApiHost + "archive/download/";
const ClienHost = `admin.${endPoint}/`;

const AuthToken = 'shank-auth-token';
const ApiKey = 'MTU2NDJkYzcxZjkwNTk4NjdlNjVlYWRjZTI5Zjdl';
const AssetsURL = `http://${endPoint}:${port}/uploads`;
const Timeout = 60000;
const version = '2.9';

const GolfApiHost = 'https://api.fantasydata.net/golf/v2/JSON/';

export { Host, ApiHost, FileHost, AuthToken, ApiKey, AssetsURL, Timeout, version, ClienHost, GolfApiHost };