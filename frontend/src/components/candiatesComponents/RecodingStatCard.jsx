import React from 'react'
export default function RecodingStatCard({ label, value }) {
  return (
    // Using daisyUI 'card' component structure
    <div className="card w-full bg-base-100 shadow-lg rounded-lg border border-base-300/30 transition-all hover:shadow-xl">
      <div className="card-body p-4 sm:p-6">
        {/* Label for the statistic */}
        <p className="text-sm font-normal text-base-content/70 mb-1">
          {label}
        </p>
        
        {/* Value of the statistic */}
        <h3 className="text-3xl font-bold text-base-content leading-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}