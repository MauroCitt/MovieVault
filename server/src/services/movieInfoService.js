const Movie = require("../models/movie.js");
const Genre = require("../models/genre.js");
const User = require("../models/user.js");
const getMoviesController = require("../controllers/getMoviesController.js");

let fetch;

const init = async () => {
    fetch = (await import("node-fetch")).default;
};

init();

const apiKey = "4ede0b04611cdf9bdd6b1943d9ac3f24";
const authorization =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWRlMGIwNDYxMWNkZjliZGQ2YjE5NDNkOWFjM2YyNCIsInN1YiI6IjY1NGI3NTYxZmQ0ZjgwMDBjN2ZlNWY4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Wzm-mDwRjmcNv_Nx3XkJtZrxfcfkC805GvdNYUg5stc";
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        api_key: apiKey,
        Authorization: authorization,
    },
};

const getGenres = async function (genresId) {
    const genresName = [];
    for (const element of genresId) {
        const genre = await Genre.findOne({ id: element });
        genresName.push(genre.nombre);
    }
    return genresName;
};

async function fetchMovieInfo(movieId, userEmail) {
    let watched = false;
    let wantToWatch = false;

    userEmail = userEmail.replaceAll("\"", "");

    const movieInfo = await Movie.findOne({ id: movieId });
    const user = await User.findOne({ Email: userEmail });

    if (user.watched.includes(movieId)) {
        watched = true;
    } else if (user.wantToWatch.includes(movieId)) {
        wantToWatch = true;
    }

    const genresId = movieInfo.genero;
    const genresName = await getGenres(genresId);

    let backdropPath = null;

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}`,
            options
        );
        const data = await response.json();
        backdropPath = data.backdrop_path;
    } catch (error) {
        console.log(error);
    }

    return { movieInfo, genresName, backdropPath, watched, wantToWatch };
}

const fetchImages = async function (movieId) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/images`,
            options
        );
        const data = await response.json();
        let englishPosters = data.posters.filter(
            (poster) => poster.iso_639_1 === "en"
        );
        if (englishPosters.length > 0) {
            englishPosters.sort((a, b) => b.width - a.width);
            const imagePath = englishPosters[0].file_path;
            return { id: movieId, imagePath };
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports = {
    fetchMovieInfo,
    getGenres,
    fetchImages
};