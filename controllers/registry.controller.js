
var RegistryService = require('../services/registry.service');

exports.createRegistry = async function (req, res, next) {
    console.log("llegue al controller",req.body)
    var Registry = {
        date: req.body.date,
        doctorId: req.body.doctorId,
        weight: req.body.weight,
        height: req.body.height,
        headCirc: req.body.headCirc,
        observations: req.body.observations,
        upcomingStudies: req.body.upcomingStudies,
        meds: req.body.meds
    };
    var childId = req.body.childId;
    try {
        // Calling the Service function with the new object from the Request Body
        var createdRegistry = await RegistryService.createRegistry(Registry, childId)
        return res.status(201).json({createdRegistry, message: "Succesfully Created Registry"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: "Registry Creation was Unsuccesfull"})
    }
}
