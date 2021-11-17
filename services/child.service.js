var Child = require('../models/Child.model');
var User = require('../models/User.model')

exports.createChild = async function (child, userId) {
    // Creating a new Mongoose Object by using the new keyword
    
    var newChild = new Child({
        name: child.name,
        lastName: child.lastName,
        dni: child.dni,
        birthDate: child.birthDate,
        bloodType: child.bloodType,
        chronicConditions: child.chronicConditions,
        allergies: child.allergies,
        pediatricRegistries: child.pediatricRegistries,
        vaccinations: child.vaccinations
    })

    try {
        // Saving the Child 
        var savedChild = await newChild.save();
       
        var updatedUser = await User.findOneAndUpdate(
            {_id: userId},
            {$push:{children: savedChild._id}},
            {new: true})
        return savedChild;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Creating Child")
    }
}


_this = this