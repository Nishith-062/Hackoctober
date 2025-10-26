import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Feedback from "../../../../backend/src/models/feedback.model";
import axios from "axios";
const Feedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    candidate_email: "",
    technical_skills: "",
    problem_solving: "",
    communication: "",
    overall_comments: "",
    rating: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:3000/api/interviewer/feedback", feedback, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 200) {
      alert("Feedback submitted!");
      navigate(-1);
    } else {
      alert("Failed to submit feedback");
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting feedback");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Interview Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Candidate Email */}
          <div>
            <label className="block mb-1 font-medium">Candidate Email</label>
            <input
              type="email"
              name="candidate_email"
              value={feedback.candidate_email}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter candidate email"
              required
            />
          </div>

          {/* Technical Skills */}
          <div>
            <label className="block mb-1 font-medium">Technical Skills</label>
            <textarea
              name="technical_skills"
              value={feedback.technical_skills}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Evaluate technical skills"
              required
            ></textarea>
          </div>

          {/* Problem Solving */}
          <div>
            <label className="block mb-1 font-medium">Problem Solving</label>
            <textarea
              name="problem_solving"
              value={feedback.problem_solving}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Evaluate problem solving"
              required
            ></textarea>
          </div>

          {/* Communication */}
          <div>
            <label className="block mb-1 font-medium">Communication</label>
            <textarea
              name="communication"
              value={feedback.communication}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Evaluate communication skills"
              required
            ></textarea>
          </div>

          {/* Overall Comments */}
          <div>
            <label className="block mb-1 font-medium">Overall Comments</label>
            <textarea
              name="overall_comments"
              value={feedback.overall_comments}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Any additional comments"
              required
            ></textarea>
          </div>

          {/* Rating */}
          <div>
            <label className="block mb-1 font-medium">Rating</label>
            <select
              name="rating"
              value={feedback.rating}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Average</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
