document.addEventListener("DOMContentLoaded", function () {
  const phLevelElement = document.getElementById("ph-level");
  const turbidityElement = document.getElementById("turbidity");
  const contaminantsElement = document.getElementById("contaminants");
  const submissionResultElement = document.getElementById("submission-result");
  const testForm = document.getElementById("test-form");

  // Function to fetch current water quality data from the Water Quality Portal API
  async function fetchWaterQualityData() {
    try {
      const response = await fetch(
        "https://www.waterqualitydata.us/data/Result/search?statecode=US:06&sampleMedia=Water&characteristicName=pH&mimeType=csv"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const rows = text.split("\n").slice(1); // Skipping the header row
      const data = rows.map((row) => row.split(","));

      // Extract relevant data (modify based on actual data structure)
      const phData = data.map((row) => row[10]); // Assuming pH is in the 11th column
      const turbidityData = data.map((row) => row[11]); // Assuming turbidity is in the 12th column
      const contaminantsData = data.map((row) => row[12]); // Assuming contaminants are in the 13th column

      phLevelElement.textContent = phData[0] || "N/A"; // Assuming first entry is relevant
      turbidityElement.textContent = turbidityData[0] || "N/A";
      contaminantsElement.textContent =
        contaminantsData.filter(Boolean).join(", ") || "None";
    } catch (error) {
      console.error("Error fetching water quality data:", error);
      phLevelElement.textContent = "Error";
      turbidityElement.textContent = "Error";
      contaminantsElement.textContent = "Error";
    }
  }

  // Function to handle form submission
  testForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      location: testForm.location.value,
      ph: parseFloat(testForm.ph.value),
      turbidity: parseFloat(testForm.turbidity.value),
      contaminants: testForm.contaminants.value.split(","),
    };

    try {
      const response = await fetch("https://api.example.com/submit-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      submissionResultElement.textContent = result.message;
      submissionResultElement.style.color = "green";
    } catch (error) {
      console.error("Error submitting test results:", error);
      submissionResultElement.textContent = "Failed to submit test results.";
      submissionResultElement.style.color = "red";
    }
  });

  // Fetch initial water quality data on page load
  fetchWaterQualityData();
});
