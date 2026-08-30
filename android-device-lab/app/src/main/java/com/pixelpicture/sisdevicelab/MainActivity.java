package com.pixelpicture.sisdevicelab;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final String TAG = "SIS_DEVICE_LAB";

    private void applyImmersiveMode() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN |
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    private String resolveUrl(Intent intent) {
        if (intent.hasExtra("level")) {
            int level = intent.getIntExtra("level", 0);
            boolean creative = intent.getBooleanExtra("creative", false);
            boolean acq = intent.getBooleanExtra("acq", false);
            boolean labdelay = intent.getBooleanExtra("labdelay", false);
            StringBuilder url = new StringBuilder("file:///android_asset/index.html?level=").append(level);
            if (creative) url.append("&creative=1");
            if (acq) url.append("&acq=1");
            if (labdelay) url.append("&labdelay=1");
            return url.toString();
        }
        String url = intent.getStringExtra("url");
        if (url == null || url.isEmpty()) {
            // A human installing the APK must land in the real playable UI, never in the
            // acquisition capture mode. Lab capture modes are opt-in through intent extras.
            return "file:///android_asset/index.html?level=0";
        }
        // The only explicit-url launch in this lab is the acquisition capture. adb shell can
        // consume ampersand-separated query tails despite host quoting, so restore the lab-only
        // acquisition flags here instead of depending on shell transport of a compound URL.
        StringBuilder explicit = new StringBuilder(url);
        if (!url.contains("creative=1")) explicit.append(url.contains("?") ? "&" : "?").append("creative=1");
        if (!url.contains("acq=1")) explicit.append("&acq=1");
        if (!url.contains("labdelay=1")) explicit.append("&labdelay=1");
        return explicit.toString();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        applyImmersiveMode();

        WebView webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage message) {
                Log.i(TAG, message.message() + " @" + message.lineNumber());
                return true;
            }
        });
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                Log.i(TAG, "READY " + url);
            }
        });
        setContentView(webView);

        String url = resolveUrl(getIntent());
        Log.i(TAG, "LOAD " + url);
        webView.loadUrl(url);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) applyImmersiveMode();
    }
}
