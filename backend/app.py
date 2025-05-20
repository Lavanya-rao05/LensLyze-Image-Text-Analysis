from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["https://lens-lyze-image-text-analysis.vercel.app"])

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Set up Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

@app.route('/analyze', methods=['POST'])
def analyze_image():
    try:
        # Get the image file from the request
        image = request.files.get("image")
        if not image:
            return jsonify({"error": "No image uploaded"}), 400

        # Prepare multipart form data
        files = {
            "image": (image.filename, image.stream, image.mimetype)
        }
        data = {
            "lang": "eng"
        }
        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": "visiontext-ocr.p.rapidapi.com"
            # DO NOT manually set Content-Type – requests handles it
        }

        # Make the request to the OCR API
        ocr_response = requests.post(
            "https://visiontext-ocr.p.rapidapi.com/extract_text_from_file",
            headers=headers,
            files=files,
            data=data
        )

        ocr_response.raise_for_status()
        ocr_text = ocr_response.json().get("text")

        if not ocr_text:
            return jsonify({"error": "No text found in image"}), 400

        # Prompt Gemini
        prompt = f"""
        Analyze the following image text and respond helpfully.
        - If it's code, explain what it does or how to fix it.
        - If it's a question, answer it.
        - If it's a link, describe what it leads to.

        Text from image:
        {ocr_text}
        """

        gemini_response = model.generate_content(prompt)
        answer = gemini_response.text

        return jsonify({
            "extractedText": ocr_text,
            "geminiAnswer": answer
        })

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
