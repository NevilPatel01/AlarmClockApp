
# AlarmClockApp

A modern React Native app to configure and control an ESP32-based alarm clock over Bluetooth. This project lets you set WiFi credentials, alarm time, brightness, and other settings on your custom ESP32 clock from your phone.

---

## Features

- **Bluetooth Classic**: Scan, connect, and communicate with your ESP32 alarm clock.
- **WiFi Setup**: Send WiFi SSID and password to your device.
- **Alarm Configuration**: Set alarm time and enable/disable it.
- **Time & DST Settings**: Adjust UTC offset and daylight saving.
- **Brightness Control**: Set display brightness.
- **Profile Storage**: Save and load configuration profiles locally.
- **Modern UI**: Built with React Native Paper for a clean, intuitive experience.

---

## Screens

- **Home**: Connection status, quick actions, and device overview.
- **WiFi Config**: Enter and send WiFi credentials.
- **Alarm Config**: Set alarm time and toggle alarm.
- **Settings**: Adjust time offset, DST, and brightness.

---

## Getting Started

### Prerequisites
- Node.js (>= 20)
- Yarn or npm
- React Native CLI
- Xcode (for iOS) / Android Studio (for Android)
- ESP32 device with compatible firmware

### Installation

```sh
git clone <this-repo-url>
cd AlarmClockApp
npm install # or yarn
```

### Running the App

Start Metro:
```sh
npm start # or yarn start
```

Run on Android:
```sh
npm run android # or yarn android
```

Run on iOS (after `pod install` in ios/):
```sh
npm run ios # or yarn ios
```

---

## Usage

1. Power on your ESP32 alarm clock and enable Bluetooth.
2. Open the app and scan for devices.
3. Connect to your ESP32 device.
4. Configure WiFi, alarm, and settings as needed.
5. Save your configuration for future use.

---

## Project Structure

- `src/screens/` — App screens (Home, WiFiConfig, AlarmConfig, Settings)
- `src/services/` — Bluetooth, storage, and command logic
- `src/components/` — UI components (e.g., connection status)
- `src/utils/` — Validation and helpers
- `src/types/` — TypeScript types

---

## Notes
- This is a personal side project, not production software.
- ESP32 firmware is not included here.
- For any issues, feel free to fork or adapt for your own use.

---

## License

This project is open source and free to use for any purpose.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
