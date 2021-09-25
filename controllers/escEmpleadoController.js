var Empleado = require('../models/escempleado');
var bodyParser = require('body-parser');



let obtenerEmpleados = (req, res) =>
{      
    console.log("llegue a leer");
    Empleado.find(function(err,listaEmpleados)
    {
        res.status(200).send(listaEmpleados);
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });  
};

let obtenerEmpleado = (req, res) =>
{      
    console.log("llegue a leer");
    Empleado.findOne({ correo: req.body.correo }, function (err, empleado) { 
        res.status(200).send(empleado);
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });
};


let loginEmpleado = (req, res) =>
{   
    console.log("Login empleado");
    Empleado.findOne({documento:req.body.documento,password:req.body.password},function(err,results)
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

let crearEmpleado = (req,res) =>
{
    console.log("Crear empleado");
    console.log(req.body);
    var newContact = Empleado({
        id: req.body.id,
        nombre:req.body.nombre,
        apellido:req.body.apellido,
        correo: req.body.correo,
        pais: req.body.pais,
        provincia: req.body.provincia,
        ciudad: req.body.ciudad,
        codigoPostal: req.body.codigoPosta,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        categoria: req.body.categoria,
        puesto: req.body.puesto,
        cargaHoraria: req.body.cargaHoraria,
        sueldo: req.body.sueldo,
        fechaIngreso: req.body.fechaIngreso,
        hijos: req.body.hijos
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

let actualizarEmpleado = (req,res) => 
{
    let id = {_id: res.req.body.idEmpleado};

    console.log("update",id);

    let params = { 
        id: req.body.id,
        nombre:req.body.nombre,
        apellido:req.body.apellido,
        correo: req.body.correo,
        pais: req.body.pais,
        provincia: req.body.provincia,
        ciudad: req.body.ciudad,
        codigoPostal: req.body.codigoPosta,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        categoria: req.body.categoria,
        puesto: req.body.puesto,
        cargaHoraria: req.body.cargaHoraria,
        sueldo: req.body.sueldo,
        fechaIngreso: req.body.fechaIngreso,
        hijos: req.body.hijos
};

for(let prop in params) if(!params[prop]) delete params[prop];


    Empleado.findOneAndUpdate(
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



let eliminarEmpleado = (req,res)=>
{
    console.log(res.req.body.idEmpleado)
    if (res.req.body.idEmpleado != null) {
        let id = {_id: res.req.body.idEmpleado};

        Empleado.deleteOne(id, function(err)
        {
            console.log(id);
            res.status(200).send({estado:"Empleado eliminado"}); //devuelvo resultado  
            (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }      
        });
    } else {
        console.log("Id en blanco");
        res.status(200).send({estado:"Id en blanco, por favor enviar un idEmpleado"});
    } 
}

module.exports = 
{
    crearEmpleado,
    eliminarEmpleado,
    actualizarEmpleado,
    obtenerEmpleados,
    obtenerEmpleado,
    loginEmpleado
};