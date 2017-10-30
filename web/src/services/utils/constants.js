/**
 * Created by MnMistake on 10/30/2017.
 */

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("Host", "http://192.168.1.3:3000/");
define("ApiHost", "http://192.168.1.3:3000/" + "api/");
define("internetError", 'No internet connection available.');
define("requestServerError", 'We couldn\'t connect to the server. Please try later');
define("parsingResponseError", 'Error getting server response.');