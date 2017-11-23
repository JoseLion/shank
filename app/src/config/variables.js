// Dev
// const ApiHost = 'http://192.168.10.106:3002/';
// const ApiKey = 'MTU2NDJkYzcxZjkwNTk4NjdlNjVlYWRjZTI5Zjdl';
// const AssetsURL = 'http://192.168.10.106/uploads';
// const Timeout = 20000;
// const version = '1.8';


// Prod
//HOST IP DE SU DOCKER TODO://CHECK

//const Host = 'http://104.198.224.166/'; testing server Google Cloud
//const ClienHost = '104.198.224.166:8000/';

//const Host = 'http://192.168.1.3:3000/'; testing dev RAUL
//http://34.197.96.93/api/allUsers test api users

//const Host = 'http://192.168.1.3:3000/';
//const ClienHost = '34.197.96.93:8000/';

//const ClienHost = '192.168.1.3:8000/';

const Host = 'http://104.198.224.166:3000/';
const ApiHost = Host + 'api/';
const ClienHost = '104.198.224.166:8000/';

const AuthToken = 'shank-auth-token';
const ApiKey = 'MTU2NDJkYzcxZjkwNTk4NjdlNjVlYWRjZTI5Zjdl';
const AssetsURL = 'http://104.198.224.166:3000/uploads';
const Timeout = 60000;
const version = '2.9';

export {Host, ApiHost, AuthToken, ApiKey, AssetsURL, Timeout, version, ClienHost};
