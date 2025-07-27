
// Import only the functions we need from the modular Firebase SDK.
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, serverTimestamp, Firestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from 'firebase/app-check';

// Import application configuration constants
import { APP_CHECK_SITE_KEY } from './config';

/**
 * Firebase configuration for this project. These values are specific to your
 * Firebase project and should be kept secret in a real-world application.
 */
const firebaseConfig = {
  apiKey: 'AIzaSyAY4x72mHtiZDzdCy-N1bpD4e0YmnHqH9Y',
  authDomain: 'rune-app-ref-367ac.firebaseapp.com',
  projectId: 'rune-app-ref-367ac',
  storageBucket: 'rune-app-ref-367ac.appspot.com',
  messagingSenderId: '108345490104',
  appId: '1:108345490104:web:d259508a8a4f9a0c1a938c',
};

// Initialize Firebase only once.  
// `initializeApp` returns the existing app instance if it has already been
// created, which prevents multiple apps from being created inadvertently.
const app: FirebaseApp = initializeApp(firebaseConfig);

// Retrieve the Auth and Firestore instances associated with the app.  
// Explicitly pass the `app` to `getAuth` and `getFirestore` to avoid relying
// on implicit initialization, which can lead to the "Component auth has not
// been registered yet" error if the services are referenced before being
// registered.
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Initialize Firebase App Check to protect backend resources from abuse.  
// App Check is optional for development, but recommended for production.
let appCheckInstance: AppCheck | undefined;
try {
  // For development on localhost, enable the debug token to allow App Check
  // to work without a deployed reCAPTCHA. See the Firebase docs for details.
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Declare the debug token on the global window object to satisfy TS.
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.warn(
      'Firebase App Check debug token enabled for localhost.\n' +
        'Remember to add the debug token from your browser console to the Firebase console App Check settings!'
    );
  }

  appCheckInstance = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(APP_CHECK_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
  console.log('Firebase App Check initialized successfully.');
} catch (error) {
  console.error('Firebase App Check initialization failed:', error);
}

// Export the initialized services for use throughout the app.  
// Exporting them individually enables tree-shaking in the build output.
export { db, auth, serverTimestamp, app, appCheckInstance };