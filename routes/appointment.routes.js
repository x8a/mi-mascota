const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Appointment = require("../models/Appointment.model");
const app = require("../app");

router.get("/appointments", async (req, res, next) => {
  try {
    const appointments = await Pet.find({owner: req.session.currentUser._id}, {appointments: 1, name: 1,_id: 0}).populate("appointments");
    console.log(`Appointments ---> ${Array.from(appointments)}`)
    res.render('appointments/allAppointments', {
      petAppointments: appointments,
      userInSession: req.session.currentUser
    })
  } catch(error) {
    next(error)
  }
})

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
  const {title, pet, vet, date, time,comments} = req.body
  const petAppointments = await Appointment.find({
    pet: pet
  });
  try {
    const newAppointment = new Appointment({
      title,
      pet,
      vet,
      date: new Date (date),
      time: time,
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

module.exports = router