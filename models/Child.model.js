var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
var Schema = mongoose.Schema;

var ChildSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    dni: String,
    birthDate: Date,
    bloodType: String,
    chronicConditions:
    [
       { 
          conditionName: String
       }
    ],
    allergies: 
    [
        { 
           allergyName: String
        }
    ],
    pediatricRegistries:
    [
        {
            type: Schema.ObjectId,
            ref: "Registry"
        }
    ],
    vaccinations:
    [
        {
            vaccineName: String,
            vaccinationDate: String,
            observations: String,
            location: String
        }
    ]
})

ChildSchema.plugin(mongoosePaginate)
const Child = mongoose.model('Child', ChildSchema)

module.exports = Child;