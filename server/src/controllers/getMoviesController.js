const Movie = require('../models/movie.js');

let fetch;

const init = async () => {
    fetch = (await import('node-fetch')).default;
};

init();

const getMoviesController = {
    getTopMovies: async function(req, res) {
        let movieData = []

        const apiKey = '4ede0b04611cdf9bdd6b1943d9ac3f24';
        const authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWRlMGIwNDYxMWNkZjliZGQ2YjE5NDNkOWFjM2YyNCIsInN1YiI6IjY1NGI3NTYxZmQ0ZjgwMDBjN2ZlNWY4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Wzm-mDwRjmcNv_Nx3XkJtZrxfcfkC805GvdNYUg5stc';
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                api_key: apiKey,
                Authorization: authorization,
            },
        };

        try {
            const topMovies = await Movie.find({ providers: { $in: ['Netflix'] } }).sort({ vote_average: -1 }).limit(12);

            for (let index = 0; index < topMovies.length; index++) {
                const movieId = topMovies[index].id;
                const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options);
                const data = await response.json();
                let englishPosters = data.posters.filter(poster => poster.iso_639_1 === 'en');
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

    getMovieInfo: async function(req, res) {
        const movieId = req.query.idMovie;
        console.log(movieId);

        const movieInfo = await Movie.findOne({id: movieId});
        console.log(movieInfo);
        res.json(movieInfo);
    }
}

module.exports = getMoviesController;