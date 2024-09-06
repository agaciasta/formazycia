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

async function loadAndGenerateGrid(url) {
  //console.log(`Fetching text file from: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch the text file: ${response.statusText}`);
    }
    const text = await response.text();
    //console.log("Text file fetched successfully.");

    const lines = text.split("\n");
    //console.log(`Text file split into ${lines.length} lines.`);

    let currentSection = null;
    let gridContainer = null;
    let basePreviewNumber = 54839;

    lines.forEach((line) => {
      line = line.trim();
      //console.log(`Processing line: ${line}`);

      if (line.startsWith("|")) {
        //console.log("Detected new section.");
        const sectionId = line
          .substring(1)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");
        currentSection = document.createElement("div");
        currentSection.className = "section-container";
        currentSection.id = sectionId;

        // Create section title with arrow
        const sectionTitle = document.createElement("div");
        sectionTitle.className = "section-title";
        sectionTitle.innerHTML = `<h1>${line.substring(1).trim()}</h1>`;
        currentSection.appendChild(sectionTitle);

        // Add to top menu
        const menuItem = document.createElement("a");
        menuItem.href = `#${sectionId}`;
        menuItem.textContent = line.substring(1).trim();
        topMenuLinks.appendChild(menuItem);

        // Create arrow to toggle the section
        const toggleArrow = document.createElement("button");
        toggleArrow.className = "section-toggle";
        toggleArrow.innerHTML = "▼";
        sectionTitle.addEventListener("click", function () {
          if (
            gridContainer.style.display === "none" ||
            gridContainer.style.display === ""
          ) {
            gridContainer.style.display = "grid";
            toggleArrow.innerHTML = "▼";
            toggleArrow.classList.remove("collapsed");
          } else {
            gridContainer.style.display = "none";
            toggleArrow.innerHTML = "►";
            toggleArrow.classList.add("collapsed");
          }
        });
        sectionTitle.appendChild(toggleArrow);

        // Create a new grid container
        gridContainer = document.createElement("div");
        gridContainer.className = "atlas-cwiczen-grid-container";
        currentSection.appendChild(gridContainer);

        displayElement.appendChild(currentSection);
      } else if (line.startsWith(";") && gridContainer) {
        //console.log("Detected new grid item.");
        const gridItem = document.createElement("div");
        gridItem.className = "atlas-cwiczen-grid-item";

        const exerciseName = line.substring(1).trim();
        const encodedExerciseName = encodeURIComponent(exerciseName);
        const exerciseNameForUrl = exerciseName.replace(/\s+/g, '_');

        const jpgUrl = `https://agaciasta.github.io/formazycia/img/atlas_cwiczen/${exerciseNameForUrl}_1.jpg`;
        const jpgUrl2 = `https://agaciasta.github.io/formazycia/img/atlas_cwiczen/${exerciseNameForUrl}_1.png`;

        const previewUrl = `https://skyier.com/home/courses/5615/preview/${basePreviewNumber}`; // Generate the preview URL
        basePreviewNumber += 1; // Increment for the next grid item

        // Create a link element
        const linkElement = document.createElement("a");
        linkElement.href = previewUrl;

        // Load the image into the link element
        loadImage(jpgUrl, jpgUrl2, linkElement);

        // Create and append the caption
        const caption = document.createElement("p");
        caption.textContent = exerciseName;
        linkElement.appendChild(caption); // Append the caption after the image

        // Append the link element to the grid item
        gridItem.appendChild(linkElement);

        // Append the grid item to the grid container
        gridContainer.appendChild(gridItem);
      }
    });
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
