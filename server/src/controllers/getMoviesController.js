const mongoose = require('mongoose');
const Movie = require('../models/movie'); 


const getMoviesController = {
    getTopMovies: async function(req, res) {
        let movieIds = []

        try {
            const topMovies = await Movie.find({ providers: { $in: ['Netflix'] } }).sort({ vote_average: -1 }).limit(8);

            for (let index = 0; index < topMovies.length; index++) {
                movieIds.push(topMovies[index].id);
                
            }
            res.json(movieIds);
        } catch (error) {
            console.error(error);
        }
    }
}

getMoviesController.getTopMovies().catch(console.error);

module.exports = getMoviesController;