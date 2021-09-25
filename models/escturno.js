
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TurnoSchema = new Schema({
    id: String,
    nombreTurno: String,
    precioTurno: Number
});


TurnoSchema.set('toObject', {
    transform: function (doc, ret) {
        ret._id = ret.id
        delete ret._id
        delete ret.__v
        delete password
    }
})
  
TurnoSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

var Escturno = mongoose.model('escturno', TurnoSchema);
console.log("se creo modelo");
module.exports = Escturno;