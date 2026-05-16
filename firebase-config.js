window.firebaseConfig = {
  apiKey: "AIzaSyDhIU0zAzz-GxcZ3vsFwihFazwWFJDM1lQ",
  authDomain: "pro-3-e6f35.firebaseapp.com",
  projectId: "pro-3-e6f35",
  storageBucket: "pro-3-e6f35.firebasestorage.app",
  messagingSenderId: "55166263675",
  appId: "1:55166263675:web:0e85c0bc9da26837e6ddde",
  measurementId: "G-RTNWV1YGQ6"
};

window.isFirebaseConfigured = () => {
  return window.firebaseConfig.apiKey && !window.firebaseConfig.apiKey.includes("YOUR_");
};
