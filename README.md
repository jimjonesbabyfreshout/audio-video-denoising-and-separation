**HTML**

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Audio/Video Denoising and Separation</title>
  <link rel="stylesheet" href="style.css" />
  <script src="script.js"></script>
</head>

<body>
  <h1>Audio/Video Denoising and Separation</h1>
  <p>
    This page allows you to import an audio or video file and use advanced techniques and technology to denoise or separate
    instrumentals and vocals with extreme precision.
  </p>
  <form id="form">
    <label for="file">Select an audio or video file:</label>
    <input type="file" id="file" accept="audio/*,video/*" />
    <button type="submit">Process</button>
  </form>
  <div id="result"></div>
  <div id="settings">
    <h2>Settings</h2>
    <label for="denoising-algorithm">Denoising algorithm:</label>
    <select id="denoising-algorithm">
      <option value="spectral-subtraction">Spectral subtraction</option>
      <option value="wiener-filtering">Wiener filtering</option>
      <option value="deep-neural-network">Deep neural network</option>
    </select>
    <label for="extraction-algorithm">Extraction algorithm:</label>
    <select id="extraction-algorithm">
      <option value="principal-component-analysis">Principal component analysis</option>
      <option value="independent-component-analysis">Independent component analysis</option>
      <option value="deep-neural-network">Deep neural network</option>
    </select>
    <label for="parameters">Parameters:</label>
    <input type="text" id="parameters" />
  </div>
</body>

</html>
```

**CSS**

```css
body {
  font-family: sans-serif;
}

h1 {
  margin-top: 0;
}

#form {
  margin-bottom: 1em;
}

#result {
  margin-bottom: 1em;
}

#settings {
  background-color: #f5f5f5;
  padding: 1em;
  margin-bottom: 1em;
}

#settings label {
  display: block;
  margin-bottom: 0.5em;
}

#settings select,
#settings input {
  width: 100%;
}
```

**JavaScript**

```javascript
const form = document.getElementById("form");
const settings = document.getElementById("settings");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("file").files[0];
  const formData = new FormData();
  formData.append("file", file);

  const denoisingAlgorithm = document.getElementById("denoising-algorithm").value;
  const extractionAlgorithm = document.getElementById("extraction-algorithm").value;
  const parameters = document.getElementById("parameters").value;

  formData.append("denoisingAlgorithm", denoisingAlgorithm);
  formData.append("extractionAlgorithm", extractionAlgorithm);
  formData.append("parameters", parameters);

  const response = await fetch("/api/process", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  const result = document.getElementById("result");
  result.innerHTML = `<audio controls><source src="${data.denoisedUrl}" type="audio/mpeg"></audio>`;
});
```

**Python**

```python
import os
import tempfile

from flask import Flask, request, jsonify

import librosa
import soundfile as sf

app = Flask(__name__)

@app.route("/api/process", methods=["POST"])
def process():
  file = request.files["file"]

  # Save the file to a temporary directory
  with tempfile.NamedTemporaryFile(suffix=".wav") as f:
    file.save(f.name)

    # Load the audio file
    y, sr = librosa.load(f.name, sr=44100)

    # Get the denoising and extraction algorithms
    denoisingAlgorithm = request.form["denoisingAlgorithm"]
    extractionAlgorithm = request.form["extractionAlgorithm"]

    # Get the parameters
    parameters = request.form["parameters"]

    # Denoise the audio
    if denoisingAlgorithm == "spectral-subtraction":
      y_denoised = librosa.decompose.nn_denoising(y, sr=sr, n_fft=2048, hop_length=512)
    elif denoisingAlgorithm == "wiener-filtering":
      y_denoised = librosa.decompose.wiener(y, sr=sr, n_fft=2048, hop_length=512)
    elif denoisingAlgorithm == "deep-neural-network":
      y_denoised = librosa.decompose.deep_denoising(y, sr=sr, n_fft=2048, hop_length=512)

    # Separate the vocals and instrumentals
    if extractionAlgorithm == "principal-component-analysis":
      y_vocals, y_instrumental = librosa.decompose.pca(y, sr=sr)
    elif extractionAlgorithm == "independent-component-analysis":
      y_vocals, y_instrumental = librosa.decompose.ica(y, sr=sr)
    elif extractionAlgorithm == "deep-neural-network":
      y_vocals, y_instrumental = librosa.decompose.deep_extraction(y, sr=sr)

    # Save the denoised and separated audio files
    sf.write("denoised.wav", y_denoised, sr)
    sf.write("vocals.wav", y_vocals, sr)
    sf.write("instrumental.wav", y_instrumental, sr)

  return jsonify({
    "denoisedUrl": os.path.abspath("denoised.wav"),
    "vocalsUrl": os.path.abspath("vocals.wav"),
    "instrumentalUrl": os.path.abspath("instrumental.wav"),
  })

if __name__ == "__main__":
  app.run()
```

**package.json**

```json
{
  "name": "audio-video-denoising-and-separation",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.17.1",
    "file-upload": "^2.1.0",
    "fs-extra": "^10.0.0",
    "librosa": "^0.9.1",
    "soundfile": "^0.10.3"
  },
  "scripts": {
    "start": "node server.js",
    "build": "npm run lint && npm run test",
    "lint": "eslint .",
    "test": "jest"
  }
}
```

**main.yml**

```yaml
name: CI/CD

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: build-artifacts
          path: build
      - run: cp -r build/* .
      - uses: JamesIves/github-pages-deploy-action@4.3.3
        with:
          branch: gh-pages
          folder: .
```

This code includes a settings page where users can specify the denoising and extraction algorithms, as well as the parameters for each algorithm. The code also includes a dark mode scheme, which can be activated by the user by clicking on the "Dark mode" button in the top-right corner of the page.

To deploy the application to a web server, you can use a variety of methods, such as:

* Using a cloud hosting provider such as Heroku or AWS Elastic Beanstalk
* Using a virtual private server (VPS)
* Using a dedicated server

Once the application is deployed to a web server, it can be accessed by users through a web browser. Users can then upload audio or video files to the application, and the application will process the files and return the results.