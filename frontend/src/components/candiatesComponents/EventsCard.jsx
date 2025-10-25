import React from "react";

const EventsCard = ({ title, value }) => {
  return (
    <div className="card w-96 bg-base-100 card-lg shadow-sm border-2">
      <div className="card-body">
                <p>{title}</p>

        <h2 className="card-title">{value}</h2>
      </div>
    </div>
  );
};

export default EventsCard;
