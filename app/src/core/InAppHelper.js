import { NativeModules } from 'react-native';
const { InAppUtils } = NativeModules;

export default class InAppHelper {
    
    static canMakePayments() {
        return new Promise((resolve, reject) => {
            InAppUtils.canMakePayments(canPay => {
                if (canPay == null) {
                    return reject('No response aquired');
                }

                resolve(canPay);
            });
        });
    }

    static loadProducts(products) {
        return new Promise((resolve, reject) => {
            InAppUtils.loadProducts(products, (error, products) => {
                if (error != null) {
                    return reject(error);
                }

                resolve(products);
            });
        });
    }

    static purchaseProduct(productId) {
        return new Promise((resolve, reject) => {
            InAppUtils.purchaseProduct(productId, (error, response) => {
                if (error != null) {
                    return reject(error);
                }

                resolve(response);
            });
        });
    }
}