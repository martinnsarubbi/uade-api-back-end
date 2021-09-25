var Turno = require('../models/escturno');
var bodyParser = require('body-parser');


let crearTurno = (req,res) =>
{
    console.log("Crear turno");
    console.log(req.body);
    var nuevoTurno = Turno({
        id: req.body.id,
        nombreTurno: req.body.nombreTurno,
        precioTurno:req.body.precioTurno
    });
    nuevoTurno.save().
    then
    (
        (nuevoTurno)=>
        {console.log(nuevoTurno);
            res.status(200).send(nuevoTurno); 
        },
        (err)=>
        { 
            res.status(500).send(err);
            console.log(err);
        }
    ) 
}

let actualizarTurno = (req,res) => 
{
    let id = {_id: res.req.body.idTurno};

    console.log("update",id);

    let params = { 
        nombreTurno: req.body.nombreTurno,
        precioTurno: req.body.precioTurno, 
};

for(let prop in params) if(!params[prop]) delete params[prop];


    Turno.findOneAndUpdate(
            id,
            {$set : params},
            {new:true},function(err)
        {
        console.log("turno modificado");
        (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }
        });

    res.status(200).send(id); 
}

let eliminarTurno = (req,res)=>
{
    console.log(res.req.body.idturno)
    if (res.req.body.idTurno != null) {
        let id = {_id: res.req.body.idTurno};

        Turno.deleteOne(id, function(err)
        {
            console.log(id);
            res.status(200).send({estado:"turno eliminado"}); //devuelvo resultado  
            (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }      
        });
    } else {
        console.log("Id en blanco");
        res.status(200).send({estado:"Id en blanco, por favor enviar un idturno"});
    } 
}

let obtenerTurnos = (req, res) =>
{      
    console.log("llegue a leer");
    Turno.find(function(err,listaTurnos)
    {
        res.status(200).send(listaTurnos);
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });       
};



module.exports = 
{
    crearTurno,
    actualizarTurno,
    crearTurno,
    obtenerTurnos,
    eliminarTurno
};