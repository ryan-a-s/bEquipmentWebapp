"use client";

import { useAppContext } from "../../context/AppContext";
import { locationLabels, LocationCode, getLocationLabel } from "../../context/locations";

type Props = {
  onNext: () => void;
};

export default function LocationStep({ onNext }: Props) {
  const { location, setLocation, secondaryLocation, setSecondaryLocation } = useAppContext();

  // Create array of options from locationLabels
  const locations = Object.entries(locationLabels).map(([code, label]) => ({
    value: code as LocationCode,
    label,
  }));

  const handleSelectLocation = (code: LocationCode) => {
    setLocation(code);

    // If the selected location is a ward, we might need a secondary location
    if (code === "F06033-K" || code === "F06034-A") {
      setSecondaryLocation(""); // clear any previous entry
    } else {
      setSecondaryLocation(null); // not needed
      onNext(); // go to next step immediately if not ward
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select Primary Location</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {locations.map((loc) => (
          <button
            key={loc.value}
            onClick={() => handleSelectLocation(loc.value)}
            className={`p-4 border rounded-lg shadow-sm transition ${
              location === loc.value ? "bg-blue-200 border-blue-600" : "bg-white hover:bg-gray-50"
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>

      {/* Show secondary location input if ward */}
      {(location === "F06033-K" || location === "F06034-A") && (
        <div className="mt-4">
          <label className="block mb-2">Enter Ward Name:</label>
          <input
            type="text"
            value={secondaryLocation ?? ""}
            onChange={(e) => setSecondaryLocation(e.target.value)}
            className="border p-2 w-full max-w-md rounded"
            placeholder="Ward Name"
          />
          <button
            disabled={!secondaryLocation}
            onClick={onNext}
            className={`mt-3 px-4 py-2 rounded-lg ${
              secondaryLocation ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
