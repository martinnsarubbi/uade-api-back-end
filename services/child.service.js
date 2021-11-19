var Child = require('../models/Child.model');
var User = require('../models/User.model');
var Registry = require('../models/Registry.model');

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

exports.getChildren = async function (query) {
    try {
        console.log("Query",query)
        var user = await User.findById(query)
        childrenId = user.children;
        childrenArray = [];
        pediatricRegistriesArray = []
        for (var i = 0; i < childrenId.length; i++) {
            var child = await Child.findById(childrenId[i])
            for (var j = 0; j < child.pediatricRegistries.length; j++) {
                var pediatricRegistry = await Registry.findById(child.pediatricRegistries[j]);
                pediatricRegistriesArray.push(pediatricRegistry);
            }
            child.pediatricRegistries = pediatricRegistriesArray;
            pediatricRegistriesArray = [];
            childrenArray.push(child);
        }

        return childrenArray;
    } catch (e) {
        console.log("error services",e)
        throw Error('Error while Paginating Children');
    }
}


exports.addVaccine = async function (vaccination, childId) {

    try {
       console.log("!!!!!!!!!" + vaccination + "!!!!!!!!!")
        var updatedChild = await Child.findOneAndUpdate(
            {_id: childId},
            {$push:{vaccinations: vaccination}},
            {new: true})
        return updatedChild;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Adding Vaccine To Child")
    }
}


_this = this