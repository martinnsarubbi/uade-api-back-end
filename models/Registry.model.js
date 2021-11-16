var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var RegistrySchema = new mongoose.Schema({
    date: Date,
    doctorId: String,
    weight: Number,
    height: Number,
    headCirc: Number,
    upcomingStudies: String,
    meds:
    [
        {
            medsName: String,
            dosage: String,
            from: Date,
            to: Date
        }
    ]
})

RegistrySchema.plugin(mongoosePaginate)
const Registry = mongoose.model('Registry', RegistrySchema)

module.exports = Registry;