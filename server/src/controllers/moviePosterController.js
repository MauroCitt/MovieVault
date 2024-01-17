const init = async () => {
    fetch = (await import("node-fetch")).default;
};

init();

const apiKey = '4ede0b04611cdf9bdd6b1943d9ac3f24';
const authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWRlMGIwNDYxMWNkZjliZGQ2YjE5NDNkOWFjM2YyNCIsInN1YiI6IjY1NGI3NTYxZmQ0ZjgwMDBjN2ZlNWY4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Wzm-mDwRjmcNv_Nx3XkJtZrxfcfkC805GvdNYUg5stc';

const moviePosterController = {};

moviePosterController.getJsonFile = async (req, res, next) => {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            api_key: apiKey,
            Authorization: authorization,
        },
    };

    try {
        const url = 'https://api.themoviedb.org/3/movie/769/images';
        let response = await fetch(url, options);
        let data = await response.json();

        console.log("data: " + data);
        res.json(data);

    } catch (error) {
        
    }
};

module.exports = moviePosterController;
