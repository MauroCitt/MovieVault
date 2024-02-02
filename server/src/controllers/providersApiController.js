const Movie = require("../models/movie.js");
const { apiConnectionController } = require("./apiConnectionController.js");

let fetch;

const init = async () => {
    fetch = (await import("node-fetch")).default;
};

init();

const providerApiController = {};

const apiKey = '4ede0b04611cdf9bdd6b1943d9ac3f24';
const authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWRlMGIwNDYxMWNkZjliZGQ2YjE5NDNkOWFjM2YyNCIsInN1YiI6IjY1NGI3NTYxZmQ0ZjgwMDBjN2ZlNWY4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Wzm-mDwRjmcNv_Nx3XkJtZrxfcfkC805GvdNYUg5stc';
const urlApiMovie = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=10000';

providerApiController.getJsonFile = async (req, res, next) => {
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
        for (let index = 1; index < 14; index++) {
            let currentUrlApi = urlApiMovie.replace(/page=\d+/, `page=${index}`);
            let response = await fetch(currentUrlApi, options);
            let data = await response.json();
            const movies = data.results;
            idsLista.push(movies.map((movie) => movie.id));
        }
    } catch (error) {
        console.log(error);
    }

    try {
        const placeCode = "ES";

        for (var ids of idsLista) {
            for (var idMovie of ids) {
                let flatrateProviders = [];
                let buyProviders = [];

                const urlApi =
                    "https://api.themoviedb.org/3/movie/" + idMovie + "/watch/providers";
                console.log(urlApi);

                let response = await fetch(urlApi, options);
                let data = await response.json();

                const providersForPlace = data.results && data.results[placeCode];

                if (providersForPlace) {
                    const flatrateProviders = providersForPlace.flatrate || [];
                
                    const flatrateProviderNames = flatrateProviders.map(
                        (provider) => provider.provider_name
                    );
                
                    console.log(flatrateProviderNames);
                    
                    await Movie.findOneAndUpdate(
                        { id: idMovie },
                        { providers: flatrateProviderNames },
                        { new: true, upsert: true }
                    );
                
                    allData.push(data);
                }
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

};

module.exports = providerApiController;
