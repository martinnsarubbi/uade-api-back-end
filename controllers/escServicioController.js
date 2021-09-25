var Servicio = require('../models/escservicio');
var bodyParser = require('body-parser');


let crearServicio = (req,res) =>
{
    console.log("Crear servicio");
    console.log(req.body);
    var nuevoServicio = Servicio({
        nombreCategoriaServicio: req.body.nombreCategoriaServicio,
        nombreServicio: req.body.nombreServicio,
        precioMensual: req.body.precioMensual,
    });
    nuevoServicio.save().
    then
    (
        (nuevoServicio)=>
        {console.log(nuevoServicio);
            res.status(200).send(nuevoServicio); 
        },
        (err)=>
        { 
            res.status(500).send(err);
            console.log(err);
        }
    ) 
}

let actualizarServicio = (req,res) => 
{
    let id = {idServicio: req.body.idServicio};

    console.log("update",id);

    let params = { 
        nombreCategoriaServicio: req.body.nombreCategoriaServicio,
        detalleServicio: req.body.detalleServicio,
        precioMensual: req.body.precioMensual,
};

for(let prop in params) if(!params[prop]) delete params[prop];


    Servicio.findOneAndUpdate(
            id,
            {$set : params},
            {new:true},function(err)
        {
        console.log("Servicio modificado");
        (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }
        });

    res.status(200).send({estado:"Campos modificados"}); 
}

let eliminarServicio = (req,res)=>
{
    console.log(res.req.body.idServicio)
    if (res.req.body.idServicio != null) {
        let id = {_id: res.req.body.idServicio};

        Servicio.deleteOne(id, function(err)
        {
            console.log(id);
            res.status(200).send({estado:"Servicio eliminado"}); //devuelvo resultado  
            (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }      
        });
    } else {
        console.log("Id en blanco");
        res.status(200).send({estado:"Id en blanco, por favor enviar un idServicio"});
    } 
}

let obtenerServicios = (req, res) =>
{      
    console.log("llegue a leer");
    Servicio.find(function(err,listaServicios)
    {
        res.status(200).send(listaServicios);
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });       
};



module.exports = 
{
    crearServicio,
    actualizarServicio,
    eliminarServicio,
    obtenerServicios
};