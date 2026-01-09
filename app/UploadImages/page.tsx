"use client";
import { useState } from "react";

export default function UploadToStorage() {
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!files.length) return;
    setLoading(true);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) uploadedUrls.push(data.url);
    }

    setUrls(uploadedUrls);
    setLoading(false);
  };

  return (
    <div className="p-4 mt-25 border rounded-md shadow-md">
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      <div className="mt-4 flex flex-wrap gap-2">
        {urls.map((url, idx) => (
          <img key={idx} src={url} alt={`Uploaded ${idx}`} className="w-40 h-40 object-cover rounded" />
        ))}
      </div>
    </div>
  );
}
