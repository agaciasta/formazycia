import fs from 'fs/promises';

async function loadDataAndGenerateJSON(url) {
  const response = await fetch(url);
  const text = await response.text();
  
  const lines = text.split("\n");
  const jsonData = {};
  let currentSection = "";
  let currentExercise = "";
  let steps = [];
  let jpgUrl = "";
  let jpgUrl2 = "";

  lines.forEach((line) => {
    if (line.startsWith("|")) {
      if (currentSection) {
        jsonData[currentSection] = jsonData[currentSection] || {};
        if (currentExercise) {
          jsonData[currentSection][currentExercise] = { steps, jpgUrl, jpgUrl2 };
        }
      }
      currentSection = line.slice(1).trim();
      currentExercise = "";
      steps = [];
      jpgUrl = "";
      jpgUrl2 = "";
    } else if (line.startsWith(";")) {
      if (currentExercise) {
        jsonData[currentSection][currentExercise] = { steps, jpgUrl, jpgUrl2 };
      }
      jsonData[currentSection] = jsonData[currentSection] || {}; // Ensure the section is initialized
      currentExercise = line.slice(1).trim();

      const exerciseNameForUrl = currentExercise.replace(/\s+/g, '_');
      jpgUrl = encodeURI(`https://agaciasta.github.io/formazycia/img/atlas_cwiczen/${exerciseNameForUrl}_1.jpg`);
      jpgUrl2 = encodeURI(`https://agaciasta.github.io/formazycia/img/atlas_cwiczen/${exerciseNameForUrl}_2.jpg`);
      steps = [];
    } else if (line.trim() !== "") {
      steps.push(line.trim());
    }
  });

  if (currentSection && currentExercise) {
    jsonData[currentSection][currentExercise] = { steps, jpgUrl, jpgUrl2 };
  }

  return jsonData;
}

async function saveJSONToFile(url, outputPath) {
  try {
    const jsonData = await loadDataAndGenerateJSON(url);
    await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), "utf-8");
    console.log('JSON data saved to', outputPath);
  } catch (error) {
    console.error("Error loading or processing the text file:", error);
  }
}

// Use the provided URL for the text file
// loadAndGenerateGrid(
//   "https://agaciasta.github.io/formazycia/resource/ATLAS_ĆWICZEŃ.txt"
// );

saveJSONToFile(
  "https://agaciasta.github.io/formazycia/resource/ATLAS_ĆWICZEŃ.txt",
  "atlas.json"
).then(() => {
  //console.log("JSON data saved to", outputPath);
});
