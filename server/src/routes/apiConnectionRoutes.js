const { Router } = require('express');

const { apiConnectionController } = require('../controllers/apiConnectionController.js');
const genreConnectionController = require('../controllers/genreConnectionController.js');
const crewApiController = require('../controllers/crewApiController.js');
const auth = require('../controllers/usersAuthController.js');
const poster = require ('../controllers/moviePosterController.js');

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
router.get('/home/movies', poster.getJsonFile);


module.exports = router;