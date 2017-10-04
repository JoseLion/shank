// Dev
// const ApiHost = 'http://192.168.10.106:3002/';
// const ApiKey = 'MTU2NDJkYzcxZjkwNTk4NjdlNjVlYWRjZTI5Zjdl';
// const AssetsURL = 'http://192.168.10.106/uploads';
// const Timeout = 20000;
// const version = '1.8';


// Prod
//HOST IP DE SU DOCKER TODO://CHECK

//const Host = 'http://34.197.96.93/'; testing server AWS
//const Host = 'http://192.168.1.3:3000/'; testing dev RAUL
//http://34.197.96.93/api/allUsers test api users

const Host = 'http://192.168.1.3:3000/';
const ApiHost = Host + 'api/';

const AuthToken = 'shank-auth-token';
const ApiKey = 'MTU2NDJkYzcxZjkwNTk4NjdlNjVlYWRjZTI5Zjdl';
const AssetsURL = 'http://192.168.1.3:3000/uploads';
const Timeout = 60000;
const version = '2.2';

export {Host, ApiHost, AuthToken, ApiKey, AssetsURL, Timeout, version};
