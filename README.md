# 🚗 Client Thesis (Frontend)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Client Thesis** is the frontend part of a capstone system designed to help users **report, monitor, and analyze parking violations** in real time.  
It provides an intuitive interface for reporting incidents, viewing analytics, and interacting with semantic and sentiment analysis features powered by the backend API.

---

## 🧭 Table of Contents

1. [About the Project](#-about-the-project)  
2. [System Features](#-system-features)  
3. [Tech Stack](#-tech-stack)  
4. [Project Structure](#-project-structure)  
5. [Setup & Installation](#-setup--installation)  
6. [Environment Variables](#-environment-variables)  
7. [Usage](#-usage)  
8. [Deployment](#-deployment)  
9. [Contributing](#-contributing)  
10. [License](#-license)  
11. [Contact & Acknowledgements](#-contact--acknowledgements)

---

## 🧩 About the Project

This project serves as the **client-side interface** of a **Parking Violation Reporting and Analytics System**, created as part of a final-year thesis.  

It allows users to:
- Submit parking violation reports.
- Upload images and descriptions of incidents.
- View the list of submitted reports.
- See analytics and summaries (semantic and sentiment-based insights).
- Help administrators manage reports and identify violation trends.

The backend API (Node.js + Express + MongoDB) processes, stores, and analyzes the data, while this client provides a fast, responsive, and accessible user interface.

---

## 🚀 System Features

✅ **User Reporting**
- Report parking violations with photos, locations, and descriptions.  
- Supports up to 4 image uploads per report.

✅ **Real-Time Monitoring**
- Displays list of submitted reports.  
- Shows time, date, and location information.

✅ **Semantic & Sentiment Analysis**
- Automatically identifies violation type based on user description.  
- Measures public sentiment (positive, neutral, or negative tone).

✅ **Admin Tools**
- Manage and verify user reports.  
- Generate analytics dashboards.

✅ **User Interface**
- Clean, modern, and mobile-friendly interface built with React + Tailwind CSS.  
- Smooth navigation between pages using React Router.

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend Framework** | [React 18](https://react.dev/), [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), NextUI 2.6.10 |
| **State Management** | React Context API / Hooks |
| **Backend (API)** | Node.js + Express.js |
| **Database** | MongoDB |
| **Authentication** | Firebase Auth (Google Login) |
| **Networking** | Axios |
| **Version Control** | Git + GitHub |
| **Deployment** | Vercel / Netlify |

---

## 🧱 Project Structure

