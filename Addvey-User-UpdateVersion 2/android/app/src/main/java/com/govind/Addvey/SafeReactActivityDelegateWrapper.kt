package com.govind.Addvey

import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import expo.modules.ReactActivityDelegateWrapper

class SafeReactActivityDelegateWrapper(
    activity: ReactActivity,
    delegate: ReactActivityDelegate
) {

    private val TAG = "SafeWrapper"

    private val wrappedDelegate =
        ReactActivityDelegateWrapper(activity, false, delegate)

    fun onCreate(savedInstanceState: Bundle?) {
        try {
            Log.d(TAG, "onCreate")
            wrappedDelegate.onCreate(savedInstanceState)
        } catch (e: Exception) {
            Log.e(TAG, "onCreate error", e)
        }
    }

    fun onResume() {
        try {
            Log.d(TAG, "onResume")
            wrappedDelegate.onResume()
        } catch (e: Exception) {
            Log.e(TAG, "onResume error", e)
        }
    }

    fun onPause() {
        try {
            Log.d(TAG, "onPause")
            wrappedDelegate.onPause()
        } catch (e: Exception) {
            Log.e(TAG, "onPause error", e)
        }
    }

    fun onDestroy() {
        try {
            Log.d(TAG, "onDestroy")
            wrappedDelegate.onDestroy()
        } catch (e: Exception) {
            Log.e(TAG, "onDestroy error", e)
        }
    }

    fun onWindowFocusChanged(hasFocus: Boolean) {
        try {
            wrappedDelegate.onWindowFocusChanged(hasFocus)
        } catch (e: Exception) {
            Log.e(TAG, "onWindowFocusChanged error", e)
        }
    }

    fun getDelegate(): ReactActivityDelegate = wrappedDelegate
}
