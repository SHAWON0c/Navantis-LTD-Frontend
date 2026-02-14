// UserProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../component/Loader";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/users/me ",
          {
            headers: { Authorization: token },
          }
        );

        if (res.data.success) {
          setUserData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Loader/>;
  if (!userData) return <p>No user data found.</p>;

  const org = userData.organizationProfile || {};

  // Helper to safely access nested fields
  const getValue = (value) => (value !== undefined && value !== null ? value : "");

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>User Profile</h2>
      <section style={{ marginBottom: "20px" }}>
        <h3>Basic Info</h3>
        <div><strong>Name:</strong> {getValue(org.name)}</div>
        <div><strong>Email:</strong> {getValue(userData.email)}</div>
        <div><strong>Employee ID:</strong> {getValue(userData.employeeId)}</div>
        <div><strong>Role:</strong> {getValue(userData.role)}</div>
        <div><strong>Verified:</strong> {userData.isVerified ? "Yes" : "No"}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Identity</h3>
        <div><strong>NID:</strong> {getValue(org.identity?.nidNumber)}</div>
        <div><strong>Passport:</strong> {getValue(org.identity?.passportNumber)}</div>
        <div><strong>Driving License:</strong> {getValue(org.identity?.drivingLicenseNumber)}</div>
        <div><strong>TIN:</strong> {getValue(org.identity?.tinNumber)}</div>
        <div><strong>NID Verified:</strong> {org.identity?.isNidVerified ? "Yes" : "No"}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Education</h3>
        <div><strong>Highest Education:</strong> {getValue(org.education?.highestEducation)}</div>
        <div><strong>Institution:</strong> {getValue(org.education?.institution)}</div>
        <div><strong>Passing Year:</strong> {getValue(org.education?.passingYear)}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Employment</h3>
        <div><strong>Employee Code:</strong> {getValue(org.employment?.employeeCode)}</div>
        <div><strong>Designation:</strong> {getValue(org.employment?.designation)}</div>
        <div><strong>Department:</strong> {getValue(org.employment?.department)}</div>
        <div><strong>Grade:</strong> {getValue(org.employment?.grade)}</div>
        <div><strong>Workplace:</strong> {getValue(org.employment?.workplace)}</div>
        <div><strong>Type:</strong> {getValue(org.employment?.employmentType)}</div>
        <div><strong>Status:</strong> {getValue(org.employment?.employmentStatus)}</div>
        <div><strong>Joined At:</strong> {org.employment?.joinedAt ? new Date(org.employment.joinedAt).toLocaleDateString() : ""}</div>
        <div><strong>Probation End:</strong> {org.employment?.probationEndDate ? new Date(org.employment.probationEndDate).toLocaleDateString() : ""}</div>
        <div><strong>Confirmation Date:</strong> {org.employment?.confirmationDate ? new Date(org.employment.confirmationDate).toLocaleDateString() : ""}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Payroll</h3>
        <div><strong>Basic Salary:</strong> {getValue(org.payroll?.basicSalary)}</div>
        <div><strong>Gross Salary:</strong> {getValue(org.payroll?.grossSalary)}</div>
        <div><strong>Payment Method:</strong> {getValue(org.payroll?.paymentMethod)}</div>
        <div><strong>Bank Name:</strong> {getValue(org.payroll?.bankName)}</div>
        <div><strong>Account Number:</strong> {getValue(org.payroll?.accountNumber)}</div>
        <div><strong>Salary Hold:</strong> {org.payroll?.isSalaryHold ? "Yes" : "No"}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Leave Info</h3>
        <div><strong>Casual:</strong> {getValue(org.leaveInfo?.casual)}</div>
        <div><strong>Sick:</strong> {getValue(org.leaveInfo?.sick)}</div>
        <div><strong>Annual:</strong> {getValue(org.leaveInfo?.annual)}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Shift Info</h3>
        <div><strong>Shift:</strong> {getValue(org.shiftInfo?.shiftName)}</div>
        <div><strong>Weekly Off:</strong> {getValue(org.shiftInfo?.weeklyOff)}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Health Info</h3>
        <div><strong>Medical Conditions:</strong> {getValue(org.healthInfo?.medicalConditions)}</div>
        <div><strong>Allergies:</strong> {getValue(org.healthInfo?.allergies)}</div>
        <div><strong>Insurance Policy No:</strong> {getValue(org.healthInfo?.insurancePolicyNo)}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Emergency Contact</h3>
        <div><strong>Name:</strong> {getValue(org.emergencyContact?.name)}</div>
        <div><strong>Relation:</strong> {getValue(org.emergencyContact?.relation)}</div>
        <div><strong>Phone:</strong> {getValue(org.emergencyContact?.phone)}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Assets</h3>
        <div><strong>Laptop Serial:</strong> {getValue(org.assets?.laptopSerial)}</div>
        <div><strong>Mobile IMEI:</strong> {getValue(org.assets?.mobileIMEI)}</div>
        <div><strong>SIM Number:</strong> {getValue(org.assets?.simNumber)}</div>
        <div><strong>Company Email:</strong> {getValue(org.assets?.companyEmail)}</div>
        <div><strong>Access Card:</strong> {getValue(org.assets?.accessCardId)}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Exit Info</h3>
        <div><strong>Resignation Date:</strong> {org.exitInfo?.resignationDate || ""}</div>
        <div><strong>Last Working Day:</strong> {org.exitInfo?.lastWorkingDay || ""}</div>
        <div><strong>Exit Reason:</strong> {org.exitInfo?.exitReason || ""}</div>
        <div><strong>Clearance Status:</strong> {org.exitInfo?.clearanceStatus || ""}</div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Profile History</h3>
        {org.history?.length > 0 ? (
          org.history.map((item) => (
            <div key={item._id} style={{ borderBottom: "1px solid #ccc", padding: "5px 0" }}>
              <strong>Action:</strong> {item.action} <br />
              <strong>Date:</strong> {new Date(item.date).toLocaleString()}
            </div>
          ))
        ) : (
          <p>No history available</p>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
