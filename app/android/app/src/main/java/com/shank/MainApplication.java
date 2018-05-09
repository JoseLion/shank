package com.shank;

import android.app.Application;
import android.content.res.Resources;

import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private static final String LICENSE_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApvczZa8BIxs91a4C+OsrPEoEcNJVX1GkhQptlvXsei4fagMW+5TrAZqbREuvScMJxZKwCkIjY3vygb0k43dBfvIFTLbjKZPpwpQgJJF9WC7/wmSJX7lQ9qA2icU36uAEWXuAD7im4RcBbpw50WbWKPDz2y2DBxtl8qx29dD3oMJ83q6vmdrRUAi7amFBM6VZ/dsGlr+kyxbL3loRipXFFhnwkKfRbupSmirNhFPglRNx6KWZSZbfyVZvn1ATHxmBpob3R4TroZeKiOntCsHog36Gz4bYlpXhFZYFI8MV72CzPf2PNIsU5Rnw3KAE29Sj84sfwlTU4U9gWeNswDf9iwIDAQAB";

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new ReactNativePushNotificationPackage(),
                    new LinearGradientPackage(),
                    new PickerPackage(),
                    new InAppBillingBridgePackage(LICENSE_KEY),
                    new FBSDKPackage(mCallbackManager)
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}