var ChildService = require('../services/child.service');

_this = this;

exports.createChild = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller",req.body)
    var Child = {
        name: req.body.name,
        lastName: req.body.lastName,
        dni: req.body.dni,
        birthDate: req.body.birthDate,
        bloodType: req.body.bloodType,
        chronicConditions: req.body.chronicConditions,
        allergies: req.body.allergies,
        pediatricRegistries: req.body.pediatricRegistries,
        vaccinations: req.body.vaccinations
    };
    var userId = req.body.userId;
    try {
        // Calling the Service function with the new object from the Request Body
        var createdChild = await ChildService.createChild(Child, userId)
        return res.status(201).json({createdChild, message: "Succesfully Created Child"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: "Child Creation was Unsuccesfull"})
    }
}

exports.getChildrenById = async function (req, res, next) {
    let filtro= {_id: req.body.userId}
    try {
        var Children = await ChildService.getChildren(filtro)
        return res.status(200).json({status: 200, data: Children, message: "Succesfully Children Recieved"});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.addVaccine = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller",req.body)

    var childId = req.body.childId;
    var vaccination = req.body.vaccination;
    try {
        // Calling the Service function with the new object from the Request Body
        var addedVaccine = await ChildService.addVaccine(vaccination, childId)
        return res.status(201).json({addedVaccine, message: "Succesfully Added Vaccine"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: "Vaccine Registration was Unsuccesfull"})
    }
}