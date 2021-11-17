var Child = require('../models/Child.model');
var jwt = require('jsonwebtoken');

exports.createChild = async function (child) {
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
       
        return savedChild;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Creating Child")
    }
}


_this = this