const fs = require("fs");
const apiConnectionController = require("./apiConnectionController.js");
const Movie = require("../models/movie");
const Director = require("../models/director");

const init = async () => {
    fetch = (await import("node-fetch")).default;
};

init();

const crewApiController = {};

const apiKey = "4ede0b04611cdf9bdd6b1943d9ac3f24";
const authorization =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWRlMGIwNDYxMWNkZjliZGQ2YjE5NDNkOWFjM2YyNCIsInN1YiI6IjY1NGI3NTYxZmQ0ZjgwMDBjN2ZlNWY4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Wzm-mDwRjmcNv_Nx3XkJtZrxfcfkC805GvdNYUg5stc";

const urlApiMovie = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=10000';


crewApiController.getJsonFile = async (req, res, next) => {
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
        for (var ids of idsLista) {
            for (var id of ids) {
                const urlApi = `https://api.themoviedb.org/3/movie/${id}/credits`;

                let response = await fetch(urlApi, options);
                let data = await response.json();
                const crew = data.crew;
                const cast = data.cast;

                let director = null;
                let mainActors = [];

                console.log(id);

                for (let person of crew) {
                    if (person.job === "Director") {
                        director = person.name;

                        let directorDoc = await Director.findOne({ id: person.id });

                        if (!directorDoc) {
                            directorDoc = new Director({
                                id: person.id,
                                nombre: person.name,
                                peliculas: [id],
                            });
                        } else {
                            if (!directorDoc.peliculas.includes(id)) {
                                directorDoc.peliculas.push(id);
                            }
                        }
                        await directorDoc.save();
                        await Movie.findOneAndUpdate(
                            { id: id },
                            { $set: { director: director } },
                            { new: true }
                        );
                        break;
                    }
                }

                for (let index = 0; index < 3; index++) {
                    mainActors.push(cast[index].name);
                }

                await Movie.findOneAndUpdate(
                    { id: id },
                    { $set: { crew: mainActors } },
                    { new: true }
                );

                allData.push(data);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

    res.json(allData);
};

module.exports = crewApiController;
