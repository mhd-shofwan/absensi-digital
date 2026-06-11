# Absensi Event 🕌

![Version](https://img.shields.io/github/v/release/mhd-shofwan/absensi-digital)
![License](https://img.shields.io/github/license/mhd-shofwan/absensi-digital)
![Last Commit](https://img.shields.io/github/last-commit/mhd-shofwan/absensi-digital)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8)

A lightweight, real-time, kiosk-based attendance system designed specifically for Islamic study circles (Event). Built with Vanilla JavaScript, Tailwind CSS, and Firebase.

## 🌟 Features

- **Kiosk Mode**: Unauthenticated devices act as kiosks for participants to easily mark their attendance.
- **Device Management**: Admins must approve new devices before they can be used for attendance to prevent unauthorized access.
- **Real-Time Dashboard**: Monitor live attendance statistics and device statuses seamlessly.
- **Bulk Import**: Easily import teacher or participant data using CSV templates.
- **Event Management**: Create new events and toggle active attendance sessions instantly.
- **Force Auto-Update**: A custom deployment script to force all active kiosks to reload and lock when a new application version is released.
- **Excel Reporting**: Download attendance summaries in `.xlsx` format, automatically separating male and female participants with precise arrival times.
- **Doorprize Raffle (Coming Soon)**: A *Wheel of Names* style feature to randomly pick winners from attendees based on a specified cut-off time.
- **Robust Security**: Strict Firebase Security Rules ensuring only authenticated admins can mutate master data and delete operational records.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES Modules), Tailwind CSS
- **Backend/Database**: Firebase Firestore
- **Authentication**: Firebase Auth (for Admin)
- **Tooling**: Node.js, Firebase JS SDK

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A Firebase project with **Firestore** and **Email/Password Authentication** enabled.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mhd-shofwan/absensi-digital.git
   cd absensi-digital
   ```

2. **Install dependencies**
   Install Tailwind CSS and Firebase SDK via npm.
   ```bash
   npm install
   ```

3. **Configure Firebase**
   Replace the `firebaseConfig` object inside `assets/js/firebase.js.example` with your own Firebase project configuration and rename the file to `assets/js/firebase.js` (remove `.example`).

4. **Run Tailwind CSS (Development)**
   ```bash
   npm run watch:css
   ```
   *Note: For production environments, use `npm run build:css` to minify the CSS output.*

5. **Serve the App**
   Serve the project directory using any local development server such as Laragon, XAMPP, or the VSCode Live Server extension.

## 🔒 Securing the Database
Do not leave your Firestore rules wide open. Apply the recommended Firebase Security Rules found in the `firestore.rules` file via the Firebase Console to ensure maximum security.

## 📦 Releasing a New Version
When updating the app code, ensure that older clients running in Kiosk mode get updated:
1. Copy your Firebase config into `release.mjs.example` and remove the `.example` extension to make it `release.mjs`.
2. Update `APP_CONFIG.version` in `assets/js/config.js`.
3. Run the release script:
   ```bash
   node release.mjs <version> <admin_email> <admin_password>
   # Example: node release.mjs 1.0.1 admin@masjid.com secret123
   ```
   This will instantly lock out outdated clients.

## 📄 License
This project is open-sourced under the MIT License. Developed by [Mhd Shofwan](https://github.com/mhd-shofwan).