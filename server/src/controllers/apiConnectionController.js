const fs = require('fs');
const Movie = require('../models/movie'); // Adjust the path based on your project structure
const { release } = require('os');

let fetch;
let ids = [];

for(id of ids){ 
    console.log("id:" + id);
}

console.log(ids.length);


const init = async () => {
    fetch = (await import('node-fetch')).default;
};

init();

const apiConnectionController = {};

const urlApi = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=120&sort_by=popularity.desc&vote_count.gte=2000';
const urlApiPopular = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";

const apiKey = '4ede0b04611cdf9bdd6b1943d9ac3f24';
const authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWRlMGIwNDYxMWNkZjliZGQ2YjE5NDNkOWFjM2YyNCIsInN1YiI6IjY1NGI3NTYxZmQ0ZjgwMDBjN2ZlNWY4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Wzm-mDwRjmcNv_Nx3XkJtZrxfcfkC805GvdNYUg5stc';

apiConnectionController.getJsonFile = async (req, res, next) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            api_key: apiKey,
            Authorization: authorization
        },
    };

    try {
        let allData = [];
        for (let index = 1; index < 20; index++) {
            let currentUrlApi = urlApi.replace(/page=\d+/, `page=${index}`);
            let response = await fetch(currentUrlApi, options);
            let data = await response.json();
            const movies = data.results;
            ids.push(movies.map((movie) => movie.id));
            await saveMoviesToMongoDB(movies);

            if (index < 20) {
                let currentUrlApi = urlApiPopular.replace(/page=\d+/, `page=${index}`);
                let response = await fetch(currentUrlApi, options);
                let data = await response.json();
                const movies = data.results;
                ids.push(movies.map((movie) => movie.id));
                await saveMoviesToMongoDB(movies);

                console.log(index);
            
            }
        }

        res.json(allData);

        return Promise.resolve(ids);
    } catch (error) {
        console.error(error);
    }
};

const saveMoviesToMongoDB = async (movies) => {
    try {
        for (const movieData of movies) {
            const existingMovie = await Movie.findOne({ id: movieData.id });
            if (!existingMovie) {
                const movie = new Movie({
                    id: movieData.id,
                    title: movieData.title,
                    genero: movieData.genre_ids,
                    director: movieData.director || null,
                    crew: movieData.crew,
                    popularity: movieData.popularity,
                    vote_count: movieData.vote_count,
                    vote_average: movieData.vote_average,
                    release_date: movieData.release_date,
                    overview: movieData.overview
                });
                await movie.save();
            }
        }
        console.log('Películas guardadas en MongoDB');
    } catch (error) {
        console.error("Error al guardar las películas en MongoDB", error);
        throw error;
    }
}
apiConnectionController.getIds = () => ids;

module.exports = apiConnectionController;
