const Movie = require("../models/movie.js");

let fetch;

const init = async () => {
    fetch = (await import("node-fetch")).default;
};

init();



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

const fixing = {
    fixMissingTitles: async function (req, res, next) {


        try {
            const moviesWithoutTitle = await Movie.find({ title: { $exists: false } });

            for (const movie of moviesWithoutTitle) {
                const urlApi = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US`;

                const response = await fetch(urlApi, options);
                const data = await response.json();

                if (data.title) {
                    console.log(`Updating movie id ${movie.id} with title ${data.title}`);
                    await Movie.findOneAndUpdate(
                        { id: movie.id },
                        { title: data.title },
                        { new: true, upsert: true }
                    );
                    console.log(`Updated movie id ${movie.id} with title ${data.title}`);
                } else {
                    console.log(`Could not find title for movie id ${movie.id}`);
                }
            }

            res.status(200).json({ message: 'Finished updating movies without titles' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    fixMissingDirector: async function (req, res, next) {
        try {

            const moviesWithoutDirector = await Movie.find({ director: null });

            for (const movie of moviesWithoutDirector) {

                const urlApi = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}`;

                const response = await fetch(urlApi, options);
                const data = await response.json();
                let crew = "";

                if (data.crew) {
                    crew = data.crew;
                } else {
                    crew = data.cast;
                }

                let director;

                crew.forEach(element => {
                    if (element.job == "Director") {
                        console.log(movie.id + "-" + element.name);
                        director = element.name;
                    }
                });

                console.log(`Updating movie id ${movie.id} with crew ${director}`);
                await Movie.findOneAndUpdate(
                    { id: movie.id },
                    { director: director },
                    { new: true, upsert: true }
                );

            }

            res.status(200).json({ message: 'Finished updating movies without crew' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }, fixMissingCrew: async function (req, res, next) {
        try {

            const moviesWithoutCrew = await Movie.find({ crew: null });


            for (const movie of moviesWithoutCrew) {
                let mainActors = [];

                const urlApi = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}`;

                const response = await fetch(urlApi, options);
                const data = await response.json();

                const cast = data.cast;

                if (cast.length > 6) {
                    for (let i = 0; i < 6; i++) {
                        const actor = cast.find(actor => actor.order === i);
                        if (actor) {
                            console.log(actor.name);
                            mainActors.push(actor.name);
                        }
                    }
                } else {
                    console.log(cast.length)
                    for (let i = 0; i < 6; i++) {
                        const actor = cast.find(actor => actor.order === i);
                        if (actor) {
                            console.log(actor.name);
                            mainActors.push(actor.name);
                        }
                    }
                }

                console.log(mainActors);

                if (data.crew) {
                    console.log(`Updating movie id ${movie.id} with crew ${mainActors}`);
                    await Movie.findOneAndUpdate(
                        { id: movie.id },
                        { crew: mainActors },
                        { new: true, upsert: true }
                    );
                } else {
                    console.log(`Could not find crew for movie id ${movie.id}`);
                }
            }

            res.status(200).json({ message: 'Finished updating movies without crew' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }, fixMissingYear: async function (req, res, next) {
        try {

            const moviesWithoutReleaseDate = await Movie.find({ release_date: { $exists: false } });

            for (const movie of moviesWithoutReleaseDate) {

                let movie_id = movie.id;

                const urlApi = `https://api.themoviedb.org/3/movie/${movie_id}`;
                const response = await fetch(urlApi, options);
                const data = await response.json();

                console.log(movie.title + "-" + data.release_date)

                if (data.release_date) {
                    console.log(`Updating movie id ${movie_id} with release date ${data.release_date}`);
                    await Movie.findOneAndUpdate(
                        { id: movie_id },
                        { release_date: data.release_date },
                        { new: true, upsert: true }
                    );
                }
            }

            res.status(200).json({ message: 'Finished updating movies without crew' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }, fix282: async function (req, res, next) {
        try {
            const moviesWithoutGenero = await Movie.find({ genero: { $size: 0 } });

            for (const movie of moviesWithoutGenero) {
                let movie_id = movie.id;

                const urlApi = `https://api.themoviedb.org/3/movie/${movie_id}`;
                const response = await fetch(urlApi, options);
                const data = await response.json();

                const genres = data.genres;

                console.log(data)

                if (data.genres) {
                    const genre_ids = genres.map(genre => genre.id);
                    console.log(`Updating movie id ${movie_id} with genres ${genre_ids}`);
                    await Movie.findOneAndUpdate(
                        { id: movie_id },
                        {
                            genero: genre_ids
                        },
                        { new: true, upsert: true }
                    );
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

module.exports = fixing;