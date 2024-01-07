// Movie Database API key and base image URL
const apiKey = "fe02d481f81e151556516026414ba404";
const imgApi = "https://image.tmdb.org/t/p/w1280";

// URL for querying movies
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

// DOM elements
const form = document.getElementById("form");
const query = document.getElementById("search");
const main = document.getElementById("main");
const titleElement = document.getElementById("title");
const clearSearchBtn = document.getElementById("clearSearch");
const searchInput = document.getElementById("search");

let page = 1;
let isSearching = false;

// Gets JSON data from url
async function getData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

// Displays results based on URL
async function display(url) {
    const data = await getData(url);
    if (data && data.results) {
        const newContent = data.results.map(createCard).join("");
        main.innerHTML += newContent || "<p>No results found.</p>";
    }
}

// Create movie card html template
function createCard(movie) {
    const { poster_path, original_title, overview } = movie;
    const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";
    const truncatedTitle = original_title.length > 20 ? original_title.slice(0, 20) + "..." : original_title;
    const truncatedOverview = overview.length > 340 ? overview.slice(0, 340) + "..." : overview;
    const cardTemplate = `
        <div class="column">
            <div class="card">
                <a class="card-media" href="${imagePath}">
                    <img src="${imagePath}" alt="${original_title}" width="100%" />
                </a>
                <div class="card-content">
                    <div class="card-header">
                        <div class="title">
                            <h3 style="font-weight: 600">${truncatedTitle}</h3>
                        </div>
                        <div class="poster-button">
                            <a href="${imagePath}" target="_blank" class="card-btn">Poster</a>
                        </div>
                    </div>
                    <div class="info">
                        ${truncatedOverview || "No overview yet..."}
                    </div>
                </div>
            </div>
        </div>
    `;
    return cardTemplate;
}

// Clear result element for search
function removeElement() {
    main.innerHTML = "";
}

// Load more results
async function loadMoreResults() {
    if (isSearching) {
        return;
    }
    page++;
    const searchTerm = query.value;
    const url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}` : 
    `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    await display(url);
}

// Detect end of page and load more results
function detectEnd() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults();
    }
}

// Handle search
async function handleSearch(e) {
    e.preventDefault();
    const searchTerm = query.value.trim();
    if (searchTerm) {
        isSearching = true;
        removeElement();
        const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await display(newUrl);
        query.value = "";
    }
}

// Event listeners
form.addEventListener('submit', handleSearch);
window.addEventListener('scroll', detectEnd);
window.addEventListener('resize', detectEnd);
titleElement.addEventListener('click', init);
clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
});

// Initialize the page
async function init() {
    removeElement();
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    isSearching = false;
    await display(url);
}

init();