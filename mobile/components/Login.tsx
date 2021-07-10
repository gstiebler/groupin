import * as React from 'react';
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
  phoneNumber: string;
  verificationId: string;
  message: { text: string, color: string };
  setPhoneNumber: (phoneNumber: string) => void;
  setVerificationCode: (verificationCode: string) => void;
  setMessage: (message: { text: string, color: string }) => void;
  onSendVerificationCode: (applicationVerifier: firebase.auth.ApplicationVerifier) => void;
  onConfirmVerificationCode: () => void;
};
const LoginComponent: React.FC<LoginProps> = ({
  firebaseConfig,
  phoneNumber,
  verificationId,
  message,
  setPhoneNumber,
  setVerificationCode,
  setMessage,
  onSendVerificationCode,
  onConfirmVerificationCode,
}) => {
  const recaptchaVerifier = React.useRef(null);
  const attemptInvisibleVerification = false;

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
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
        disabled={!phoneNumber}
        onPress={() => onSendVerificationCode(recaptchaVerifier.current)}
      />
      <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        editable={!!verificationId}
        placeholder="123456"
        onChangeText={setVerificationCode}
      />
      <Button
        title="Confirm Verification Code"
        disabled={!verificationId}
        onPress={onConfirmVerificationCode}
      />
      {message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'gray', justifyContent: 'center' },
          ]}
          onPress={() => setMessage(undefined)}>
          <Text
            style={{
              color: message.color || 'blue',
              fontSize: 17,
              textAlign: 'center',
              margin: 20,
            }}>
            {message.text}
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
