var Titular = require('../models/esctitular');
var bodyParser = require('body-parser');



let obtenerTitulares = (req, res) =>
{      
    console.log("llegue a leer");
    Titular.find(function(err,listaTitulares)
    {
        res.status(200).send(listaTitulares);
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });  
};

let obtenerTitular = (req, res) =>
{      
    console.log("llegue a leer");
    Titular.findOne({ correo: req.body.correo }, function (err, titular) { 
        res.status(200).send(titular);
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });
};


let loginTitular = (req, res) =>
{   
    console.log("Login titular");
    Titular.findOne({documento:req.body.documento,password:req.body.password},function(err,results)
    {
        if(err){
            res.status(500).send(err);
            console.log(err);
        }
        else{
            res.status(200).send(results);  
            console.log(results);    
        }
    });
    
}

/*

let getContactosByname = (req, res) =>
{   
    let name1 = {name:req.body.name};
    User.find(name1,function(err,results)
    {
        if(err){
            res.status(500).send(err);
            console.log(err);
        }
        else{
            res.status(200).send(results);  
            console.log(results);    
        }
    });
    
}

let searchUserbyKey = (req, res) =>
{   
    console.log(req.query.key);    
    let name = {name: {'$regex' : '.*(?i)' + req.query.key + '.*'}};  
    let lastname = {lastname: {'$regex' : '.*(?i)' + req.query.key + '.*'}};
    User.find({$or:[name,lastname]},function(err,results)
    {
        if(err){
            res.status(500).send(err);
            console.log(err);
        }
        else{
            res.status(200).send(results);  
            console.log(results);    
        }
    });   
} */

let crearTitular = (req,res) =>
{
    console.log("Crear titular");
    console.log(req.body);
    var newContact = Titular({
        nombre: req.body.nombre,
        apellido: req.body.apellido, 
        tipoDocumento: req.body.tipoDocumento,
        documento: req.body.documento,
        correo: req.body.correo,
        imagenPerfil: req.body.imagenPerfil,
        pais: req.body.pais,
        provincia: req.body.provincia,
        ciudad: req.body.ciudad,
        codigoPostal: req.body.codigoPostal,
        direccion: req.body.direccion,
        direccion2: req.body.direccion2,
        telefonoContacto: req.body.telefonoContacto,
        password: req.body.password
    });
    newContact.save().
    then
    (
        (newContact)=>
        {console.log(newContact);

            res.status(200).send(newContact); 
        },
        (err)=>
        { 
            res.status(500).send(err);
            console.log(err);
        }
    ) 
}

/*

let registerUserWithSocialCredentials = (req,res) =>
{
    console.log("register user with social credentials");
    console.log("request: " +  req.body.mail);
    User.findOne({mail: req.body.mail},function(err,results) {
        if(err) {
            res.status(500).send(err);
            console.log(err);

        } else {

            if(results != null) {
                console.log("user has been found");
                res.status(200).send(results);  
                console.log(results);   
            } else {
                console.log("user doesn't exist");
                var newContact = User({
                name: req.body.name,
                lastname: req.body.lastName,
                mail: req.body.mail,
                groupsID: [],
                groupsAdmin: []
                });

                newContact.save().
                then
                (
                    (newContact)=>
                    {console.log(newContact);
                        res.status(200).send(newContact); 
                    },
                    (err)=>
                    { 
                        res.status(500).send(err);
                        console.log(err);
                    }
                )
            } 
        }
    });
}

*/

let actualizarTitular = (req,res) => 
{
    let id = {_id: res.req.body.idTitular};

    console.log("update",id);

    let params = { 
        nombre: req.body.nombre,
        apellido: req.body.apellido, 
        tipoDocumento: req.body.tipoDocumento,
        documento: req.body.documento,
        correo: req.body.correo,
        imagenPerfil: req.body.imagenPerfil,
        pais: req.body.pais,
        provincia: req.body.provincia,
        ciudad: req.body.ciudad,
        codigoPostal: req.body.codigoPostal,
        direccion: req.body.direccion,
        direccion2: req.body.direccion2,
        telefonoContacto: req.body.telefonoContacto,
        password: req.body.password
};

for(let prop in params) if(!params[prop]) delete params[prop];


    Titular.findOneAndUpdate(
            id,
            {$set : params},
            {new:true},function(err)
        {
        console.log("Nombre modificado");
        (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }
        });

    res.status(200).send({estado:"Campos modificados"}); 
}



let eliminarTitular = (req,res)=>
{
    console.log(res.req.body.idTitular)
    if (res.req.body.idTitular != null) {
        let id = {_id: res.req.body.idTitular};

        Titular.deleteOne(id, function(err)
        {
            console.log(id);
            res.status(200).send({estado:"Titular eliminado"}); //devuelvo resultado  
            (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }      
        });
    } else {
        console.log("Id en blanco");
        res.status(200).send({estado:"Id en blanco, por favor enviar un idTitular"});
    } 
}

module.exports = 
{
    crearTitular,
    eliminarTitular,
    actualizarTitular,
    obtenerTitulares,
    obtenerTitular,
    loginTitular
};