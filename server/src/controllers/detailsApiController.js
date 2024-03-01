const Movie = require("../models/movie.js");
const { apiConnectionController } = require("./apiConnectionController.js");

let fetch;

const init = async () => {
    fetch = (await import("node-fetch")).default;
};

init();

const detailsApiController = {};

const apiKey = '4ede0b04611cdf9bdd6b1943d9ac3f24';
const authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWRlMGIwNDYxMWNkZjliZGQ2YjE5NDNkOWFjM2YyNCIsInN1YiI6IjY1NGI3NTYxZmQ0ZjgwMDBjN2ZlNWY4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Wzm-mDwRjmcNv_Nx3XkJtZrxfcfkC805GvdNYUg5stc';
const urlApiMovie = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=2000';
const urlApiPopular = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";


detailsApiController.getJsonFile = async (req, res, next) => {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            api_key: apiKey,
            Authorization: authorization,
        },
    };

    let allData = [];
    let idsLista = [];

    try {
        for (let index = 1; index < 101; index++) {
            let currentUrlApi = urlApiMovie.replace(/page=\d+/, `page=${index}`);
            let response = await fetch(currentUrlApi, options);
            let data = await response.json();
            const movies = data.results;
            idsLista.push(movies.map((movie) => movie.id));

            if (index < 20) {
                let currentUrlApi = urlApiPopular.replace(/page=\d+/, `page=${index}`);
                let response = await fetch(currentUrlApi, options);
                let data = await response.json();
                const movies = data.results;
                idsLista.push(movies.map((movie) => movie.id));
            }
        }
    } catch (error) {
        console.log(error);
    }

    try {
        let runtime;

        for (var ids of idsLista) {
            for (var idMovie of ids) {
                let producersName = [];

                const urlApi =
                    'https://api.themoviedb.org/3/movie/'+ idMovie +'language=en-US';
                console.log(urlApi);

                let response = await fetch(urlApi, options);
                let data = await response.json();
                console.log(data);

                const producers = data.production_companies;

                let movie = await Movie.findOne({ id: idMovie });

                if (!movie.runtime) {
                    await Movie.findOneAndUpdate(
                        { id: idMovie },
                        { runtime: data.runtime},
                        { new: true, upsert: true }
                    );
                }

                producers.forEach(element => {
                    producersName.push(element.name);
                });

                if (!movie.producers || movie.producers.length === 0) {
                    await Movie.findOneAndUpdate(
                        { id: idMovie },
                        { producers: producersName},
                        { new: true, upsert: true }
                    );
                }
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};

module.exports = detailsApiController;
