const express = require("express");
const router = express.Router();
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");
const Doctor = require("../models/doctorModel.js");


router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find();
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

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(200).send({ message: "Users does not exist", success: false });
    } else {
      return res.status(200).send({
        message: "Users list fetch successfully",
        success: true,
        data: users,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error getting doctors list", success: false, error });
  }
});

router.post("/change-doctor-account-status", authMiddleware, async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, {
      status,
    });
    
    const user = await User.findOne({_id: doctor.userId });
    let unseenNotifications = user.unseenNotifications ? user.unseenNotifications : [];

    unseenNotifications.push({
      type: "new-doctor-request-changed",
      message: `Your doctor account has been ${status}`,
      onClickPath: '/notifications'
    })
    user.isDoctor = status === 'approved' ? true : false;
    await user.save();

    
    res.status(200).send({
      success: true,
      message: "Doctor status updated successfully",
      data: doctor,
    });

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error change doctor status", success: false, error });
  }
});
module.exports = router;
