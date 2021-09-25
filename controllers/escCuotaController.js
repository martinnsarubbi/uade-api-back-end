var Cuota = require('../models/esccuota');
var Alumno = require('../models/escalumno');
var Servicio = require('../models/escservicio');
var Turno = require('../models/escturno');
var Titular = require('../models/esctitular')
var bodyParser = require('body-parser');
var axios = require('axios');
var generate = require('csv-generate');
var fs = require('fs');
var path = require('path');
var os = require('os');
var FormData = require("form-data");


function formattedDate(d = new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${day}/${month}/${year}`;
  }


let crearCuota = (req, res) =>
{
    console.log("Crear cuota");
    let id = {_id: res.req.body.idTitular};

    let dMes = req.body.mes;
    let dAnio = req.body.anio;
    var numeroFactu = 0;

    const csv = require('csv-parser');
    const fs = require('fs');
    fs.createReadStream('./assets/numeroFactura.csv')
    .pipe(csv())
    .on('data', (row) => {
        numeroFactu = parseInt(row.numeroFactura) + 1
        console.log(numeroFactu)
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
            path: './assets/numeroFactura.csv',
            header: [   
                {id: 'numeroFactura', title: 'numeroFactura'},
            ]
        });
        const records = [ {
            numeroFactura: numeroFactu
        }] ;
        csvWriter.writeRecords(records)
    });



    Titular.findOne( id, function(err, docs){})
    .populate({
        path: 'alumno',
        model: 'escalumno',
        populate: [{
            path: 'turno',
            model: 'escturno'           
        },
        { 
            path: 'servicios',
            model: "escservicio"
        }
        ]
    })
    .exec(function(err, resultado) {

        let precioServicios = 0;
        let precioServiciosCuota = 0;
        let precioServiciosTotal = 0;
        let precioTurnoTotal = 0;
        let detalleCuotas = [ ];
        let detalleServicios = [];
        

        
        for(let i = 0; i < resultado.alumno.length; i++) {

            precioTurnoTotal = precioTurnoTotal + resultado.alumno[i].turno.precioTurno;
            
            

            precioServicios = 0;
            if ( typeof JSON.stringify(resultado.alumno[i].servicios) !== 'undefined' ) {

                precioServiciosCuota = 0;
                for(let j = 0; j < resultado.alumno[i].servicios.length; j++) {
                    precioServicios = resultado.alumno[i].servicios[j].precioMensual;
                    precioServiciosTotal = precioServiciosTotal + precioServicios;
                    precioServiciosCuota = precioServiciosCuota + precioServicios;
                    detalleServicios = [];
                    var detalleServicio = 
                    {
                        nombreServicio:  resultado.alumno[i].servicios[j].nombreServicio,
                        precioMensual:  resultado.alumno[i].servicios[j].precioMensual
                    }
                    detalleServicios.push(detalleServicio);
                }
            }
            

            var detalleCuota = {
                nombreAlumno: resultado.alumno[i].nombre + " " + resultado.alumno[i].apellido,
                turno: resultado.alumno[i].turno.nombreTurno,
                precioTurno: resultado.alumno[i].turno.precioTurno,
                servicios: detalleServicios,
                precioServicios: precioServiciosCuota
            }
            detalleCuotas.push(detalleCuota);

        }

        
        let precioFactura = precioTurnoTotal + precioServiciosTotal;
        console.log(precioFactura);
        var today = new Date();

        var nuevaCuota = Cuota({
            mes:req.body.mes,
            anio: req.body.anio,
            pagada: false,
            datosFacturacion: resultado,
            numeroFactura: numeroFactu,
            facturada: true,
            pagada: false,
            fechaEmision: today,
            fechaVencimiento: today.setDate(today.getDate() + 30),
            valorServicios: precioServicios,
            totalCuota: precioFactura,
            quienPaga: "",
            numeroTransaccion: "",
            detalleCuota: detalleCuotas,
        });

        console.log(nuevaCuota);

        nuevaCuota
        .save().
            then
            (
                (nuevaCuota)=>
                {` `
                    console.log("Nueva cuota", nuevaCuota);
                    Titular.findOneAndUpdate({_id: req.body.idTitular },{$push:{cuota:nuevaCuota._id}},{ new: true },function(err,results) {
                        if(err){
                            console.log("Error al crear cuota en push Cuota a Alumno");
                            res.status(500).send(err);
                            console.log(err);
                            return;
                        }
                        else{
                            console.log("Cuota creada");
                            console.log("Cuota encontrada", results);


                            let codigo_pago_electronico = "ESCB_" + nuevaCuota.datosFacturacion.documento;
                            let numero_factura = nuevaCuota.numeroFactura;
                            let importe = nuevaCuota.totalCuota;
                            let fecha_vencimiento = formattedDate(nuevaCuota.fechaVencimiento);
                        
                            dataLogin = {
                                "nombre_usuario": "escuelab.bankame",
                                "clave": "Escuelab1234"
                            };
                        
                            const createCsvWriter = require('csv-writer').createObjectCsvWriter;
                            const csvWriter = createCsvWriter({
                                path: './assets/facturas/archivo_facturas.csv',
                                header: [
                                    {id: 'titulo', title: 'codigo_pago_electronico;numero_factura;importe;fecha_vencimiento'},
                                ]
                            });
                            const records = [ {
                                titulo: codigo_pago_electronico + ';' + numero_factura + ';' + importe + ';' + fecha_vencimiento
                            }];


                        
                            axios({
                                method: 'post',
                                url: 'https://integracion-banco.herokuapp.com/login',
                                data: dataLogin
                              }).then((response) => {
                                var loginDataRaw = response.data.user;
                                loginDataString = JSON.stringify(loginDataRaw);
                                loginDataStringRep = loginDataString.replace('x-access-token','token')
                                loginData = JSON.parse(loginDataStringRep);
                                token = 'Bearer ' + loginData.token;
                                
                                axios.get(
                                    'https://integracion-banco.herokuapp.com/cuentas',
                                    { headers: { Authorization : token } }
                                    )
                                    .then((response) => {
                                        var numero_cuenta = response.data.cuentas[0].numero_cuenta;
                                        console.log(token)
                        
                                        csvWriter.writeRecords(records)       // returns a promise
                                        .then(() => {
                                            var newFile = fs.createReadStream('./assets/facturas/archivo_facturas.csv');
                                            var bodyFormData = new FormData();
                                            bodyFormData.append("numero_cuenta", numero_cuenta);
                                            bodyFormData.append("archivo", newFile);
                                            
                                            axios.post(
                                                'https://integracion-banco.herokuapp.com/facturas/cargar', bodyFormData, {
                                                        headers: {
                                                            'Authorization' : token,
                                                            ...bodyFormData.getHeaders()
                                                        } 
                                                    }
                                                )
                                                .then((response) => {
                                                    console.log(response)
                                                    res.status(200).send(nuevaCuota);
                                                },
                                                (error) => {
                                                    console.log(error.response)
                                                    var status = error.response.status
                                                    res.status(500).send(error);
                                                }
                                                );
                                        });
                                    },
                                    (error) => {
                                        var status = error.response.status
                                        res.status(500).send(error);
                                    }
                                  );
                              }, (error) => {
                                console.log(error);
                                console.log("No pudo llamar al login");  
                                res.status(500).send(error);
                                console.log(error);
                              });   


                        }
                    });
                },
            )


    });


}
let realizarPago = (req, res) => {
    let id = { numeroFactura: req.body.numeroFactura };

    console.log("update", id);

    var numeroTrans = 0;

    const csv = require('csv-parser');
    const fs = require('fs');
    fs.createReadStream('./assets/numeroTransaccion.csv')
        .pipe(csv())
        .on('data', (row) => {
            numeroTrans = parseInt(row.numeroTransaccion) + 1
            console.log(numeroTrans)
            const createCsvWriter = require('csv-writer').createObjectCsvWriter;
            const csvWriter = createCsvWriter({
                path: './assets/numeroTransaccion.csv',
                header: [
                    { id: 'numeroTransaccion', title: 'numeroTransaccion' },
                ]
            });
            const records = [{
                numeroTransaccion: numeroTrans
            }];
            csvWriter.writeRecords(records)
            
            let params = {
                pagada: true,
                numeroTransaccion: numeroTrans,
                formaDePago: req.body.formaDePago
            };

            Cuota.findOneAndUpdate(
                id, { $set: params }, { new: true },
                function(err, resultado) {
                    console.log("pago realizado");
                    res.status(200).send(resultado);
                    (err) => {
                        res.status(500).send(err);
                        console.log(err);
                    }
                });
        });

}




let crearCuota1 = (req,res) =>
{
    console.log("Crear cuota");

    let id = {_id: res.req.body.idAlumno};

    let dMes = req.body.mes;
    let danio = req.body.anio;
    let numeroFactura = Math.random()*10000000000;

    Alumno.findOne( id, function(err, docs) 
    { 
        let dAlumno = docs.nombre + " " + docs.apellido;
        let dTitular = docs.nombreTitular;
        let dDni = docs.dni;
        let idServicio = docs.servicios;
        let idTurno = docs.turno;
        let dServiciosAFacturar = [];
        let dTurnoAFacturar = {};
        let dTotalServicios = 0;
        let dServicios = [ ];

        console.log(dAlumno);


        if (idServicio > 0) {
            console.log("TRUEEEEEE")
            for(let i = 0; i < idServicio.length; i++) {
                Servicio.findOne( { _id: idServicio[i] }, function(err, docs) 
                {
                    dServiciosAFacturar.push(docs);


                    if(idServicio.length-1 === i) {
                        Turno.findOne( { _id: idTurno }, function(err, docs) {
                            dTurnoAFacturar = docs;
                            

                            for (let i = 0; i < dServiciosAFacturar.length ; i++) {
                                dServicios.push(dServiciosAFacturar[i]);
                                dTotalServicios = dTotalServicios + dServiciosAFacturar[i].precioMensual;
                            }
                            console.log(dServicios);


                            let date = new Date()

                            var today = new Date();
                            var dd = today.getDate();
                            
                            var mm = today.getMonth()+1; 
                            var yyyy = today.getFullYear();
                            if(dd<10) 
                            {
                                dd='0'+dd;
                            } 
                            
                            if(mm<10) 
                            {
                                mm='0'+mm;
                            } 

                            today = dd+'/'+mm+'/'+yyyy;

                            if (mm==12) {
                                venc = dd+'/'+ 1 +'/'+yyyy;
                            } else {
                                venc = dd+'/'+ mm+1 +'/'+yyyy;
                            }
                            
                            console.log(dTurnoAFacturar);
                            dTotalCuota = dTotalServicios + dTurnoAFacturar.precioTurno



                            var nuevaCuota = Cuota({
                                mes:req.body.mes,
                                anio: req.body.anio,
                                pagada: false,
                                alumno: dAlumno,
                                titular: dTitular,
                                numeroFactura: (Math.random() * 10000000000000000000),
                                facturada: true,
                                pagada: false,
                                fechaEmision: today,
                                fechaVencimiento: today + 30,
                                turno: dTurnoAFacturar.nombreTurno,
                                valorTurno: dTurnoAFacturar.precioTurno,
                                valorServicios: dTotalServicios,
                                totalCuota: dTotalCuota,
                                quienPaga: "",
                                numeroTransaccion: "",
                                servicios: dServicios,
                            });
        
            
                            nuevaCuota.save().
                            then
                            (
                                (nuevaCuota)=>
                                {` `
                                    console.log("Nueva cuota", nuevaCuota);
                                    Alumno.findOneAndUpdate({_id: req.body.idAlumno },{$push:{cuota:nuevaCuota._id}},{ new: true },function(err,results) {
                                        if(err){
                                            console.log("Error al crear alumno en push Cuota a Alumno");
                                            res.status(500).send(err);
                                            console.log(err);
                                            return;
                                        }
                                        else{
                                            console.log("Cuota creada");
                                            res.status(200).send(nuevaCuota);
                                            console.log("Cuota encontrada", results);
                                            return;
                                        }
                                    });
                                },
                            )
    
                        });
                    }
                });
            };
        } else {

            

                    
                        Turno.findOne( { _id: idTurno }, function(err, docs) {
                            dTurnoAFacturar = docs;

                            let date = new Date()

                            var today = new Date();
                            var dd = today.getDate();
                            
                            var mm = today.getMonth()+1; 
                            var yyyy = today.getFullYear();
                            if(dd<10) 
                            {
                                dd='0'+dd;
                            } 
                            
                            if(mm<10) 
                            {
                                mm='0'+mm;
                            } 

                            today = dd+'/'+mm+'/'+yyyy;

                            if (mm==12) {
                                venc = dd+'/'+ 1 +'/'+yyyy;
                            } else {
                                venc = dd+'/'+ mm+1 +'/'+yyyy;
                            }
                            
                            console.log(dTurnoAFacturar);
                            dTotalCuota = dTurnoAFacturar.precioTurno

                            var nuevaCuota = Cuota({
                                mes:req.body.mes,
                                anio: req.body.anio,
                                pagada: false,
                                alumno: dAlumno,
                                titular: dTitular,
                                numeroFactura: (Math.random() * 10000000000000000),
                                facturada: true,
                                pagada: false,
                                fechaEmision: today,
                                fechaVencimiento: today + 30,
                                turno: dTurnoAFacturar.nombreTurno,
                                valorTurno: dTurnoAFacturar.precioTurno,
                                valorServicios: 0,
                                totalCuota: dTotalCuota,
                                quienPaga: "",
                                numeroTransaccion: "",
                            });
        
            
                            nuevaCuota.save().
                            then
                            (
                                (nuevaCuota)=>
                                {` `
                                    console.log("Nueva cuota", nuevaCuota);
                                    Alumno.findOneAndUpdate({_id: req.body.idAlumno },{$push:{cuota:nuevaCuota._id}},{ new: true },function(err,results) {
                                        if(err){
                                            console.log("Error al crear alumno en push Cuota a Alumno");
                                            res.status(500).send(err);
                                            console.log(err);
                                            return;
                                        }
                                        else{
                                            console.log("Cuota creada");
                                            res.status(200).send(nuevaCuota);
                                            console.log("Cuota encontrada", results);
                                            return;
                                        }
                                    });
                                },
                            )
    
                        });
                    

           

        }
    });
}



let actualizarCuota = (req,res) => 
{
    let id = {idCuota: req.body.idCuota};

    console.log("update",id);

    let params = { 
        nombre:req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        imagenPerfil: req.body.imagenPerfil,
        cuota: req.body.cuota
};

for(let prop in params) if(!params[prop]) delete params[prop];


    Cuota.findOneAndUpdate(
            id,
            {$set : params},
            {new:true},function(err)
        {
        (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }
        });

    res.status(200).send({estado:"Campos modificados"}); 
}

let eliminarCuota = (req,res)=>
{
    console.log(res.req.body.idCuota)
    if (res.req.body.idCuota != null) {
        let id = {_id: res.req.body.idCuota};

        Cuota.deleteOne(id, function(err)
        {
            console.log(id);
            res.status(200).send({estado:"Cuota eliminado"}); //devuelvo resultado  
            (err)=>
            { 
                res.status(500).send(err);
                console.log(err);
            }      
        });
    } else {
        console.log("Id en blanco");
        res.status(200).send({estado:"Id en blanco, por favor enviar un idCuota"});
    } 
}

let obtenerCuotas = (req, res) =>
{      
    console.log("llegue a leer");

    dataLogin = {
        "nombre_usuario": "escuelab.bankame",
        "clave": "Escuelab1234"
    };

    var numeroTrans = 0;

    const csv = require('csv-parser');
    const fs = require('fs');
    fs.createReadStream('./assets/numeroTransaccion.csv')
        .pipe(csv())
        .on('data', (row) => {
            numeroTrans = parseInt(row.numeroTransaccion) + 1
            console.log(numeroTrans)
            const createCsvWriter = require('csv-writer').createObjectCsvWriter;
            const csvWriter = createCsvWriter({
                path: './assets/numeroTransaccion.csv',
                header: [
                    { id: 'numeroTransaccion', title: 'numeroTransaccion' },
                ]
            });
            const records = [{
                numeroTransaccion: numeroTrans
            }];
            csvWriter.writeRecords(records);


            axios({
                method: 'post',
                url: 'https://integracion-banco.herokuapp.com/login',
                data: dataLogin
              }).then((response) => {
                var loginDataRaw = response.data.user;
                loginDataString = JSON.stringify(loginDataRaw);
                loginDataStringRep = loginDataString.replace('x-access-token','token')
                loginData = JSON.parse(loginDataStringRep);
                token = 'Bearer ' + loginData.token;
                
                axios.get(
                    'https://integracion-banco.herokuapp.com/cuentas',
                    { headers: { Authorization : token } }
                    )
                    .then((response) => {
                        var numero_cuenta = response.data.cuentas[0].numero_cuenta;
                        console.log(token)
        
                        
                        axios.get(
                            'https://integracion-banco.herokuapp.com/cuentas/' + numero_cuenta + '/facturas/2020/12', 
                                { headers: { 'Authorization' : token } } )
                            .then((response) => {
                                console.log(response.data)
                                
                                console.log( response.data.facturas.length);
                                for (let i = 0; i < response.data.facturas.length ; i++) {
                                    if (response.data.facturas[i].fecha_pagado !== null) {
                                        
                                        params = {
                                            formaDePago: "Banco B",
                                            pagada: true,
                                            numeroTransaccion: numeroTrans
                                        }
                                        Cuota.findOneAndUpdate(
                                            { numeroFactura: response.data.facturas[i].numero_factura },
                                            { $set: params }, { new: true },
                                            function(err, resultado) {
                                                console.log(resultado);

                                                (err) => {
                                                    console.log(err);
                                                }
                                            })

                                    }
                                    console.log(i);
                                    console.log(response.data.facturas.length);
                                    if (i === response.data.facturas.length-1) {
                                        Cuota.find(function(err,listaCuotas)
                                        {
                                            res.status(200).send(listaCuotas);
                                            (err)=>{
                                                res.status(500).send(err);
                                                console.log(err);
                                            }
                                        }).populate({
                                            path: 'datosFacturacion',
                                            model: 'esctitular'
                                        });
                                    }

                                }
                            },
                            (error) => {
                                console.log(error.response)
                                var status = error.response.status
                                res.status(500).send(error);
                            });
                    },
                    (error) => {
                        var status = error.response.status
                        res.status(500).send(error);
                    }
                  );
              }, (error) => {
                console.log(error);
                console.log("No pudo llamar al login");  
                res.status(500).send(error);
                console.log(error);
              });   
        });


    /*Cuota.find(function(err,listaCuotas)
    {
        res.status(200).send(listaCuotas);
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    }).populate({
        path: 'datosFacturacion',
        model: 'esctitular'
    });*/
};

let obtenerPago = (req, res) =>
{
    Cuota.find({ pagada: true } , function(err,listaCuotas)
    {
        res.status(200).send(listaCuotas);
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    }).populate({
        path: 'datosFacturacion',
        model: 'esctitular'
    });
}


module.exports = 
{
    crearCuota,
    eliminarCuota,
    actualizarCuota,
    obtenerCuotas,
    realizarPago,
    obtenerPago
};