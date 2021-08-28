import React from 'react';
import { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import firebase from 'firebase/app';

export type LoginProps = {
  firebaseConfig: unknown;
  verificationId: string;
  message?: { text: string, color: string };
  setMessageAction: (message: { text: string, color: string }) => void;
  onSendVerificationCode: (phoneNumber: string, applicationVerifier: firebase.auth.ApplicationVerifier) => void;
  onConfirmVerificationCode: (verificationCode: string) => void;
};
const LoginComponent: React.FC<{ loginStore: LoginProps }> = ({ loginStore }) => {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const attemptInvisibleVerification = false;

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={loginStore.firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />
      <Text style={{ marginTop: 20 }}>Enter phone number</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        placeholder="+1 999 999 9999"
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
      />
      <Button
        title="Send Verification Code"
        onPress={() => loginStore.onSendVerificationCode(phoneNumber, recaptchaVerifier.current)}
      />
      <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        editable={!!loginStore.verificationId}
        placeholder="123456"
        onChangeText={setVerificationCode}
      />
      <Button
        title="Confirm Verification Code"
        disabled={!loginStore.verificationId}
        onPress={() => loginStore.onConfirmVerificationCode(verificationCode)}
      />
      {loginStore.message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'gray', justifyContent: 'center' },
          ]}
          onPress={() => loginStore.setMessageAction(undefined)}>
          <Text
            style={{
              color: loginStore.message.color || 'blue',
              fontSize: 17,
              textAlign: 'center',
              margin: 20,
            }}>
            {loginStore.message.text}
          </Text>
        </TouchableOpacity>
      ) : (
        undefined
      )}
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </View>
  );
}
export default LoginComponent;
