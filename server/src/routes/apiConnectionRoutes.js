const { Router } = require('express');

const apiConnectionController = require('../controllers/apiConnectionController.js');
const genreConnectionController = require('../controllers/genreConnectionController.js');
const crewApiController = require('../controllers/crewApiController.js');
const providersApiController = require('../controllers/providersApiController.js');
const auth = require('../controllers/usersAuthController.js');
const poster = require ('../controllers/moviePosterController.js');
const getMovies = require('../controllers/getMoviesController.js');
const streaming = require('../controllers/streamingController.js');
const details = require('../controllers/detailsApiController.js');
const fixing = require('../controllers/fixing.js');

const router = Router();

router.post('/login/user', auth.login);
router.post('/verify', auth.verify_token);
router.post('/profile/register', auth.signUp);
router.post('/profile/verify', auth.checkingPass);
router.post('/logout', auth.logout);
router.post('/recoverPassword', auth.recoverPasswordUser);
router.post('/profile/passwordReset', auth.changingPass);

router.put('/profile/updateUser', auth.updateUser);

router.get('/profile/getUser', auth.getUserByEmail);
router.get('/getUsername', auth.getUsername)
router.get('/movies', apiConnectionController.getJsonFile);
router.get('/genres', genreConnectionController.getJsonFile);
router.get('/crew', crewApiController.getJsonFile);
router.get('/providers', providersApiController.getJsonFile)
router.get('/home/movies', poster.getJsonFile);

router.get('/getInfo', getMovies.getMovieInfo);
router.get('/netflixMovies', getMovies.getTopMovies)
router.get('/discover', getMovies.getDiscoverMovies);
router.get('/getReviews', getMovies.getReviews);
router.get('/newMovies', getMovies.getNewMovies);
router.get('/getMomentMovie', getMovies.getMomentMovie);
router.get('/getAllGenres', getMovies.getAllGenres);
router.get('/getTwelveMovies', getMovies.getTwelveMovies);

router.get('/streamingService', streaming.getStreamingMovies);
router.get('/searchQuery', streaming.getMovieQuery);
router.get('/getElasticSearch', streaming.getMovieQueryName);

router.get('/getDetails', details.getJsonFile);
router.get('/fixing', fixing.fixMissingTitles);
router.get('/fixingCrew', fixing.fixMissingCrew);
router.get('/fixingDirector', fixing.fixMissingDirector);
router.get('/fixingDates', fixing.fixMissingYear);
router.get('/fixingAll', fixing.fix282);



module.exports = router;