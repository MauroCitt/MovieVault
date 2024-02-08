const Movie = require("../models/movie.js");
const Genre = require("../models/genre.js");

let fetch;

const init = async () => {
    fetch = (await import("node-fetch")).default;
};

init();

const getMoviesController = {
    getTopMovies: async function (req, res) {
        let movieData = [];

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

        try {
            const topMovies = await Movie.find({ providers: { $in: ["Netflix"] } })
                .sort({ vote_average: -1 })
                .limit(12);

            for (let index = 0; index < topMovies.length; index++) {
                const movieId = topMovies[index].id;
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
                    console.log(englishPosters[0].width);
                    const imagePath = englishPosters[0].file_path;
                    movieData.push({ id: movieId, imagePath });
                }
            }
            console.log(movieData);
            res.json(movieData);
        } catch (error) {
            console.error(error);
        }
    },

    getMovieInfo: async function (req, res) {
        const movieId = req.query.idMovie;
        console.log(movieId);

        const movieInfo = await Movie.findOne({ id: movieId });
        console.log(movieInfo);
        const genresId = movieInfo.genero;
        const genresName = await getMoviesController.getGenres(genresId);

        res.json({ movieInfo, genresName });
    },

    getGenres: async function (genresId) {
        const genresName = [];
        console.log(genresId);
        for (const element of genresId) {
            const genre = await Genre.findOne({ id: element });
            genresName.push(genre.nombre);
        }
        console.log(genresName);
        return genresName;
    },

    getReviews: async function (req, res) {
        let movieReviews = [];

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

        const movieId = req.query.idMovie;
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/reviews`,
            options
        );
        const data = await response.json();
        console.log(data);
        res.json(data);
    },
    getDiscoverMovies: async function (req, res) {
        let movieData = [];

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

        try {
            const topMovies = await Movie.find({});
            const movieIds = topMovies.map((movie) => movie.id);
            let randomNumbers = Array.from({length: 12}, () => Math.floor(Math.random() * 200) + 1);


            const movieData = [];
            console.log(topMovies);

            for (let index = 0; index < topMovies.length; index++) {
                const movieId = movieIds[randomNumbers].id;
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
                    console.log(englishPosters[0].width);
                    const imagePath = englishPosters[0].file_path;
                    movieData.push({ id: movieId, imagePath });
                }
            }
            console.log(movieData);
            res.json(movieData);
        } catch (error) {
            console.error(error);
        }
    },
    
};

module.exports = getMoviesController;
