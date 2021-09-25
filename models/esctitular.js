
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TitularSchema = new Schema({
    id:String,
    nombre:String,
    apellido:String,
    tipoDocumento:String,
    documento:String,
    correo:String,
    imagenPerfil: String,
    pais: String,
    provincia: String,
    ciudad: String,
    codigoPostal: String,
    direccion: String,
    direccion2: String,
    telefonoContacto: String,
    password: String,
    alumno:
    [
       { 
           type: Schema.ObjectId,
           ref: "escalumno"
       }
    ],
    cuota:
    [
      {
        type: Schema.ObjectId,
        ref: "esccuota"
      }
    ]
});

TitularSchema.set('toObject', {
  transform: function (doc, ret) {
    ret._id = ret.id

    delete ret._id
    delete ret.__v
    delete password
  }
})

TitularSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

var Esctitular = mongoose.model('esctitular', TitularSchema);
console.log("se creo modelo");
module.exports = Esctitular;

