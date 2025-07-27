import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { FirebaseAuth } from "../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const googleConfig = {
  clientId:
    "93761073008-99c6leu9hov4epnecd2tsp8n24j6u10u.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  additionalParameters: {},
  customParameters: {},
};

// Facebook OAuth configuration
const facebookConfig = {
  clientId: "376809015394183", // Your Facebook App ID
  scopes: ["public_profile", "email"],
};

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: googleConfig.clientId,
      scopes: googleConfig.scopes,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "com.moview.test",
      }),
      responseType: AuthSession.ResponseType.Token,
      extraParams: {
        include_granted_scopes: "true",
      },
    },
    { authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth" }
  );

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();

      if (result.type === "success") {
        const { access_token } = result.params;

        // Create a Google credential with the token
        const credential = GoogleAuthProvider.credential(null, access_token);

        // Sign in with Firebase
        const userCredential = await signInWithCredential(
          FirebaseAuth,
          credential
        );
        return userCredential.user;
      } else {
        throw new Error("Google sign-in was cancelled or failed");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  return {
    signInWithGoogle,
    request,
    response,
  };
};

export const useFacebookAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: facebookConfig.clientId,
      scopes: facebookConfig.scopes,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "com.moview.test",
      }),
      responseType: AuthSession.ResponseType.Token,
    },
    { authorizationEndpoint: "https://www.facebook.com/v11.0/dialog/oauth" }
  );

  const signInWithFacebook = async () => {
    try {
      const result = await promptAsync();

      if (result.type === "success") {
        const { access_token } = result.params;

        // Create a Facebook credential with the token
        const credential = FacebookAuthProvider.credential(access_token);

        // Sign in with Firebase
        const userCredential = await signInWithCredential(
          FirebaseAuth,
          credential
        );
        return userCredential.user;
      } else {
        throw new Error("Facebook sign-in was cancelled or failed");
      }
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      throw error;
    }
  };

  return {
    signInWithFacebook,
    request,
    response,
  };
};
