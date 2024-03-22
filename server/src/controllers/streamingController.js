const Movie = require("../models/movie.js");
const Genre = require("../models/genre.js");
const Director = require("../models/director.js");
const { Dir } = require("fs");
const movie = require("../models/movie.js");

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

const streamingController = {
    getStreamingMovies: async function (req, res) {
        let movieData = [];
        const itemsPerPage = 12;
        const currentPage = req.query.page || 1;
        const streaming = req.query.streamingPlatform;
        const genre = req.query.genre;

        let totalMovies;
        let topMovies;

        try {
            if (genre == "All" || genre == "Genres" && streaming != "All") {
                totalMovies = await Movie.countDocuments({ providers: { $in: [streaming] } });
                topMovies = await Movie.find({ providers: { $in: [streaming] } })
                    .sort({ vote_average: -1 })
                    .skip((currentPage - 1) * itemsPerPage)
                    .limit(itemsPerPage);
            } else if (streaming == "All" && genre == "Genres" || streaming == "All" && genre == "All") {
                totalMovies = await Movie.countDocuments();
                topMovies = await Movie.find()
                    .sort({ vote_average: -1 })
                    .skip((currentPage - 1) * itemsPerPage)
                    .limit(itemsPerPage);
            } else if (streaming == "All" && genre != "Genres" || streaming == "All" && genre != "All") {
                let genreSelected = await Genre.find({ nombre: genre });
                let genreId = genreSelected[0].id;
                totalMovies = await Movie.countDocuments({ genero: { $in: [genreId] } });
                topMovies = await Movie.find({ genero: { $in: [genreId] } })
                    .sort({ vote_average: -1 })
                    .skip((currentPage - 1) * itemsPerPage)
                    .limit(itemsPerPage);
            } else {
                let genreSelected = await Genre.find({ nombre: genre });
                let genreId = genreSelected[0].id;
                console.log("a" + genreId);
                console.log("dsad");

                totalMovies = await Movie.countDocuments({ providers: { $in: [streaming] }, genero: { $in: [genreId] } });
                console.log(totalMovies);
                topMovies = await Movie.find({ providers: { $in: [streaming] }, genero: { $in: [genreId] } })
                    .sort({ vote_average: -1 })
                    .skip((currentPage - 1) * itemsPerPage)
                    .limit(itemsPerPage);
            }


            for (let index = 0; index < topMovies.length; index++) {
                const movieId = topMovies[index].id;
                const imageInfo = await fetchImages(movieId);
                if (imageInfo) {
                    movieData.push(imageInfo);
                }
            }
            console.log(movieData);
            res.json({ movies: movieData, totalMovies });
        } catch (error) {
            console.error(error);
        }
    },
    getMovieQuery: async function (req, res) {
        let movieData = [];

        const search = req.query.query;
        const currentPage = req.query.page || 1;
        const itemsPerPage = 12;

        const genre = await Genre.find({ nombre: {$regex: search, $options: "i"} });
        console.log(genre);
        let genreId = -1;

        if (genre.length != 0) {
            genreId = genre[0].id;
        }


        const totalMovies = await Movie.countDocuments({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { director: { $regex: search, $options: "i" } },
                { genero: { $in: genreId }},
                { crew: { $regex: search, $options: "i" } }
            ]
        });
        console.log(search)

        try {
            const movies = await Movie.find({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { director: { $regex: search, $options: "i" } },
                    { genero: { $in: genreId }},
                    { crew: { $regex: search, $options: "i" } }
                ]
            })
            .sort({ vote_average: -1 })
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage);

            console.log(movies);

            for (let index = 0; index < movies.length; index++) {
                const movieId = movies[index].id;
                const imageInfo = await fetchImages(movieId);
                if (imageInfo) {
                    movieData.push(imageInfo);
                }
            }
            console.log(movieData);
            res.json({ movies: movieData, totalMovies });
        } catch (error) {
            console.error(error);
        }
    },
    getMovieQueryName: async function (req, res) {
        let movieData = [];
        let titleCount = {};
    
        const search = req.query.query;
    
        try {
            // Búsqueda de películas por título
            let movies = await Movie.find({
                title: { $regex: search, $options: "i" }
            })

            console.log(movies);

            // Búsqueda de directores por nombre desde las películas elegidas.
            let crewMovie = await Movie.find({
                crew: { $regex: new RegExp(search, "i") }
            });

            let actors = new Set();

            crewMovie.forEach(element => {
                const crewMember = element.crew;
                for (let index = 0; index < crewMember.length; index++) {
                    const actor = crewMember[index];
                    if (actor.includes(search)) {
                        console.log(actor);
                        actors.add(actor);
                    }
                }
            });

            let directors = await Director.find({
                nombre: { $regex: search, $options: "i" } });

            if (movies.length > 4){
            movies = movies.slice(0, 4);
            }

            if (directors.length > 3){
                directors = directors.slice(0, 3);
            }

            if (actors.length > 3){
                actors = actors.slice(0, 3);
            }

            actors = Array.from(actors);
            actors.forEach(element => {
                movieData.push(element);
            });


        
            for (let index = 0; index < movies.length; index++) {
                const movieTitle = movies[index].title;
                const movieYear = movies[index].release_date.split("-")[0]; 
    
                if (titleCount[movieTitle]) {
                    movieData.push(`${movieTitle} (${movieYear})`);
                } else {
                    movieData.push(movieTitle);
                }

                titleCount[movieTitle] = (titleCount[movieTitle] || 0) + 1;
            }

            for (let index = 0; index < directors.length; index++) {
                const directorName = directors[index].nombre;
                movieData.push(directorName);
            }

            let uniqueMovieData = [...new Set(movieData)];
            movieData = Array.from(uniqueMovieData);

            res.json({ movieData });
        } catch (error) {
            console.error(error);
        }
    }
};

module.exports = streamingController;