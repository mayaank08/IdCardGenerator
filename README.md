# 🎓 Smart Student ID Generator (ReactJS + Replit)

A mini version of Unity’s Student ID Card generation module — built using **ReactJS**, styled with **TailwindCSS**, and deployed via **Replit**. This project demonstrates UI polish, logical flow, integration, and attention to detail — just like you'd need on the real Unity team.

---

## 🚀 Objective

Build a Smart Student ID Generator that captures student data and generates a printable/downloadable digital ID card with optional template switching and QR code encoding.

---

## 🛠️ Tech Stack

- **Frontend**: ReactJS (v18+)
- **Styling**: TailwindCSS
- **QR Code**: [`qrcode.react`](https://www.npmjs.com/package/qrcode.react)
- **Image Export**: [`html-to-image`](https://www.npmjs.com/package/html-to-image)
- **Deployment**: Replit / Lovable
- **Optional Persistence**: `localStorage`

---

## 📋 Features

### 1. 📝 Student Data Form

Form fields include:

- ✅ Name
- ✅ Roll Number
- ✅ Class & Division (dropdown)
- ✅ Allergies (multi-select)
- ✅ Photo Upload (with preview)
- ✅ Rack Number
- ✅ Bus Route Number (dropdown)
- ✅ Submit Button

---

### 2. 🪪 Smart ID Card Preview

Upon submission:

- 🎓 Student Info Display
- 🖼️ Uploaded Photo
- ⚠️ Allergies (if provided)
- 🧳 Rack Number
- 🚌 Bus Route
- 📦 QR Code containing the full JSON of student data
- 📥 “Download as PNG” button to save the ID card image

---

### 3. 🎨 Template Switching

- Switch between **2 different design templates** via a toggle or dropdown.
- Great for customizing or previewing different visual layouts.

---

🧠 Thought Process
Kept the form UX minimal and responsive.

Ensured user feedback with image preview and success messages.

Focused on clean state management using hooks and reusable components.

Implemented QR Code encoding for portability of data.

Exported card preview as PNG using DOM-to-image rendering.

Structured for scalability with potential backend integration.

📍 Credit
Made with ❤️ by Mayank Kumar
