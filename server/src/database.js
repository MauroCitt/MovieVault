const mongoose = require('mongoose');

const {MOVIE_VAULT_MONGODB_USERNAME, MONGO_PASS, MOVIE_VAULT_MONGODB_DATABASE, MOVIE_VAULT_MONGODB_CLUSTER} = process.env;
const uri = "mongodb+srv://mauritox:123@moviecluster.s7aig4l.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const conexion = mongoose.connection;

conexion.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
conexion.once('open', () => {
  console.log('Conectado a MongoDB');
});