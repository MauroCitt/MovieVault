const Movie = require("../models/movie.js");
const Genre = require("../models/genre.js");

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
            if (genre == "All" || genre == "Genres") {
                totalMovies = await Movie.countDocuments({ providers: { $in: [streaming] } });
                topMovies = await Movie.find({ providers: { $in: [streaming] } })
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
    getStreamingAndGenre: async function(req, res) {
        let movieData = [];
        const itemsPerPage = 12;
        const currentPage = req.query.page || 1;
        const streaming = req.query.streamingPlatform;
        const genre = req.query.genre;

        console.log(genre);

        try{
            if (genre == "All" || genre == "Genres") {
                const totalMovies = await Movie.countDocuments({providers: { $in: [streaming]}});
                const topMovies = await Movie.find({providers: { $in: [streaming]}})
                    .sort({vote_average: -1})
                    .skip((currentPage - 1) * itemsPerPage)
                    .limit(itemsPerPage);

                for (let index = 0; index < topMovies.length; index++) {
                    const movieId = topMovies[index].id;
                    const imageInfo = await fetchImages(movieId);
                    if (imageInfo) {
                        movieData.push(imageInfo);
                    }
                }
                res.json({ movies: movieData, totalMovies });
                return; 
            }

            let genreId = await Genre.find({name: genre});

            const totalMovies = await Movie.countDocuments({providers: { $in: [streaming]}, genres: { $in: [genreId]}});
            const topMovies = await Movie.find({providers: { $in: [streaming]}, genres: { $in: [genreId]}})
                .sort({vote_average: -1})
                .skip((currentPage - 1) * itemsPerPage)
                .limit(itemsPerPage);

            for (let index = 0; index < topMovies.length; index++) {
                const movieId = topMovies[index].id;
                const imageInfo = await fetchImages(movieId);
                if (imageInfo) {
                    movieData.push(imageInfo);
                }
            }
            res.json({ movies: movieData, totalMovies });
        } catch(error) {
            console.error(error);
        }
    }
};

module.exports = streamingController;