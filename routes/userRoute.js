const express = require("express");
const router = express.Router();
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");
const Doctor = require("../models/doctorModel.js");
const Appointment = require("../models/appointmentModel.js");
const moment = require("moment");

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating User", success: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res
        .status(200)
        .send({ message: "Login successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      res.status(200).send({ message: "User does not exist", success: false });
    } else {
      return res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error getting user Info", success: false, error });
  }
});

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    
    const newdoctor = new Doctor({ ...req.body, status: "pending" });
    await newdoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    let unseenNotifications = adminUser.unseenNotifications
      ? adminUser.unseenNotifications
      : [];

    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newdoctor.firstName}  ${newdoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + " " + newdoctor.lastName,
      },
      onClickPath: "/admin/doctorslist",
    });
    await User.findByIdAndUpdate(adminUser._id, {
      unseenNotifications: unseenNotifications,
    });
    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const unseenNotifications = user.unseenNotifications
        ? user.unseenNotifications
        : [];
      const seenNotifications = user.seenNotifications
        ? user.seenNotifications
        : [];
      seenNotifications.push(...unseenNotifications);
      user.seenNotifications = seenNotifications;
      user.unseenNotifications = [];
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "All notifications marked as seen",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error All notifications marked as seen",
        success: false,
        error,
      });
    }
  }
);

router.post("/delete-all-notfications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error All notifications marked as seen",
      success: false,
      error,
    });
  }
});

router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    if (!doctors) {
      res
        .status(200)
        .send({ message: "Doctors does not exist", success: false });
    } else {
      return res.status(200).send({
        message: "Doctors list fetch successfully",
        success: true,
        data: doctors,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error getting doctors list", success: false, error });
  }
});

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();

    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error book-appointment", success: false, error });
  }
});

router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();

    
    // const fromTime = moment(req.body.time, "HH:mm")
    //   .subtract(1, "hours")
    //   .toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
    .subtract(59, "minutes")
    .toISOString();
    // const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(59, "minutes").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Appointments not available",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error book-appointment", success: false, error });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    return res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error fetching appointments", success: false, error });
  }
});

module.exports = router;
