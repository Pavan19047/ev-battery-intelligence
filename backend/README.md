# Backend Setup

## Firebase Service Account Setup

You have two options to configure Firebase Admin SDK:

### Option 1: Service Account File (Recommended for local development)

1. Copy `firebase-service-account-key.example.json` to `firebase-service-account-key.json`
2. Replace the placeholder values with your actual Firebase service account credentials
3. **NEVER commit the actual `firebase-service-account-key.json` file to git**

### Option 2: Environment Variable (Recommended for production)

1. Copy `.env.example` to `.env`
2. Set the `FIREBASE_SERVICE_ACCOUNT` environment variable to your complete service account JSON (as a single line string)

## Getting Firebase Service Account Credentials

1. Go to the Firebase Console (https://console.firebase.google.com/)
2. Select your project (`ev-battery-intelligence`)
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file

### For Option 1:
- Rename the downloaded file to `firebase-service-account-key.json`
- Place it in the `backend/` directory

### For Option 2:
- Copy the entire JSON content
- Paste it as the value for `FIREBASE_SERVICE_ACCOUNT` in your `.env` file
- Make sure it's all on one line without line breaks

## Environment Setup

Install dependencies:
```bash
cd backend
npm install
```

Create your environment file:
```bash
cp .env.example .env
# Edit .env with your actual values
```

## Running the Backend

```bash
npm start
```

The server will start on port 3001 by default.

## Troubleshooting

If you see "Error: Cannot find module './firebase-service-account-key.json'":
1. Make sure you've followed the Firebase setup steps above
2. Check that the file exists in the backend directory
3. Or use the environment variable approach instead
