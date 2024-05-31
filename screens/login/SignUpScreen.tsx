import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ImageBackground } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { OutsideStackParamList } from "navigation/OutsideNavigation";
import CustomButton from "../../components/CustomButton";
import {
  FirebaseAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from "../../firebaseConfig";
import {
  signInWithCredential,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

type SignUpScreenProp = NativeStackScreenProps<OutsideStackParamList, "SignUp">;

const discovery = {
  authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
  tokenEndpoint: "https://twitter.com/i/oauth2/token",
  revocationEndpoint: "https://twitter.com/i/oauth2/revoke",
};

const SignUpScreen = ({ navigation }: SignUpScreenProp) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(FirebaseAuth, email, password);
      navigation.navigate("InsideNavigation", {
        screen: "HomeStack",
        params: {
          screen: "Home",
        },
      });
    } catch (error: any) {
      console.error(error);
      alert("Sign up Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
      await signInWithCredential(FirebaseAuth, googleCredential);
      navigation.navigate("InsideNavigation", {
        screen: "HomeStack",
        params: {
          screen: "Home",
        },
      });
    } catch (error: any) {
      console.error(error);
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          alert("Sign in cancelled");
          break;
        case statusCodes.IN_PROGRESS:
          alert("Sign in in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          alert("Play services not available");
          break;
        default:
          alert("Google Sign-In Failed: " + error.message);
          break;
      }
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (result.isCancelled) {
        throw new Error("User cancelled the login process");
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error("Something went wrong obtaining access token");
      }

      const facebookCredential = FacebookAuthProvider.credential(
        data.accessToken
      );
      await signInWithCredential(FirebaseAuth, facebookCredential);
      navigation.navigate("InsideNavigation", {
        screen: "HomeStack",
        params: { screen: "Home" },
      });
    } catch (error: any) {
      console.error(error);
      alert("Facebook Login Error: " + error.message);
    }
  };

  // Twitter login
  const [, response, promptAsync] = useAuthRequest(
    {
      clientId: "azBRT0hZc1VTT29zUHFNYjh3Z0I6MTpjaQ",
      redirectUri: makeRedirectUri({
        scheme: "com.moview.test",
      }),
      usePKCE: true,
      scopes: ["tweet.read", "email"],
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      const getAccessToken = async () => {
        const tokenResponse = await fetch(
          "https://api.twitter.com/2/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `client_id=azBRT0hZc1VTT29zUHFNYjh3Z0I6MTpjaQ&redirect_uri=${makeRedirectUri(
              {
                scheme: "com.moview.test",
              }
            )}&code=${code}&grant_type=authorization_code`,
          }
        );
        const tokenResult = await tokenResponse.json();
        const { access_token, id_token } = tokenResult;

        const credential = TwitterAuthProvider.credential(
          access_token,
          id_token
        );
        await signInWithCredential(FirebaseAuth, credential);

        navigation.navigate("InsideNavigation", {
          screen: "HomeStack",
          params: { screen: "Home" },
        });
      };

      getAccessToken();
    } else if (response?.type === "error") {
      console.error(response.error);
      alert("Twitter Login Error: " + response.error);
    }
  }, [response]);

  const backgroundImage = require("../profile.jpg");

  return (
    <View className="flex-1">
      <View className="w-scren justify-end h-3/6">
        <ImageBackground className="w-full h-full" source={backgroundImage} />
        <View className="w-scren justify-end">
          <View className="w-screen items-center justify-end bg-black rounded-t-full self-center absolute h-28">
            <Text className="text-4xl color-white absolute">Sign Up</Text>
          </View>
        </View>
        <View className="w-screen items-end h-16 bg-black"></View>
      </View>

      <View className="flex-1 bg-black px-6">
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-4 pl-2"
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          placeholderTextColor="white"
          value={email}
        />

        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-4 pl-2"
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          placeholderTextColor="white"
          value={password}
          secureTextEntry
        />
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-4 pl-2"
          placeholder="Kullanıcı Adı"
          placeholderTextColor="white"
        />

        <CustomButton
          classNameProp="mb-4 h-12"
          title="Sign up"
          loading={loading}
          onPress={handleSignUp}
        />
        <Text className="text-center mb-4 color-white">Or sign up with </Text>
        <View className="h-0.5 w-36 bg-white self-center" />

        <View className="flex flex-row justify-center">
          <CustomButton
            classNameProp="w-1/5 my-4 mx-1 bg-white-500"
            title="G"
            onPress={handleGoogleSignIn}
          />

          <CustomButton
            classNameProp="w-1/5 my-4 mx-1 bg-white-500"
            title="F"
            onPress={handleFacebookSignIn}
          />

          <CustomButton
            classNameProp="w-1/5 my-4 mx-1 bg-white-500"
            title="T"
            onPress={promptAsync}
          />
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
