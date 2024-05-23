import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import moment from "moment";
import axios from "axios";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import toast from "react-hot-toast";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTimeChange = (time, timeString) => {
    if (time) {
      setIsAvailable(false);
      let strTime = timeString;
      setTime([strTime]);
      console.log(
        "Output from handleTimeChange:",
        time
      ); /* here pickedDates does not have the latest value */
    }
  };
  const handleDateChange = (date, dateString) => {
    if (date) {
      setIsAvailable(false);
      let strDate = dateString;
      let dd =moment(strDate).format("DD-MM-YYYY");
      let ee =moment(strDate, "DD-MM-YYYY");
      setDate(strDate);
      console.log(
        "Output from handleDateChange:",
        date
      ); /* here pickedDates does not have the latest value */
    }
  };
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
     
      let strTime = time[0];
      let strDate = date;
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: strDate,
          time: strTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        
        toast.success(response.data.message);
        navigate('/appointments');
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  const checkAvailablity = async () => {
    try {
      dispatch(showLoading());
      
      let strTime = time[0];
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date,
          time: strTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error checking booking appointment");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <div>
      <Layout>
        {doctor && (
          <div>
            <h1 className="page-title">
              {doctor.firstName} {doctor.lastName}
            </h1>
            <hr />
            <Row gutter={20} className="mt-5" align="middle">
              <Col span={8} sm={24} xs={24} lg={8}>
                <img
                  src="data:image/png;base64,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"
                  alt=""
                  width="100%"
                  height="200"
                />
              </Col>
              <Col span={8} sm={24} xs={24} lg={8}>
                <h1 className="normal-text">
                  <b>Timings :</b> {doctor.timings[0]} - {doctor.timings[1]}
                </h1>
                <p>
                  <b>Phone Number : </b>
                  {doctor.phoneNumber}
                </p>
                <p>
                  <b>Address : </b>
                  {doctor.address}
                </p>
                <p>
                  <b>Fee Per Consultation : </b>
                  {doctor.feePerConsultation}
                </p>
                <p>
                  <b>Website : </b>
                  {doctor.website}
                </p>
                <div className="d-flex flex-column pt-2 mt-2">
                  <DatePicker id="date" name="date" onChange={handleDateChange} format="DD-MM-YYYY"  />

                  <TimePicker format="HH:mm" onChange={handleTimeChange} />

                  {!isAvailable && (
                    <Button
                      className="primary-button mt-3 full-width-button"
                      onClick={checkAvailablity}
                    >
                      Check Availability
                    </Button>
                  )}
                  {isAvailable && (
                    <Button
                      className="primary-button mt-3 full-width-button"
                      onClick={bookNow}
                    >
                      Book Now
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Layout>
    </div>
  );
}

export default BookAppointment;
