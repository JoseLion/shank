// shank.levelaptesting.com
// 192.168.10.152
const endPoint = '35.199.81.172';
const port = '4000';
const Host = `http://${endPoint}:${port}/`; 
const ApiHost = Host + 'api/';
const FileHost = ApiHost + "archive/download/";
const ClientHost = `${endPoint}:88`;

const AuthToken = 'shank-auth-token';
const ProductSKUs = [
    'shank.roaster.update.1', //android.test.purchased
    'shank.roaster.update.2',
    'shank.roaster.update.3',
    'shank.roaster.update.4',
    'shank.roaster.update.5'
];

export { Host, ApiHost, FileHost, AuthToken, ClientHost, ProductSKUs };