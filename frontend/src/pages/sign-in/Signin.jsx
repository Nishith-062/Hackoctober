import { SignIn } from '@clerk/clerk-react'
import React from 'react'

const Signin = () => {
  return (
            <div className="h-screen flex justify-evenly items-center">
          <div className="flex flex-col max-w-xl space-y-6">
        <h1 className="text-5xl font-bold text-primary">Welcome Back!</h1>
        <p className="text-lg text-base-content/80">
          Please login to your account to continue learning.
        </p>

        <p className="text-xl font-semibold mt-6">Learn languages naturally</p>
        <p className="text-base-content/70">
          Your AI-powered language tutor that adapts to your learning style.
          Practice conversations, master grammar, and track your progress.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="card border border-base-300 shadow-md hover:shadow-xl transition">
            <div className="card-body items-center text-center">
              <h2 className="card-title">AI Conversations</h2>
              <p className="text-sm text-base-content/70">
                Natural dialogue practice
              </p>
            </div>
          </div>

          <div className="card border border-base-300 shadow-md hover:shadow-xl transition">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Personalized Exercises</h2>
              <p className="text-sm text-base-content/70">
                Adaptive learning path
              </p>
            </div>
          </div>

          <div className="card border border-base-300 shadow-md hover:shadow-xl transition">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Track Progress</h2>
              <p className="text-sm text-base-content/70">
                Earn badges & streaks
              </p>
            </div>
          </div>
        </div>
      </div>

        <SignIn />
        </div>
  )
}

export default Signin