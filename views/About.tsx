
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">About DotToDotStudio</h1>
      <p className="text-lg text-text-secondary mb-8">
        Welcome to DotToDotStudio, your creative space for designing and sharing connect-the-dots artwork. This tool is designed to be simple, intuitive, and fun, whether you're on a desktop or a mobile device.
      </p>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
          <ol className="list-decimal list-inside space-y-4 bg-base-100 p-6 rounded-lg shadow-sm">
            <li>
              <strong>Create a Project:</strong> From the Home screen, click "Create New" to start a blank canvas.
            </li>
            <li>
              <strong>Add Dots:</strong> Simply click or tap on the canvas where you want to place a dot. Dots are numbered automatically.
            </li>
            <li>
              <strong>Move Dots:</strong> Click and drag a dot to reposition it. On mobile, just tap and drag.
            </li>
            <li>
              <strong>Delete Dots:</strong> Right-click on a dot to remove it. On mobile, long-press (hold for half a second) on a dot to delete it.
            </li>
            <li>
              <strong>Trace an Image:</strong> Use the "Set Background Image" tool in the editor toolbar to upload an image. You can trace its outline to create your artwork.
            </li>
             <li>
              <strong>Use the Toolbar:</strong> The toolbar provides options to undo/redo actions, toggle the visibility of lines and numbers, and clear the canvas.
            </li>
            <li>
              <strong>Save & Export:</strong> Your project is saved automatically. Use the "Export" button to download your work as a JSON, SVG, or PNG file, or upload it directly to GitHub.
            </li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Tips for a Great Experience</h2>
          <ul className="list-disc list-inside space-y-2 bg-base-100 p-6 rounded-lg shadow-sm">
            <li><strong>Mobile-Friendly:</strong> The app is fully responsive. Try it on your phone or tablet!</li>
            <li><strong>Auto-Save:</strong> Don't worry about losing your work. Changes are saved to your browser's local storage automatically.</li>
            <li><strong>Creative Freedom:</strong> There are no limits. Create simple puzzles or complex artistic pieces.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
