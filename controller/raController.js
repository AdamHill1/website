const db = require('../database/database');
var { uid } = require('uid');
var moment = require('moment');

exports.homepage = (req, res) => {
    let roomId = req.session.user.roomId;
    let person = req.session.user.fName;
    let event = db.getEvents(roomId)
    //for showing announcements
    let announ = db.getUserAnnouncemetns(req.session.user.userId);

     for(var x=0; x< announ.length; x++){

        event.push(db.getEvent(announ[x].announcements)); 
       
     }   
     
    if (event == undefined) {

    } else {
        for (let i = 0; i < event.length; i++) {
            if (event[i].repeat === 'None') {
                delete event[i].daysOfWeek
                delete event[i].startRecur
                delete event[i].endRecur
            } else if (event[i].repeat === 'Daily') {
                event[i].daysOfWeek = ['0', '1', '2', '3', '4', '5', '6']

            } else if (event.repeat === 'Weekly') {
                let temp = event[i].daysOfWeek;
                event[i].daysOfWeek = [temp];
            }
        }
    }
    res.render('HomePage', { event, person });
};

exports.inbox = (req, res) => {
    var resmess = db.getResolvedMessage();
    var unresmess = db.getUnResolvedMessage();

    if (resmess || unresmess) {
        res.render('inboxRA', { resmess, unresmess })
    } else {
        let err = new Error('Cannot find a event with id ' + id);
        err.status = 404;
        next(err);
    }
};
exports.viewMessage = (req, res) => {
    var id = req.params.id;
    var message = db.getMessage(id);
    var name = db.getUserid(message.sender);
    if (message) {
        res.render('ViewMessage', { message, name })
    } else {
        let err = new Error('Cannot find a event with id ' + id);
        err.status = 404;
        next(err);
    }
};
exports.updateMessage = (req, res) => {

    var resolved = req.body.resolved;
    var ra = req.body.messageRA;
    var id = req.params.id;

    if (resolved == null) {
        resolved = 0;
    } else {
        resolved = 1;
    }

    db.updateMessage(resolved, ra, id);

    res.redirect('../inbox')
};

exports.anouncementRA = (req, res) => {
    let announ = db.getAnnouncements();

    res.render('Announcements', { announ });
};

exports.going = (req, res, next) => {

    let id = req.params.id
    var user = req.session.user.userId;
    
    if( db.getGoing(user, id).length == 0){
        db.addtoUserProfile(user, id);
    }

    res.redirect('/RA');
};

exports.removeAnnoun = (req, res) => {
    let id = req.params.id
    var user = req.session.user.userId;
    db.removeUserattending(user, id);
    res.redirect('/student');
};

exports.createEventRa = (req, res) => {
    res.render('CreateEvent');
};

exports.createdEventRa = (req, res) => {
    //Get proper time format
    var startDateTime = req.body.edate + "T" + req.body.eSTime + ":00";
    var endDateTime = req.body.edate + "T" + req.body.eETime + ":00";

    //get day of week
    const dayofweek = new Date(startDateTime);
    const day = dayofweek.getDay();

    var dayofweek2 = new Date(req.body.eRecurDateend);
    var endrecur = dayofweek2.getDate();
    dayofweek2.setDate(endrecur + 1);


    var date = dayofweek2.getUTCDate();
    var month = dayofweek2.getMonth();
    var year = dayofweek2.getFullYear();

    recur = (year) + "-" + (month + 1) + "-" + date;

    db.addEvent(startDateTime, endDateTime, req.body.eColor, req.body.eTextcolor, day.toString(), req.body.eTitle, req.body.eDescription, req.body.eType, req.session.user.userId, req.session.user.roomId, req.body.edate, recur, req.body.eRepeat)
    res.redirect('/RA');
};

exports.logoutRA = (req, res) => {
    req.session.user = undefined;
    res.redirect('../');
};

exports.CreateAnnouncementsRA = (req, res) => {

    res.render('CreateAnnouncementRA');
};

exports.EditAnnouncementsRA = (req, res) => {

    let id = req.params.id;
    let event = db.getEvent(id)
    if (event) {
        res.render('EditAnnouncementRA', { event })
    } else {
        let err = new Error('Cannot find a event with id ' + id);
        err.status = 404;
        next(err);
    }
};

exports.CreatedAnnouncementsRA = (req, res) => {

    //Get proper time format
    var startDateTime = req.body.annDate + "T" + req.body.annStartTime + ":00";
    var endDateTime = req.body.annDate + "T" + req.body.annEndTime + ":00";

    //get day of week
    const dayofweek = new Date(startDateTime);
    const day = dayofweek.getDay();

    var dayofweek2 = new Date(req.body.eRecurDateend);
    var endrecur = dayofweek2.getDate();
    dayofweek2.setDate(endrecur + 1);


    var date = dayofweek2.getUTCDate();
    var month = dayofweek2.getMonth();
    var year = dayofweek2.getFullYear();

    recur = (year) + "-" + (month + 1) + "-" + date;

    db.addEvent(startDateTime, endDateTime, req.body.annColor, req.body.annTextcolor, day.toString(), req.body.annTitle, req.body.annDesc, req.body.annType, req.session.user.userId, 000, req.body.annRecurDateend, recur, req.body.annRepeat)
    res.redirect('/RA');
};

exports.deleteAnnouncement = (req, res) => {

    let id = req.params.id;

    db.deleteEvent(id)

    res.redirect('/RA');
};