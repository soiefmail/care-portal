var Patient = require('../models/patient');

module.exports = function (patientObj) {
    new Patient({
        registrationid: patientObj.regId,
        registrationDate: patientObj.registrationDate,
        patientName: patientObj.patientName,
        underDoctor: patientObj.underDoctor,
        sufferingFrom: patientObj.sufferingFrom,
        sex: patientObj.sex,
        age: patientObj.age,
        aadharVoterId: patientObj.aadharVoterId,
        admissionType: patientObj.admissionType,
        paymentType: patientObj.paymentType,
        village: patientObj.village,
        postOffice: patientObj.postOffice,
        policeStation: patientObj.policeStation,
        district: patientObj.district,
        state: patientObj.state,
        primaryPhoneNo: patientObj.primaryPhoneNo,
        secondaryPhoneNo: patientObj.secondaryPhoneNo,
        email: patientObj.email
    }).save(function(err, result){
        if (err) throw err;
        if (result) { 
            console.log('Succefully Inserted');
        };
    });
    return 'success';
};
