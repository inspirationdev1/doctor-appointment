import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Form, Col, Row, Input, TimePicker, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import DoctorForm from "../../components/DoctorForm";
import moment from "moment";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctor, setDoctor] = useState(null);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      // debugger;
      // values.startTime = moment(values.startTime, "HH:mm");
      // values.endTime = moment(values.endTime, "HH:mm");

      console.log("values", values);

      const response = await axios.post(
        "/api/doctor/update-doctor-profile",
        {
          ...values,
          userId: user._id,
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
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-user-id",
        { userId: params.userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        response.data.data.startTime = moment(response.data.data.startTime).format("HH:mm");
        response.data.data.startTime = moment(response.data.data.startTime,"HH:mm");
        response.data.data.endTime = moment(response.data.data.endTime).format("HH:mm");
        response.data.data.endTime = moment(response.data.data.endTime,"HH:mm");
        

        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />
      {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />}
    </Layout>
  );
}

export default Profile;
