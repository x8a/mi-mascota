const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Appointment = require("../models/Appointment.model");
const app = require("../app");

router.get("/appointments", async (req, res, next) => {
  try {
    const appointments = await Appointment.find({owner: req.session.currentUser._id}).populate("pet");
    console.log(`Appointments ---> ${Array.from(appointments)}`)
    res.render('appointments/allAppointments', {
      petAppointments: appointments,
      userInSession: req.session.currentUser
    })
  } catch(error) {
    next(error)
  }
})
      //let myDate = app.date;
      //app.date = `${myDate.getDate()}-${myDate.getMonth()}-${myDate.getFullYear()}`;

router.get('/create/appointment', async (req, res, next) => {
  try {
    const myPets = await Pet.find({
      owner: req.session.currentUser._id
    });
    res.render('appointments/createAppointment', {
      myPets,
      userInSession: req.session.currentUser
    })
  } catch (error) {
    next(error)
  }
  
})

router.post('/create/appointment', async (req, res, next) => {
  console.table(req.body);
  const owner = req.session.currentUser._id;
  const {title, pet, vet, date, time, comments} = req.body
  const petAppointments = await Appointment.find({
    pet: pet
  });
  try {
    const newAppointment = new Appointment({
      title,
      pet,
      owner,
      vet,
      date,
      time,
      comments
    });
    const appointment = await newAppointment.save()
    petAppointments.push(appointment);
    const appointments = await Pet.findOneAndUpdate({_id: pet}, {appointments: petAppointments})
    res.redirect('/appointments');
  } catch(error) {
    next(error)
  }
})

router.get('/edit/appointment/:appoId', async (req, res, next) => {
  const appointment = Appointment.findById(req.params)
  res.render('appointments/editAppointment', appointment)
})

router.post('edit/appointment/:appoId', async (req, res, next) => {
  
})

module.exports = router