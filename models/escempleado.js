
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EmpleadoSchema = new Schema({
    id:String,
    nombre:String,
    apellido:String,
    correo: String,
    pais: String,
    provincia: String,
    ciudad: String,
    codigoPostal: String,
    direccion: String,
    telefono: String,
    categoria: String,
    puesto: String,
    cargaHoraria: String,
    sueldo: Number,
    fechaIngreso: String,
    hijos: [{
      nombre: String
    }]
});

EmpleadoSchema.set('toObject', {
  transform: function (doc, ret) {
    ret._id = ret.id

    delete ret._id
    delete ret.__v
    delete password
  }
})

EmpleadoSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

var Escempleado = mongoose.model('escempleado', EmpleadoSchema);
console.log("se creo modelo");
module.exports = Escempleado;
