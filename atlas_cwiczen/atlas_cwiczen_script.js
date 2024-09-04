function initializeAtlasCwiczen() {
    console.log("Script loaded and running.");

    function tryInitialize() {
        const displayElement = document.getElementById('atlas_cwiczen_display');
        const topMenuLinks = document.getElementById('menu-links');
        const searchBox = document.getElementById('search-box');

        if (displayElement && topMenuLinks && searchBox) {
            console.log("'atlas_cwiczen_display', 'menu-links', and 'search-box' elements found.");

            // Clear the search box on load to prevent autofill issues
            searchBox.value = '';

            async function loadImage(imageUrl, exerciseName, linkElement) {
                console.log(`Trying to load image from: ${imageUrl}`);
                try {
                    const response = await fetch(imageUrl);
                    if (response.ok) {
                        console.log(`Image loaded successfully from: ${imageUrl}`);
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.alt = exerciseName; // Set alt text to the exercise name

                        linkElement.appendChild(img); // Append the image to the link element
                    } else {
                        console.warn(`Image not found at ${imageUrl}, skipping image loading.`);
                        throw new Error('Image not found');
                    }
                } catch (error) {
                    console.log(`Error loading image from: ${imageUrl}`);
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
                    
                    const lines = text.split('\n');
                    //console.log(`Text file split into ${lines.length} lines.`);

                    let currentSection = null;
                    let gridContainer = null;
                  	let basePreviewNumber = 54839;

                    lines.forEach(line => {
                        line = line.trim();
                        //console.log(`Processing line: ${line}`);

                        if (line.startsWith('|')) {
                            //console.log("Detected new section.");
                            const sectionId = line.substring(1).trim().toLowerCase().replace(/\s+/g, '-');
                            currentSection = document.createElement('div');
                            currentSection.className = 'section-container';
                            currentSection.id = sectionId;

                            // Create section title with arrow
                            const sectionTitle = document.createElement('div');
                            sectionTitle.className = 'section-title';
                            sectionTitle.innerHTML = `<h1>${line.substring(1).trim()}</h1>`;
                            currentSection.appendChild(sectionTitle);

                            // Add to top menu
                            const menuItem = document.createElement('a');
                            menuItem.href = `#${sectionId}`;
                            menuItem.textContent = line.substring(1).trim();
                            topMenuLinks.appendChild(menuItem);

                            // Create arrow to toggle the section
                            const toggleArrow = document.createElement('button');
                            toggleArrow.className = 'section-toggle';
                            toggleArrow.innerHTML = '▼';
                            sectionTitle.addEventListener('click', function() {
                                if (gridContainer.style.display === 'none' || gridContainer.style.display === '') {
                                    gridContainer.style.display = 'grid';
                                    toggleArrow.innerHTML = '▼';
                                    toggleArrow.classList.remove('collapsed');
                                } else {
                                    gridContainer.style.display = 'none';
                                    toggleArrow.innerHTML = '►';
                                    toggleArrow.classList.add('collapsed');
                                }
                            });
                            sectionTitle.appendChild(toggleArrow);

                            // Create a new grid container
                            gridContainer = document.createElement('div');
                            gridContainer.className = 'atlas-cwiczen-grid-container';
                            currentSection.appendChild(gridContainer);

                            displayElement.appendChild(currentSection);
                        } else if (line.startsWith(';') && gridContainer) {
                            //console.log("Detected new grid item.");
                            const gridItem = document.createElement('div');
                            gridItem.className = 'atlas-cwiczen-grid-item';

                            const exerciseName = line.substring(1).trim();

                            const previewUrl = `https://skyier.com/home/courses/5615/preview/${basePreviewNumber}`; // Generate the preview URL
                            basePreviewNumber += 1; // Increment for the next grid item

                            // Create a link element
                            const linkElement = document.createElement('a');
                            linkElement.href = previewUrl;

                           const exerciseNameForUrl = exerciseName.replace(/\s+/g, '_');

                          // Preparing potential image paths with underscores
                          	const baseUrl = "https://agaciasta.github.io/formazycia/img/atlas_cwiczen/";
                          	const img1Jpg = `${baseUrl}${encodeURIComponent(exerciseNameForUrl)}_1.jpg`;
							
                          	loadImage(img1Jpg, exerciseName, linkElement);
                          
                            // Create and append the caption
                            const caption = document.createElement('p');
                            caption.textContent = exerciseName;
                            linkElement.appendChild(caption); // Append the caption after the image

                            // Append the link element to the grid item
                            gridItem.appendChild(linkElement);

                            // Append the grid item to the grid container
                            gridContainer.appendChild(gridItem);
                        }
                    });
                } catch (error) {
                    console.error('Error loading or processing the text file:', error);
                }
            }

            // Use the provided URL for the text file
            loadAndGenerateGrid('https://agaciasta.github.io/formazycia/resource/ATLAS_ĆWICZEŃ.txt');

            // Implement search functionality
            searchBox.addEventListener('input', function() {
                const searchQuery = searchBox.value.toLowerCase();
                const gridItems = document.querySelectorAll('.atlas-cwiczen-grid-item');

                gridItems.forEach(item => {
                    const captionText = item.querySelector('p').textContent.toLowerCase();
                    if (captionText.includes(searchQuery)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        } else {
            console.error("Element with ID 'atlas_cwiczen_display', 'menu-links', or 'search-box' not found.");
        }
    }

    setTimeout(tryInitialize, 500); // Wait for 500ms and then try to initialize
}

// Wait for DOMContentLoaded, then initialize the script
document.addEventListener('DOMContentLoaded', initializeAtlasCwiczen);