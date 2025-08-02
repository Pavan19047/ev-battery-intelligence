# Backend Setup

## Firebase Service Account Setup

1. Copy `firebase-service-account-key.example.json` to `firebase-service-account-key.json`
2. Replace the placeholder values with your actual Firebase service account credentials
3. **NEVER commit the actual `firebase-service-account-key.json` file to git**

## Getting Firebase Service Account Credentials

1. Go to the Firebase Console (https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file and rename it to `firebase-service-account-key.json`
6. Place it in the `backend/` directory

## Environment Setup

Make sure to install dependencies:
```bash
npm install
```

## Running the Backend

```bash
npm start
```
