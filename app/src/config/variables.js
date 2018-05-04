// shank.levelaptesting.com
// 192.168.10.152
const endPoint = 'shank.levelaptesting.com';
const port = '3000';
const Host = `http://${endPoint}:${port}/`;
const ApiHost = Host + 'api/';
const FileHost = ApiHost + "archive/download/";
const ClienHost = `admin.${endPoint}/`;

const AuthToken = 'shank-auth-token';
const ProductSKUs = [
    'shank.roaster.update.1',
    'shank.roaster.update.2',
    'shank.roaster.update.3',
    'shank.roaster.update.4',
    'shank.roaster.update.5'
];

export { Host, ApiHost, FileHost, AuthToken, ClienHost, ProductSKUs };