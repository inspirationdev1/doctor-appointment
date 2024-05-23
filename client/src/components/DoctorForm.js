import React, { useState } from "react";
import Layout from "../components/Layout";
import { Form, Col, Row, Input, TimePicker, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import moment from "moment";

function DoctorForm({ onFinish, initialValues }) {
  
  const [selectedStartTime, setSelectedStartTime] = useState("00:00");
  const [selectedEndTime, setSelectedEndTime] = useState("00:00");
  
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <h1 className="card-title">Personal Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Web Site"
            name="website"
            rules={[{ required: true }]}
          >
            <Input placeholder="Web Site" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </Col>
      </Row>
      <hr />
      <h1 className="card-title">Professional Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Input placeholder="Specialization" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Experience"
            name="experience"
            rules={[{ required: true }]}
          >
            <Input placeholder="Experience" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Fee Per Consultation"
            name="feePerConsultation"
            rules={[{ required: true }]}
          >
            <Input placeholder="Fee Per Consultation" type="number" />
          </Form.Item>
        </Col>
        
        <Col span={8} xs={24} sm={24} lg={8}>
        <Form.Item
            required
            label="Start Time"
            name="startTime"
            id="startTime"
          >
            <TimePicker use24Hours format="HH:mm"/>
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
        <Form.Item
            required
            label="End Time"
            name="endTime"
            id="endTime"
          >
            <TimePicker use24Hours format="HH:mm"
           />
          </Form.Item>
        </Col>
      </Row>
      <div className="d-flex" justify-content-end="true">
        <Button className="primary-button my-2" htmlType="submit">
          SUBMIT
        </Button>
      </div>
    </Form>
  );
}

export default DoctorForm;
