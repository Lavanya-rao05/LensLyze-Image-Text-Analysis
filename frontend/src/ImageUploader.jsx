import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function ImageUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return alert("Upload an image first!");
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/analyze", formData);
      setResponse(res.data.geminiAnswer);
    } catch (err) {
      console.error(err);
      setResponse("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg text-center space-y-6 border">
      <h2 className="text-xl font-semibold">Upload Image</h2>

      <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl hover:border-blue-400 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="imageInput"
        />
        <label htmlFor="imageInput" className="block text-gray-600 cursor-pointer">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-auto rounded-xl" />
          ) : (
            <span className="text-gray-400">Click or drag an image here</span>
          )}
        </label>
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>

      {response && (
        <div className="bg-gray-100 p-4 rounded-xl text-left">
          <h3 className="font-bold mb-2 text-gray-800">AI Says:</h3>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
