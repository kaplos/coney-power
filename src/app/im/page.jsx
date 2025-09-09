'use client';
import { useState } from "react";

export default function GalleryUpload({ onUploaded }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => setFiles(Array.from(e.target.files));

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return;
    setUploading(true);

    const uploadedUrls = [];
    for (const file of files) {
      const url = `https://api.cloudinary.com/v1_1/dfuz35dzr/upload`;
      const preset = "image_upload";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);

      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) uploadedUrls.push({'fields':{Url:data.secure_url }} );
    }

    setUploading(false);
    setFiles([]);

    if (uploadedUrls.length) {
      // Send all URLs to your API at once
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrls: uploadedUrls }),
      });
      if (onUploaded) onUploaded(uploadedUrls);
      alert("Upload successful!");
    } else {
      alert("Upload failed.");
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-2">
      <input type="file" accept="image/*" multiple onChange={handleChange} className="bg-[#C5A572] text-white px-4 py-2 rounded cursor-pointer" />
      <button type="submit" disabled={uploading || !files.length} className="bg-[#C5A572] text-white px-4 py-2 rounded cursor-pointer">
        {uploading ? "Uploading..." : "Upload Photos"}
      </button>
    </form>
  );
}