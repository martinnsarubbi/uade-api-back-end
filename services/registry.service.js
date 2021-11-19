var Child = require('../models/Child.model');
var Registry = require('../models/Registry.model')

exports.createRegistry = async function (registry, childId) {
    // Creating a new Mongoose Object by using the new keyword
    
    var newRegistry = new Registry({       
        date: registry.date,
        doctorId: registry.doctorId,
        weight: registry.weight,
        height: registry.height,
        headCirc: registry.headCirc,
        upcomingStudies: registry.upcomingStudies,
        meds: registry.meds
    })

    try {
        // Saving the Registry 
        var savedRegistry = await newRegistry.save();
       
        var updatedChild = await Child.findOneAndUpdate(
            {_id: childId},
            {$push:{pediatricRegistries: savedRegistry._id}},
            {new: true})
        return savedRegistry;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Creating Registry")
    }
}

exports.getChildren = async function (query) {
    try {
        console.log("Query",query)
        var user = await User.findById(query)
        childrenId = user.children;
        childrenArray = [];
        for (var i = 0; i < childrenId.length; i++) {
            var child = await Child.findById(childrenId[i])
            childrenArray.push(child);
        }
        return childrenArray;
    } catch (e) {
        console.log("error services",e)
        throw Error('Error while Paginating Children');
    }
}


_this = this