import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    audio_url: string;
    image_url: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">ImageTalk</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <p className="text-gray-600">Click to upload</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
          >
            {isLoading ? 'Processing...' : 'Generate Caption & Audio'}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
              <img 
                src={result.image_url} 
                alt="Uploaded" 
                className="max-h-64 mx-auto rounded"
              />
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Caption:</h2>
              <p className="text-gray-700">{result.text}</p>
            </div>
            
            <div>
              <audio controls className="w-full">
                <source src={result.audio_url} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
