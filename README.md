# AI Image Helper

This project is a full-stack application that allows users to upload images (or input image URLs) and uses OCR + Google Gemini API to analyze and provide insightful responses about the image content, similar to Google Lens.

---

## Features

- Upload images for OCR text extraction.
- Send extracted text to Google Gemini for intelligent analysis.
- Display Gemini’s formatted response using Markdown rendering.
- React frontend with live image preview.
- Flask backend handling OCR and Gemini API communication.

---

## Technologies Used

- Frontend: React, Axios, react-markdown
- Backend: Python Flask, Flask-CORS, Requests, google-generativeai SDK
- APIs: RapidAPI VisionText OCR, Google Gemini AI
