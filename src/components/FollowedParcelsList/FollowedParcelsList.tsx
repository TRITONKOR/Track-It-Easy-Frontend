import React from "react";
import { MovementHistoryEvent, Parcel } from "../../api/TrackApi";
import { FollowedParcelItem } from "./FollowedParcelItem/FollowedParcelItem";

interface FollowedParcelsListProps {
    parcels: Parcel[];
}

const FollowedParcelsList: React.FC<FollowedParcelsListProps> = ({
    parcels,
}) => {
    return (
        <div className="followed-parcels-list">
            <ul className="parcels-list">
                {parcels.map((parcel) => {
                    const currentEvent = parcel.movementHistory.find(
                        (event: MovementHistoryEvent) =>
                            event.statusLocation === "now"
                    );

                    if (!currentEvent) return null;

                    return (
                        <li key={parcel.trackingNumber} className="parcel-item">
                            <FollowedParcelItem
                                trackingNumber={parcel.trackingNumber}
                                movementHistory={currentEvent}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default FollowedParcelsList;
