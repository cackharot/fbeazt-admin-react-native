package com.fbeaztadmin;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
// import io.neson.react.notification.NotificationPackage;
// import com.evollu.react.fcm.FIRMessagingPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          // new FIRMessagingPackage(),
          // new NotificationPackage(),
          new RNGoogleSigninPackage(),
          new ReactNativeConfigPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
