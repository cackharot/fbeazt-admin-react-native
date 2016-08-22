package com.fbeaztadmin;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import android.content.Intent;

// import io.neson.react.notification.NotificationPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "fbeaztAdmin";
    }
    @Override
    public void onNewIntent (Intent intent) {
      super.onNewIntent(intent);
        setIntent(intent);
    }

    // protected List<ReactPackage> getPackages() {
    //     return Arrays.<ReactPackage>asList(
    //         new NotificationPackage(this)                  // <- Add this line
    //     );
    // }
}
