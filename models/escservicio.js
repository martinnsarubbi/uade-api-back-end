var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const servicioSchema = new Schema({
    
        id: String,
        nombreCategoriaServicio: String,
        nombreServicio: String,
        precioMensual: Number

  })

servicioSchema.set('toObject', {
    transform: function (doc, ret) {
        ret._id = ret.id
        delete ret._id
        delete ret.__v
        delete password
    }
})
  
servicioSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

var Escservicio = mongoose.model('escservicio', servicioSchema);
console.log("se creo modelo");
module.exports = Escservicio;