var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Event = new mongoose.Schema({
    clubOrChapter: String,
    chapter: {
        type: ObjectId,
        ref: 'Chapter'
    },
    eventName: String,
    startDate: Date,
    endDate: Date,
    startTime: String,
    duration: Number,
    eventDescription: String,
    eventParticipants: Number,
    venueRequirement: String,
    guestDetails: String,
    budget: String,
    sponsors: String,
    studentCoordinator: {
        name: String,
        regNum: String,
        school: String,
        mobile: Number,
        email: String
    },
    facultyCoordinator: {
        name: String,
        empId: String,
        mobile: Number,
        school: String,
        email: String
    },
    ceoRequest: String,
    proRequest: String,
    other: String,
    approvalStatus: Boolean
});

module.exports = mongoose.model('Event', Event);