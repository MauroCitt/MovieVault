const Movie = require("../models/movie.js");
const Genre = require("../models/genre.js");
const User = require("../models/user.js");
const { fetchMovieInfo, getGenres, fetchImages } = require('../services/movieInfoService.js');

let fetch;

const init = async () => {
    fetch = (await import("node-fetch")).default;
};

init();

let discoverMoviesData = null;

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


const getMoviesController = {
    getTopMovies: async function (req, res) {
        let movieData = [];

        try {
            const topMovies = await Movie.find({ providers: { $in: ["Netflix"] } })
                .sort({ vote_average: -1 })
                .limit(12);

            for (let index = 0; index < topMovies.length; index++) {
                const movieId = topMovies[index].id;
                const imageInfo = await fetchImages(movieId);
                if (imageInfo) {
                    movieData.push(imageInfo);
                }
            }
            res.json(movieData);
        } catch (error) {
            console.error(error);
        }
    },
    getAllGenres: async function (req, res) {
        const genres = await Genre.find({});
        res.json(genres);
    },
    getMovieInfo: async (req, res) => {
        const movieId = req.query.idMovie;
        let userEmail = req.query.email;

        console.log(userEmail);
    
        const movieData = await fetchMovieInfo(movieId, userEmail);
    
        res.json(movieData);
    },

    getReviews: async function (req, res) {
        let movieReviews = [];

        try {
            const movieId = req.query.idMovie;
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/reviews`,
                options
            );
            const data = await response.json();
            res.json(data);
        } catch (error) {
            console.error(error);
        }
    },

    getDiscoverMovies: async function (req, res) {
        if (discoverMoviesData) {
            return res.json(discoverMoviesData);
        }

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

        try {
            const response = await fetch(
                'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
                options
            );

            const data = await response.json();
            const pelis = data.results;
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
                    const imagePath = englishPosters[0].file_path;
                    movieData.push({ id: movieId, imagePath });
                }
            }
            res.json(movieData);
        } catch (error) {
            console.error(error);
        }
    },

    getMomentMovie: async function (req, res) {
        try {
            const response = await fetch(
                'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
                options
            );

            const data = await response.json();
            const pelis = data.results;
            let topMovies = pelis.slice(0, 3).map(peli => ({ movie: peli, score: (peli.vote_average + peli.vote_count + peli.popularity) / 3 }));

            for (let index = 3; index < pelis.length; index++) {
                const element = pelis[index];
                const averageScore = (element.vote_average + element.vote_count + element.popularity) / 3;
                let minScoreMovie = topMovies.reduce((min, movie) => movie.score < min.score ? movie : min, topMovies[0]);
                if (averageScore > minScoreMovie.score) {
                    minScoreMovie.movie = element;
                    minScoreMovie.score = averageScore;
                }
            }

            let bestMovie = topMovies[Math.floor(Math.random() * topMovies.length)].movie;

            const response2 = await fetch(
                `https://api.themoviedb.org/3/movie/${bestMovie.id}/images`,
                options
            );

            const dataPoster = await response2.json();
            let englishPosters = dataPoster.posters.filter(
                (poster) => poster.iso_639_1 === "en"
            );
            const imagePath = englishPosters[0].file_path;

            const movieInfo = await Movie.findOne({ id: bestMovie.id });

            const genresId = movieInfo.genero;
            const genresName = await getGenres(genresId);

            const topThree = await getMoviesController.getRecommendations(movieInfo.id);

            const topThreeImages = await Promise.all(topThree.map(async (movie) => {
                return await fetchImages(movie.id);
            }));

            res.json({ movieInfo, bestMovie, imagePath, genresName, topThreeImages, topThree });
        } catch (error) {
            console.error(error);
        }
    },
    getRecommendations: async function (movieId) {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`,
                options
            );

            const data = await response.json();
            const pelis = data.results;

            const validMovies = [];
            for (let i = 0; i < pelis.length; i++) {
                if (validMovies.length >= 3) {
                    break;
                }

                const movie = pelis[i];
                const isInDatabase = await getMoviesController.isMovieInDatabase(movie.id);
                if (isInDatabase) {
                    validMovies.push(movie);
                }
            }

            return validMovies;

        } catch (error) {
            console.error(error);
        }
    },
    isMovieInDatabase: async function (movieId) {
        const movie = await Movie.findOne({ id: movieId });
        return movie !== null;
    },
    getTwelveMovies: async function (req, res) {
        let movieData = [];

        try {
            const response = await fetch(
                'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
                options
            );

            const data = await response.json();
            const pelis = data.results;
            let topMovies = pelis.slice(0, 12);

            for (let index = 0; index < topMovies.length; index++) {
                const movieId = topMovies[index].id;
                const imageInfo = await fetchImages(movieId);
                if (imageInfo) {
                    movieData.push(imageInfo);
                }
            }
            res.json(movieData);
        } catch (error) {
            console.error(error);
        }
    },
    getProviders: async function (req, res) {
        const idMovie = req.query.idMovie;
        const placeCode = "ES";

        const urlApi = "https://api.themoviedb.org/3/movie/" + idMovie + "/watch/providers";

        try {
            const response = await fetch(
                urlApi,
                options
            );
            let data = await response.json();
            const providersForPlace = data.results && data.results[placeCode];

            if (providersForPlace) {
                const flatrateProviders = providersForPlace.flatrate || [];

                const flatrateProviderNames = flatrateProviders.map(
                    (provider) => provider.provider_name
                );

                const flatrateProviderLogos = flatrateProviders.map(
                    (provider) => provider.logo_path
                );

                console.log(flatrateProviderNames);
                res.json({ names: flatrateProviderNames, logos: flatrateProviderLogos });

            }
        } catch (error) {
            console.log(error)
        }
    },
    getCastInfo: async function (req, res) {
        const idMovie = req.query.idMovie;
        let actors;
        const urlApi = 'https://api.themoviedb.org/3/movie/' + idMovie + '/credits?language=en-US';

        try {
            const response = await fetch(
                urlApi,
                options
            );
            let data = await response.json();
            let cast = data.cast;
            let filteredCast = cast.filter(actor => actor.order >= 0 && actor.order <= 7);

            let newCast = filteredCast.map(actor => ({
                name: actor.name,
                profile_path: actor.profile_path,
                character: actor.character
            }));


            res.json(newCast);

        } catch (error) {
            console.error(error);
        }
    },
    getMovieTrailer: async function (req, res) {
        const idMovie = req.query.idMovie;
        const urlApi = 'https://api.themoviedb.org/3/movie/' + idMovie + '/videos?language=en-US';

        let key;

        try {
            const response = await fetch(
                urlApi,
                options
            );
            let data = await response.json();
            const trailers = data.results.filter(video => video.type === 'Trailer');
            if (trailers.length > 0) {
                key = trailers[0].key
            }

            console.log("llave: " + key);
            res.json(key);
        } catch (error) {
            console.error(error)
        }
    },
    getProducersLogo: async function (req, res) {
        const idMovie = req.query.idMovie;
        const urlApi = 'https://api.themoviedb.org/3/movie/' + idMovie + '?language=en-US';

        try {
            const response = await fetch(
                urlApi,
                options
            );
            let data = await response.json();
            const producers = data.production_companies;
            const validProducers = producers.filter(producer => producer.logo_path);

            const producersNames = validProducers.map(producer => producer.name);
            const producersLogos = validProducers.map(producer => producer.logo_path);

            res.json({ names: producersNames, logos: producersLogos });
        } catch (error) {
            console.error(error);
        }
    }
};

module.exports = getMoviesController;