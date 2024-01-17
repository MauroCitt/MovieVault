const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    }
});

const sendMagicLink = async(email, link, method) => {
    var asunto;
    var body;
    console.log("email: " + email + " link: " + link + " method: " + method);

    if(method == 'signup'){
        asunto = "Tu link de registro";
        body='<p>Para registrarte en nuestra página, haz click en el siguiente enlace: ' + ('http://localhost:3000/verify/'
        + email+'/'+link)+ '</p><p>Si no te has registrado, ignora este mensaje.</p>';
    } else {
        asunto = "Tu link de acceso";
        body='<h1>Bienvenido de vuelta</h1><p>Para acceder a nuestra página, haz click en el siguiente enlace: ' + (URL + email+'/'+link)+ '</p><p>Si no has solicitado el acceso, ignora este mensaje.</p>';
    }

    const mailHead = {
        to: email,
        from: process.env.NODEMAILER_EMAIL,
        subject: asunto,
        html: body
    }
    try{
        const response = await transport.sendMail(mailHead);
        console.log('Link enviado');
        return({ok: true, message: 'Link enviado'});
    }
    catch(err){
        console.log('Fallo al enviar el link');
        console.log(err)
        return({ok: false, message: err});
    }
}

const recoverPassword = async(email, OTP) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS
        }
    });

    const mail_configs = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: "MOVIE VAULT PASSWORD RECOVERY",
        html: `<!DOCTYPE html>
                <html lang="en" >
                    <head>
                        <meta charset="UTF-8">
                        <title>CodePen - OTP Email Template</title>
                        
                    
                    </head>
                    <body>
                    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                        <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">The Movie Vault</a>
                        </div>
                        <p style="font-size:1.1em">Hi,</p>
                        <p>Se ha solicitado una restauración de contraseña</p>
                        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                        <p style="font-size:0.9em;">Saludos,<br />The Movie Vault</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>The Movie Vault</p>
                            <p>Inetum demo</p>
                            <p>Tarragona</p>
                        </div>
                        </div>
                    </div>
                    <!-- partial -->
                        
                    </body>
                </html>`,
    };

    transport.sendMail(mail_configs, function (error, info) {
        if (error) {
            console.log(error);
            return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email sent succesfuly" });
    });
}


module.exports = { sendMagicLink, recoverPassword };