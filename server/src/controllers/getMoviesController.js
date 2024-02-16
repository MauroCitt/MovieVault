const Movie = require("../models/movie.js");
const Genre = require("../models/genre.js");

let fetch;

const init = async () => {
    fetch = (await import("node-fetch")).default;
};

init();
let discoverMoviesData = null;

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

        if (discoverMoviesData) {
            return res.json(discoverMoviesData);
        }

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
            let randomNumbers = [];
            let set = new Set();
            while (set.size < 12) {
                set.add(Math.floor(Math.random() * 200) + 1);
            }
            randomNumbers = Array.from(set);

            const movieData = [];

            for (let index = 0; index < randomNumbers.length; index++) {
                const movieId = movieIds[randomNumbers[index]];
                console.log(movieId);
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
            discoverMoviesData = movieData;
            res.json(movieData);
        } catch (error) {
            console.error(error);
        }
    },
    getNewMovies: async function (req, res) {

        let movieData = [];
        const pelisResultados = [];

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

        const response = await fetch(
            'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
            options
        );

        const data = await response.json();
        console.log(data);
        const pelis = data.results;
        console.log("pelis\n" + pelis);
        for (let index = 0; index < 12; index++) {
            const element = pelis[index];
            pelisResultados.push(element);
        }

        for (let index = 0; index < pelisResultados.length; index++) {
            const movieId = pelisResultados[index].id;
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


    },
    getMomentMovie: async function (req, res) {
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

        const response = await fetch(
            'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
            options
        );

        const data = await response.json();
        console.log(data);
        const pelis = data.results;
        let c = (pelis[0].vote_average + pelis[0].vote_count) / 2; 
        let bestMovie = pelis[0];

        for (let index = 0; index < pelis.length; index++) {
            const element = pelis[index];
            const averageScore = (element.vote_average + element.vote_count) / 2; 
            if (averageScore > c) {
                c = averageScore;
                bestMovie = element;
            }
        }

        const response2 = await fetch(
            `https://api.themoviedb.org/3/movie/${bestMovie.id}/images`,
            options
        );

        const dataPoster = await response2.json();
        let englishPosters = dataPoster.posters.filter(
            (poster) => poster.iso_639_1 === "en"
        );
        const imagePath = englishPosters[2].file_path;

        const movieInfo = await Movie.findOne({ id: bestMovie.id });


        console.log(bestMovie);
        const genresId = movieInfo.genero;
        const genresName = await getMoviesController.getGenres(genresId);

        res.json({ bestMovie, imagePath, genresName });
        
    }

};

module.exports = getMoviesController;
