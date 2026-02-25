import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCreateRiderMutation } from "../../redux/features/rider/riderApi";

const CreateRiderModal = ({ isOpen, onClose }) => {
  const [createRider, { isLoading }] = useCreateRiderMutation();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    nidOrLicense: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.mobile || !formData.nidOrLicense) {
      toast.error("Name, Mobile, and NID/License are required");
      return;
    }

    try {
      await createRider(formData).unwrap();
      toast.success("Rider created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create rider");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-md rounded-xl shadow-xl p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaUserPlus /> New Dispatch Rider
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Rider Name *"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="mobile"
            placeholder="Mobile Number *"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="email"
            placeholder="Email (optional)"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="nidOrLicense"
            placeholder="NID / License *"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-1"
            >
              <FaTimes /> Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {isLoading ? "Saving..." : "Create Rider"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateRiderModal;