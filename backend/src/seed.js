import mongoose from "mongoose";
import ProblemSet from "./models/ProblemSet.model.js";
import Problem from "./models/problem.model.js";
import TestCase from "./models/test_case.model.js";
import problemSets from "./problemSets.js"
import dotenv from 'dotenv'
dotenv.config()
const MONGO_URI = 'mongodb+srv://nishithcbit_db_user:TR2zX50SKrytpsTq@cluster0.i0c8jca.mongodb.net/hackoctober?appName=Cluster0' // replace with your DB URL

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await ProblemSet.deleteMany({});
    await Problem.deleteMany({});
    await TestCase.deleteMany({});
    console.log("🧹 Cleared old data");

    // Seed data
    for (const set of problemSets) {
      const newSet = await ProblemSet.create({
        title: set.title,
        duration: set.duration,
        difficulty: set.difficulty,
      });

      for (const prob of set.problems) {
        const newProb = await Problem.create({
          problem_set_id: newSet._id,
          title: prob.title,
          description: prob.description,
          difficulty: prob.difficulty,
          initialCode: prob.initialCode,
          hints: prob.hints,
        });

        for (const t of prob.testCases) {
          await TestCase.create({
            problem_id: newProb._id,
            input: t.input,
            output: t.output,
            is_hidden: t.is_hidden,
          });
        }
      }
    }

    console.log("🌱 Database seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
