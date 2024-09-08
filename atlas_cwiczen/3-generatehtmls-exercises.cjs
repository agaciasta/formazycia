const fs = require("fs");
const path = require("path");

// Read the JSON data from atlas.json
fs.readFile("atlas.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading atlas.json:", err);
    return;
  }


  const dir = path.join(__dirname, "exercises");

  if(!fs.existsSync(dir))
    {
        fs.mkdirSync(dir, {recursive: true});
    }

  const exercisesData = JSON.parse(data);

  // Add exercises to the HTML content
  for (const category in exercisesData) {

    for (const exercise in exercisesData[category]) {
      const details = exercisesData[category][exercise];

      let htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Exercise Index</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
          <link href="../style.css" rel="stylesheet">
      </head>
      <body><div id="exercise-content-atlas-cwiczen">`;
      htmlContent += `
                    <h1>${exercise}</h1>
                    <div class="image-container">
                        <img src="${details.jpgUrl}" alt="${exercise} Image 1">
                        <img src="${details.jpgUrl2}" alt="${exercise} Image 2">
                    </div>
                    <p>
            `;
            for(const step in details.steps)
              htmlContent += `${details.steps[step]}<br>`;
            htmlContent += `</p></div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
        </body>
        </html>
        `;

        const exerciseNameForUrl = exercise.replace(/\s+/g, '_');
        let filePath = path.join(dir, exerciseNameForUrl + '.html');
          // Save the HTML content to a file
            fs.writeFile(filePath, htmlContent, "utf8", (err) => {
                if (err) {
                console.error("Error writing " + exerciseNameForUrl + ".html: ", err);
                } else {
                console.log(exerciseNameForUrl + ".html has been saved.");
                }
            });

    }

  }


});
