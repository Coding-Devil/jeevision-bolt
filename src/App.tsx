import React, { useEffect } from 'react';
import { CameraCapture } from './components/camera-capture';
import { speak } from './lib/utils';

function App() {
  useEffect(() => {
    speak("Welcome to Scene Describer. This app will help you understand your surroundings through AI-powered scene description. To begin, activate the camera using the button at the bottom of the screen.");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-lg mx-auto mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Scene Describer</h1>
        <p className="text-gray-600">
          Capture your surroundings and get an audio description
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <CameraCapture />
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Double tap anywhere on the screen to have the last message repeated</p>
      </footer>
    </div>
  );
}

export default App;