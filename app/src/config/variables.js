// shank.levelaptesting.com
// 192.168.10.152
const endPoint = 'shank.levelaptesting.com';
const port = '3000';
const Host = `http://${endPoint}:${port}/`;
const ApiHost = Host + 'api/';
const FileHost = ApiHost + "archive/download/";
const ClienHost = `admin.${endPoint}/`;

const AuthToken = 'shank-auth-token';
const ProductSku = {
    ios: 'com.levelap.shank.playerchange',
    android: 'android.test.purchased'
};

export { Host, ApiHost, FileHost, AuthToken, ClienHost, ProductSku };