const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const jwt_secret = process.env.JWT_SECRET;
const { v4: uuidv4 } = require('uuid');
const { sendMagicLink, recoverPassword } = require('./emailEnvioController.js');
const bcrypt = require('bcrypt');

const register = async (email) => {
  try {
    const newUser = {
      Email: email,
      MagicLink: uuidv4()
    };
    let user = await User.create(newUser);
    let sendEmail = await sendMagicLink(email, user.MagicLink, 'signup');
    return { ok: true, message: "Usuario creado" };
  } catch (error) {
    console.error(error);
    return { ok: false, error };
  }
};

const login = async (req, res) => {
  const { email, magicLink } = req.body;
  console.log(email);
  if (!email) {
    console.log("Email not provided");
    return res.json({ emailSent: false, message: "Debe llenar todos los campos" });
  }
  if (!validator.isEmail(email)) {
    console.log("Invalid email format");
    return res.json({ emailSent: false, message: "El link no es válido" });
  }
  try {
    const user = await User.findOne({ Email: email });
    if (!user) {
      console.log("User not found, registering...");
      let reg = await register(email);
      res.send({ emailSent: true, message: 'Tu cuenta ha sido creada, presiona el enlace en el email para ingresar' });
    } else if (user && !user.FirstTime) {
      res.json({ ok: false, message: "El usuario ya existe" });
    } else if (user.MagicLink == magicLink && !user.MagicLinkExpired) {
      console.log("Generating token...");
      const token = jwt.sign(user.toJSON(), jwt_secret, { expiresIn: "5h" });
      await User.findOneAndUpdate(
        { Email: email },
        {
          MagicLinkExpired: true,
          FirstTime: false 
        }

        );
      res.json({ ok: true, message: "Success", token, email });
    } else {
      console.log("Invalid magicLink or expired");
      return res.json({ ok: false, message: "El enlace ha expirado o es incorrecto" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error });
  }
};

const signUp = async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    console.log("Email or password not provided");
    return res.json({ emailSent: false, message: "Debe llenar todos los campos" });
  }

  if (!validator.isEmail(email)) {
    console.log("Invalid email format");
    return res.json({ emailSent: false, message: "El link no es válido" });
  } 

  try {
    const user = await User.findOne({ Email: email });

    if (!user) {
      console.log("User not found");
      return res.json({ ok: false, message: "El usuario no existe" });
    } else if (user && user.Password == null && !user.FirstTime) {
      console.log("User exists, creating password...");

      const hashPass = await new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, Salt) {
          bcrypt.hash(pass, Salt, function(err, hash) {
            if (err) {
              reject('Cant Encrypt');
            }
            resolve(hash);
          });
        });
      });

      await User.findOneAndUpdate(
        { Email: email },
        { Password: hashPass }
      );
      res.send({ ok: true, message: 'Contraseña creada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error });
  }
};



const verify_token = (req, res) => {
	const token = req.cookies.token;
	jwt.verify(token, jwt_secret, (err, succ) => {
		err
		? console.error("Error de jwt: " + err)
		: res.json({ ok: true, succ });
	});
};

const checkingPass = async (req, res) => {
  const {email, pass} = req.body;
  let tokenPass = null;
  console.log(email + " " + pass);

  try {
    const user = await User.findOne({Email: email});

    if (user && user.Password) {
      const passwordMatch = await bcrypt.compare(pass, user.Password);
      if (passwordMatch) {
        tokenPass = jwt.sign({ email }, jwt_secret, { expiresIn: "5h" });
        res.cookie('token', tokenPass, { httpOnly: true, secure: true, sameSite: 'none' });
        return res.json({passwordMatch: true, tokenPass});
      } else {
        return res.json({passwordMatch: false});
      }
    }
  } catch(error){
    console.log(error);
  }
}

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ok: true});
}

const recoverPasswordUser = async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({ Email: email });
  console.log("emailR: " + email)

  if (!user) {
    console.log("User not found");
    return res.json({ ok: false, message: "El usuario no existe" });
  } else {
    let OTP = Math.floor(1000 + Math.random() * 9000);

  recoverPassword(email, OTP);
  res.json({ok: true, OTP});
  }
};

const changingPass = async (req, res) => {
  const { email, userPass, userPassRecovery } = req.body;
  const emailR = email.replace(/['"]+/g, '');

  try {
    const user = await User.findOne({ Email: emailR });

    if (!user) {
      console.log("User not found");
      return res.json({ ok: false, message: "El usuario no existe" });
    }

    console.log("emailP: " + emailR);

    if (userPassRecovery === userPass) {
      const hashPass = await bcrypt.hash(userPass, 10);

      await User.findOneAndUpdate(
        { Email: emailR },
        { Password: hashPass }
      );

      return res.json({ ok: true, message: 'Contraseña cambiada' });
    } else {
      return res.json({ ok: false, message: 'Algo salió mal' });
    }
  } catch (error) {
    console.error("Error during password change:", error);
    return res.json({ ok: false, message: 'Error during password change' });
  }
};

module.exports = { login, verify_token, signUp, checkingPass, logout, recoverPasswordUser, changingPass };
