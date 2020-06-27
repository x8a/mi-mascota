const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Appointment = require("../models/Appointment.model");
const app = require("../app");
const { route } = require("./index.routes");

router.get("/appointments", async (req, res, next) => {
  if(req.session.currentUser) {
    try {
      const appointments = await Appointment.find({owner: req.session.currentUser._id}).sort({date: 1}).populate("pet");
      res.render('appointments/allAppointments', {petAppointments: appointments,userInSession: req.session.currentUser})
    } catch (error) {
      next(error)
    }
  } else {
    res.redirect('login')
  }
  
})

router.get('/create/appointment', async (req, res, next) => {
  try {
    const myPets = await Pet.find({owner: req.session.currentUser._id});
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
  const appointment = await Appointment.findById(req.params.appoId).populate('pet')
  req.session.currentUser ? res.render('appointments/editAppointments', {
    appointment,
    userInSession: req.session.currentUser
  }) : res.redirect('/login');
})

router.post('/edit/appointment/:appoId', async (req, res, next) => {
  if(req.session.currentUser) {
    try {
      const edAppo = {
        title: req.body.title,
        vet: req.body.vet,
        date: req.body.date,
        time: req.body.time,
        comments: req.body.comments
      }
      const appointment = await Appointment.findByIdAndUpdate(req.params.appoId, edAppo, {
        new: true
      })
      res.redirect('/appointments')
    } catch (error) {
      next(error)
    }
  } else {
    res.redirect('/login')
  }
  
  
})

router.post('/delete/appointment/:appoId', async (req, res, next) => {
  try {
    const {appoId} = req.params
    const deletedAppo = await Appointment.findByIdAndDelete(appoId)
    updatedPet = await Pet.findOneAndUpdate({_id: deletedAppo.pet}, {$pull: {appointments: deletedAppo._id}})
    res.redirect('/appointments');
  } catch (error) {
    next(error)
  }
})


router.get('/appointment/:appoId', async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.appoId).populate('pet')
  req.session.currentUser ? res.render('appointments/appointment', {
    appointment,
    userInSession: req.session.currentUser
  }) : res.redirect('/login');
})


module.exports = router