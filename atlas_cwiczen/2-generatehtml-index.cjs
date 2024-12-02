
async function getLectureId(sectionTitle, lectureTitle) {
  try {
    const fs = require("fs").promises;

    // Load JSON data
    const jsonData = await fs.readFile("acw_index.json", "utf8");
    const data = JSON.parse(jsonData);

    // Find the section by title
    const section = data.sections.find(sec => sec.title.toLowerCase() === sectionTitle.toLowerCase());
    if (!section) {
      console.error(`Section titled "${sectionTitle}" not found.`);
      return null;
    }

    // Find the lecture by title in the section
    const lecture = section.lectures.find(lec => lec.title.toLowerCase() === lectureTitle.toLowerCase());
    if (!lecture) {
      console.error(`Lecture titled "${lectureTitle}" not found in section "${sectionTitle}".`);
      return null;
    }

    // Return the lecture ID
    return lecture.id;
  } catch (err) {
    console.error("Error reading or parsing JSON file:", err);
    return null;
  }
}



async function loadAndParseFiles() {
  try {
    const fs = require("fs").promises; // Correctly import fs.promises
    // Read both files using fs.promises
    const exerciseJsData = await fs.readFile("atlas.json", "utf8");

    // Parse the JSON data
    const exercisesData = JSON.parse(exerciseJsData);


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
              <nav class="position-sticky top-0 navbar navbar-expand-lg bg-body-tertiary" id="top-menu">
            <div class="container-fluid">
              <div class="d-flex w-100 justify-content-between row">
                
                <div class="d-lg-none d-flex align-items-right col">
                  <input type="text" class="form-control search" id="search-sm" placeholder="Search exercises..." autocomplete="off" autofill="off" autocorrect="off" spellcheck="false">
                  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                  </button>
                </div>
          
                <div class="d-flex col-11 col-lg-12 align-items-center">
                  <div class="collapse navbar-collapse flex-grow-1" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mt-1 mb-1 mb-lg-0">`
            
    for (category in exercisesData)
    {
      const sectionId = category.trim().toLowerCase().replace(/\s+/g, '-');

        htmlContent += `
        <li class="nav-item">
        <a class="nav-link ps-2" href="#${sectionId}">${category}</a>
        </li>`;
    }
            
    htmlContent+= `
                    </ul>
                  </div>
          
                  <div class="d-none d-lg-block  end-0">
                    <input type="text" class="form-control search" id="search-lg" placeholder="Search exercises..." autocomplete="off" autofill="off" autocorrect="off" spellcheck="false">
                  </div>
                </div>
          
              </div>
            </div>
          </nav>
    `;



  // Add exercises to the HTML content
  for (const category in exercisesData) {

    const sectionId = category.trim().toLowerCase().replace(/\s+/g, '-');

    htmlContent += `
            <div class="section-container" id="${sectionId}">
            <h2 class="section-title">${category}</h2> 
            <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 ms-5 me-5 text-center">
                        `;

    for (const exercise in exercisesData[category]) {
      const details = exercisesData[category][exercise];
      const jpg = details.jpgUrl;

      const lectureId = await getLectureId(category, exercise);

      htmlContent += `
            <a class="card-link exercise text-decoration-none" 
            data-name="${exercise.toLowerCase()}" 
            href='/atlas-cwiczen/watch/${lectureId}'
            ac-lecture-id="${lectureId}"
            target="_parent"
            > 
            <div class="col mb-4" ac-lecture-id="${lectureId}">
                <div class="card" ac-lecture-id="${lectureId}">
                    <img src="${jpg}" class="card-img-top" alt="${exercise}" ac-lecture-id="${lectureId}">
                    <div class="card-body" ac-lecture-id="${lectureId}">
                        <h5 class="card-title" ac-lecture-id="${lectureId}">${exercise}</h5>
                        
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
        var searchSm = document.getElementById('search-sm');
        var searchLg = document.getElementById('search-lg');

        function syncSearchInputs(event) {
        const searchValue = event.target.value.toLowerCase();
        const exercises = document.querySelectorAll('.exercise');

    exercises.forEach((exercise) => {
        const exerciseName = exercise.getAttribute('data-name').toLowerCase();

            if (exerciseName.includes(searchValue)) {
                // Show element if it's hidden
                if (exercise.style.display === "none" || exercise.classList.contains('hidden')) {
                    exercise.style.display = "block"; // Make sure it's visible in the layout
                    requestAnimationFrame(() => exercise.classList.remove('hidden')); // Trigger animation
                }
            } else {
                // Hide element if it's visible
                if (!exercise.classList.contains('hidden')) {
                    exercise.classList.add('hidden');
                    setTimeout(() => {
                        exercise.style.display = "none";
                    }, 200); // Match duration with CSS transition
                }
            }
        });
}

        searchSm.addEventListener('input', syncSearchInputs);
        searchLg.addEventListener('input', syncSearchInputs);

        const cardLinks = document.querySelectorAll('a.card-link');

            cardLinks.forEach(cardLink => {
                cardLink.addEventListener('click', function(event) {
                    event.preventDefault();

                    const lecture_id = event.currentTarget.getAttribute('ac-lecture-id');

                    window.parent.postMessage({ action: 'navigate', lecture_id: lecture_id }, '*');
                });
            });


    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
        crossorigin="anonymous"></script>
        </body>
    </html>
    `;

    // Write the HTML content to index.html
    await fs.writeFile("index.html", htmlContent, "utf8");
    console.log("index.html has been saved.");
  } catch (err) {
    console.error("Error reading or parsing JSON files:", err);
  }
}

loadAndParseFiles();