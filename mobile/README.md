
# HomeSnap Pro Mobile App

This is the mobile version of the HomeSnap Pro application built with React Native and Expo.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Install dependencies:
```
cd mobile
npm install
```

2. Start the development server:
```
npm start
```

3. Use the Expo Go app on your phone to scan the QR code, or press 'a' to open Android emulator or 'i' to open iOS simulator.

## Project Structure

- `/src/components` - Reusable UI components
- `/src/screens` - Screen components for different pages
- `/src/lib` - Utility functions and configuration
- `/src/assets` - Images, fonts, and other static assets

## Features

- Real estate photography services
- Photo uploading and editing
- Order management
- AI assistant (Jarvis)
- User authentication

## Shared Code with Web App

Some code and functionality is shared between the web and mobile versions:

- API integration logic
- Authentication flow
- Business logic

## Differences from Web App

The mobile app has been optimized for touch interfaces and mobile screens:
- Uses React Native components instead of HTML/CSS
- Navigation adapted for mobile (tab-based)
- Responsive layouts for different screen sizes
- Platform-specific UI patterns
