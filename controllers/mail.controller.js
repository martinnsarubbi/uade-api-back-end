let nodemailer = require('nodemailer');
var CodeGenerator = require('node-code-generator');

exports.sendEmail = async function (req, res, next){
    
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        //host: 'svp-02715.fibercorp.local',
        //secure: false,
        port:25,
        service: 'Gmail',
        auth: {
            user: 'apiuade1@gmail.com',//poner cuenta gmail
            pass: 'Uade1234'  //contraseña cuenta  IMPORTANTE HABILITAR acceso apps poco seguras google
        }
    });
    var generator = new CodeGenerator();
    var code = generator.generateCodes('#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*', 1, {});
    console.log(code);
    // Definimos el email
    var mailOptions = {
        from: 'apiuade1@gmail.com',
        to: req.body.destinatario,
        subject: 'Restablecé tu contraseña',
        html: '<h1>Medicapp - Ingresá el siguiente código para restablecer tu contraseña:  </h1><p>' + code +'</p>',
    };
    console.log("mail",mailOptions)

    // Enviamos el email
    try
    {
        let info = await transporter.sendMail(mailOptions);
        return res.status(201).json({status: 201, message: "Correo enviado correctamente"});
    }
    catch(error)
    {
        console.log("Error envio mail: ",error);    
        return res.status(400).json({status: 400, message: "Error al enviar el correo"});
    }
};