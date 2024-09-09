const fs = require("fs");

// Read the JSON data from atlas.json
fs.readFile("atlas.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading atlas.json:", err);
    return;
  }

  const exercisesData = JSON.parse(data);

  // Generate the HTML content
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exercise Index</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        <link href="style.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display&display=swap" rel="stylesheet">
    </head>
    <body>
      <nav class="navbar navbar-expand-lg bg-body-tertiary" id="top-menu">
          <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
          </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0"> `
            
    for (category in exercisesData)
    {
      const sectionId = category.trim().toLowerCase().replace(/\s+/g, '-');

        htmlContent += `
        <li class="nav-item">
        <a class="nav-link" href="#${sectionId}">${category}</a>
        </li>`;
    }
            
    htmlContent+= `
    </ul>

            <input type="text" class="me-2" id="search" placeholder="Search exercises..." autocomplete="off" autofill="off" autocorrect="off" spellcheck="false">
            </div>
            </nav>
        <div id="exercise-list">
    `;



    
    let basePreviewNumber = 54839;
  // Add exercises to the HTML content
  for (const category in exercisesData) {

    const sectionId = category.trim().toLowerCase().replace(/\s+/g, '-');

    htmlContent += `
            <div class="section-container" id="${sectionId}">
            <h2 class="section-title">${category}</h2> 
            <div class="row row-cols-1 row-cols-md-3 row-cols-xl-4 ms-5 me-5 text-center">
            `;

    for (const exercise in exercisesData[category]) {
      const details = exercisesData[category][exercise];
      const jpg = details.jpgUrl;

      const previewUrl = `https://skyier.com/home/courses/5615/preview/${basePreviewNumber}`;
      htmlContent += `
            <a class="card-link exercise text-decoration-none" data-name="${exercise.toLowerCase()}" href='https://skyier.com/home/courses/5615/preview/${basePreviewNumber++}' target="_parent"> 
            <div class="col mb-4">
                <div class="card">
                    <img src="${jpg}" class="card-img-top" alt="${exercise}">
                    <div class="card-body">
                        <h5 class="card-title">${exercise}</h5>
                        
            `;

      htmlContent += `
                    </div>
                </div>
            </div>
            </a>
            `;
    }

    htmlContent+= `
    </div>
    </div>`
  }

  // Close the HTML content
  htmlContent += `
        </div>
        <script>
            document.getElementById('search').addEventListener('input', function() {
                var searchValue = this.value.toLowerCase();
                var exercises = document.querySelectorAll('.exercise');
                exercises.forEach(function(exercise) {
                    var exerciseName = exercise.getAttribute('data-name');
                    if (exerciseName.includes(searchValue)) {
                        exercise.style.display = 'block';
                    } else {
                        exercise.style.display = 'none';
                    }
                });
            });

        </script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    </body>
    </html>
    `;

  // Save the HTML content to a file
  fs.writeFile("index.html", htmlContent, "utf8", (err) => {
    if (err) {
      console.error("Error writing index.html:", err);
    } else {
      console.log("index.html has been saved.");
    }
  });
});
