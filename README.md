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
git clone https://github.com/NevilPatel01/AlarmClockApp
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