import React, { useState } from "react";
import { useApi } from "../../api/useApi";
import { toast } from 'react-hot-toast';
const SchedulingForm = () => {
  
  const [loading,setloading]=useState(false);
  const [formData, setFormData] = useState({
    interviewTitle: "",
    candidateName: "John Doe",
    candidateEmail: "john@example.com",
    date: "",
    time: "",
    duration: "60 minutes",
    programmingLanguage: "JavaScript",
    difficulty: "Medium",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const api = useApi();

  // This is the main function for your logic
  const handleSubmit = async (e) => {
    e.preventDefault(); // Keep this to prevent page reload
    setloading(true);
    const res = await api.post("/interviewer/scheduleInterview", formData);
    
    console.log(res.data);

    // --- YOUR FUNCTIONALITY HERE ---
    console.log("Interview Scheduled:", formData);
    // ---
    


    // Manually close the modal after logic is done
    document.getElementById("my_modal_1").close();

    toast.success("Successfully Scheduled Interview ")
    
    // close loading 
    setloading(false);
  };

  // Simple handler to close modal on "Cancel"
  const handleCancel = () => {
    document.getElementById("my_modal_1").close();
  };

  return (
    <div className="modal-box max-w-3xl">
      <h3 className="font-bold text-lg">Interview Details</h3>
      <p className="py-2 text-sm">
        Fill in the information below to schedule a new interview
      </p>

      {/* Form NO LONGER has method="dialog" */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 py-4">
          {/* Interview Title */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Interview Title</span>
            </label>
            <input
              type="text"
              name="interviewTitle"
              value={formData.interviewTitle}
              onChange={handleChange}
              placeholder="e.g., Frontend Developer Interview"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* ... all other form inputs (name, email, date, etc.) ... */}
          {/* (Kept them collapsed here for brevity) */}

          {/* Candidate Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Candidate Name</span>
              </label>
              <input
                type="text"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                placeholder="John Doe"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Candidate Email</span>
              </label>
              <input
                type="email"
                name="candidateEmail"
                value={formData.candidateEmail}
                onChange={handleChange}
                placeholder="john@example.com"
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          {/* Date, Time, Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Time</span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Duration (min)</span>
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option>60 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>90 minutes</option>
              </select>
            </div>
          </div>

          {/* Language & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Programming Language</span>
              </label>
              <select
                name="programmingLanguage"
                value={formData.programmingLanguage}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option>JavaScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>Go</option>
                <option>C++</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Difficulty Level</span>
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option>Medium</option>
                <option>Easy</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Description (Optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered h-24"
              placeholder="Add any additional notes or requirements for this interview..."
            ></textarea>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-action mt-6">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            // This will trigger onSubmit, which now also closes the modal
          >
            {loading? "Scheduling...":"Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchedulingForm;
