const User = require("../models/user.js");
const Movie = require("../models/movie.js");
const { fetchMovieInfo, fetchImages } = require("../services/movieInfoService.js");

const init = async () => {
    fetch = (await import("node-fetch")).default;
};

init();

const userMovieController = {
    addMovieToList: async function (req, res) {
        let movieId = req.body.idMovie;
        let userEmail = req.body.email;
        let list = req.body.list;

        userEmail = userEmail.replaceAll("\"", "");

        let user = await User.findOne({ Email: userEmail });

        if (list == "watched") {
            if (user.watched.includes(movieId)) {
                try {
                    let updatedUser = await User.findOneAndUpdate(
                        { Email: userEmail },
                        { $pull: { watched: movieId } },
                        { new: true }
                    );
                    res.status(200).send("Movie removed from watched list");
                } catch (error) {
                    console.error(error);
                }
            } else {
                try {
                    if (user.wantToWatch.includes(movieId)) {
                        await User.findOneAndUpdate(
                            { Email: userEmail },
                            { $pull: { wantToWatch: movieId } },
                            { new: true }
                        );
                    }
        
                    let updatedUser = await User.findOneAndUpdate(
                        { Email: userEmail },
                        { $push: { watched: movieId } },
                        { new: true }
                    );
                    res.status(200).send("Movie added to watched list");
                } catch (error) {
                    console.error(error);
                }
            }
        } else if (list == "wantToWatch") {
            if (user.wantToWatch.includes(movieId)) {
                try {
                    let updatedUser = await User.findOneAndUpdate(
                        { Email: userEmail },
                        { $pull: { wantToWatch: movieId } },
                        { new: true }
                    );
                    res.status(200).send("Movie removed from want to watch list");
                } catch (error) {
                    console.error(error);
                }
            } else {
                try {
                    if (user.watched.includes(movieId)) {
                        await User.findOneAndUpdate(
                            { Email: userEmail },
                            { $pull: { watched: movieId } },
                            { new: true }
                        );
                    }
        
                    let updatedUser = await User.findOneAndUpdate(
                        { Email: userEmail },
                        { $push: { wantToWatch: movieId } },
                        { new: true }
                    );
                    res.status(200).send("Movie added to want to watch list");
                } catch (error) {
                    console.error(error);
                }
            }
        }
    },
    getMovieLists: async function (req, res) {
        let userEmail = req.query.email;
        userEmail = userEmail.replaceAll("\"", "");
        let user = await User.findOne({ Email: userEmail });

        const currentPage = parseInt(req.query.page) || 1;
        const itemsPerPage = 6;
        
        let watchedMovies = [];
        let wantToWatchMovies = [];
        
        let startWatched = (currentPage - 1) * itemsPerPage;
        let endWatched = startWatched + itemsPerPage;
        
        for (let i = startWatched; i < endWatched && i < user.watched.length; i++) {
            let movie = await Movie.findOne({ id: user.watched[i] });
            let movieInfoResponse = await fetchMovieInfo(movie.id, userEmail);
            let movieInfo = movieInfoResponse.movieInfo;
            let images = await fetchImages(movie.id);
            movieInfo.release_date = images.imagePath;
            watchedMovies.push(movieInfo);
        }
        
        let startWantToWatch = (currentPage - 1) * itemsPerPage;
        let endWantToWatch = startWantToWatch + itemsPerPage;
        
        for (let i = startWantToWatch; i < endWantToWatch && i < user.wantToWatch.length; i++) {
            let movie = await Movie.findOne({ id: user.wantToWatch[i] });
            let movieInfoResponse = await fetchMovieInfo(movie.id, userEmail);
            let movieInfo = movieInfoResponse.movieInfo;
            let images = await fetchImages(movie.id);
            movieInfo.release_date = images.imagePath;
            wantToWatchMovies.push(movieInfo);
        }
        let totalWatchedMovies = user.watched.length;
        let totalWantToWatchMovies = user.wantToWatch.length;
        
        res.status(200).send({ watched: watchedMovies, wantToWatch: wantToWatchMovies, totalWatchedMovies: totalWatchedMovies, totalWantToWatchMovies: totalWantToWatchMovies });    }
}

module.exports = userMovieController;