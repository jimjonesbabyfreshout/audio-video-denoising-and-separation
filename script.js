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
