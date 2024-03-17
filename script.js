// Function to toggle dark mode
const toggleDarkMode = () => {
  const body = document.body;
  body.classList.toggle("dark-mode");
};

// Function to show/hide settings panel
const showSettings = () => {
  const settings = document.getElementById("settings");
  settings.classList.toggle("show");
};

// Function to handle form submission
const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
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

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const result = document.getElementById("result");
    result.innerHTML = `<audio controls><source src="${data.denoisedUrl}" type="audio/mpeg"></audio>`;
  } catch (error) {
    console.error("Error:", error);
    // Handle error gracefully, e.g., display error message to the user
  }
};

// Event listener for form submission
const form = document.getElementById("form");
form.addEventListener("submit", handleFormSubmit);