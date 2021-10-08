var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var UserSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    dni: String,
    telephone: String,
    email: String,
    password: String,
    date: Date
})

UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema)

module.exports = User;