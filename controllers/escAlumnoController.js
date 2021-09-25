var axios = require('axios');
var Alumno = require('../models/escalumno');
var Titular = require('../models/esctitular');
var bodyParser = require('body-parser');


let crearAlumno = (req,res) =>
{

    Titular.find({_id: req.body.idTitular }, function(err, docs) {
        console.log(docs);
        var titularBuscado = docs.alumno;
        var nombreTitular = docs.nombre + " " + docs.apellido;
        
        Alumno.find( { _id: titularBuscado }, function(err, docs) 
        { 

            console.log("Crear alumno");
            console.log(req.body);
            var nuevoAlumno = Alumno({
                nombre:req.body.nombre,
                apellido: req.body.apellido,
                correo: req.body.correo,
                pais: req.body.pais,
                provincia: req.body.provincia,
                ciudad: req.body.ciudad,
                codigoPostal: req.body.codigoPostal,
                direccion: req.body.direccion,
                telefono1: req.body.telefono1,
                telefono2: req.body.telefono2,
                dni: req.body.dni,
                turno: req.body.turno,
                servicios: req.body.servicios,
                nombreTitular: nombreTitular,
                gimnasio: req.body.gimnasio
            });

            console.log(nuevoAlumno);
            nuevoAlumno.save().
            then
            (
                (nuevoAlumno)=>
                {` `
                    console.log("Nuevo alumno", nuevoAlumno);
                    Titular.findOneAndUpdate({_id: req.body.idTitular },{$push:{alumno:nuevoAlumno._id}},{ new: true },function(err,results) {
                        if(err){
                            console.log("Error al crear alumno en push Alumno a Titular");
                            res.status(500).send(err);
                            console.log(err);
                        }
                        else{
                            if (nuevoAlumno.gimnasio === true) {
                            console.log("Me doy de alta");

                            var dataGimnasio = {
                                "usuario": "ESCB_" + req.body.dni,
                                "nombre": req.body.nombre,
                                "apellido": req.body.apellido,
                                "password": "123456",
                                "email": req.body.correo,
                                "dni": req.body.dni,
                                "fechaNacimiento": "01/01/2000",
                                "telefonoEmergencia": "1234" ,
                                "contactoEmergencia": "XXX"
                            };

                            console.log(dataGimnasio);

                            axios({
                                method: 'post',
                                url: 'https://peaceful-caverns-01556.herokuapp.com/api/alumnos/crear',
                                data: dataGimnasio
                              }).then((response) => {
                                console.log(response);
                                console.log("Alumno creado");
                                console.log("Titular encontrado", results); 
                                res.status(200).send(nuevoAlumno);
                              }, (error) => {
                                console.log(error);
                                console.log("No pudo crear el alumno");  
                                res.status(500).send(err);
                                console.log(err);
                              });
                            } else {
                                console.log("No me doy de alta");
                                res.status(200).send(nuevoAlumno);
                            }
                              
                        }
                    });
                },
                (err)=>
                { 
                    console.log("No pudo crear el alumno");  
                    res.status(500).send(err);
                    console.log(err);
                }
            )
        });
    });
}



let actualizarAlumno = (req,res) => 
{
    let id = {_id: res.req.body.idAlumno};

    console.log("update",id);

    let params = { 
        nombre:req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
        pais: req.body.pais,
        provincia: req.body.provincia,
        ciudad: req.body.ciudad,
        codigoPostal: req.body.codigoPostal,
        direccion: req.body.direccion,
        telefono1: req.body.telefono1,
        telefono2: req.body.telefono2,
        dni: req.body.dni,
        turno: req.body.turno,
        servicios: req.body.servicios
};

for(let prop in params) if(!params[prop]) delete params[prop];


    Alumno.findOneAndUpdate(
            id,
            {$set : params},
            {new:true},function(err)
        {
        console.log(params);
        console.log("Alumno modificado");
        (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }
        });

    res.status(200).send({estado:"Campos modificados"}); 
}

let eliminarAlumno = (req,res)=>
{
    console.log(res.req.body.idAlumno)
    if (res.req.body.idAlumno != null) {
        let id = {_id: res.req.body.idAlumno};

        Alumno.deleteOne(id, function(err)
        {
            console.log(id);
            res.status(200).send({estado:"Alumno eliminado"}); //devuelvo resultado  
            (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }      
        });
    } else {
        console.log("Id en blanco");
        res.status(200).send({estado:"Id en blanco, por favor enviar un idAlumno"});
    } 
}

let obtenerAlumnos = (req, res) =>
{      
    console.log("llegue a leer");
    Alumno.find(function(err,listaAlumnos)
    {
        res.status(200).send(listaAlumnos);
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });       
};

let obtenerAlumnoPorTitular = (req, res) =>
{      
    console.log("llegue a leer");
    Titular.findOne( { correo: req.body.correo }, function(err, docs) {
        var titularBuscado = docs.alumno;
        Alumno.find( { _id: titularBuscado }, function(err, docs) 
        { 
            res.status(200).send(docs);
            (err)=>{
                res.status(500).send(err);
                console.log(err);
            }
        });
    });
};







let asignarServicioAlumno = (req,res) => 
{
    let id = {_id: res.req.body.idAlumno};

    console.log("update",id);

    let params = { 
        servicios: req.body.servicios
};

    Alumno.findOneAndUpdate(
            id,
            {$push : params},
            {new:true},function(err, success)
        {
        console.log(err);
        console.log("Alumno modificado");
        (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }
        });

    res.status(200).send({estado:"Campos modificados"}); 
}




let desasignarServicioAlumno = (req,res) => 
{
    let id = {_id: res.req.body.idAlumno};

    console.log("update",id);

    let params = { 
        servicios: req.body.servicios
};

    Alumno.findOneAndUpdate(
            id,
            {$pull : params},
            {new:true},function(err, success)
        {
        console.log(err);
        console.log("Alumno modificado");
        (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }
        });

    res.status(200).send({estado:"Campos modificados"}); 
}






let asignarAdicional = (req,res) =>
{
    console.log("Asignar adicional");
    console.log(req.body);
    var dni = req.body.idAdicional;


    Alumno.findOneAndUpdate({_id: req.body.idAlumno },{$push:{adicional:nuevoAdicional}},{ new: true },function(err,results) {
        if(err){
            console.log("Error al asignar adicional a alumno");
            res.status(500).send(err);
            console.log(err);
        }
        else{
            console.log("Adicional asignado");
            res.status(200).send(nuevoAlumno);
            console.log("Adicional encontrado", results);    
        }
    });
    (err)=>
    { 
        console.log("No pudo asignar el adicional");  
        res.status(500).send(err);
        console.log(err);
    }
}


module.exports = 
{
    crearAlumno,
    asignarAdicional,
    eliminarAlumno,
    actualizarAlumno,
    obtenerAlumnos,
    obtenerAlumnoPorTitular,
    asignarServicioAlumno,
    desasignarServicioAlumno
};