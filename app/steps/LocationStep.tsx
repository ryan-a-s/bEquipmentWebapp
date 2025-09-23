"use client";

import { useAppContext } from "../../context/AppContext";
import { locationLabels, LocationCode } from "../../context/locations";

type Props = {
  onNext: () => void;
};

export default function LocationStep({ onNext }: Props) {
  const { location, setLocation, secondaryLocation, setSecondaryLocation } = useAppContext();

  const locations = Object.entries(locationLabels).map(([code, label]) => ({
    value: code as LocationCode,
    label,
  }));

  // Determine if the current location is a ward
  const isWard = location === "F06033-K" || location === "F06034-A";

  const handleSelectLocation = (code: LocationCode) => {
    setLocation(code);

    if (code === "F06033-K" || code === "F06034-A") {
      setSecondaryLocation(""); // clear previous ward input
    } else {
      setSecondaryLocation(null); // no secondary needed
    }
  };

  // Continue button enabled logic
  const canContinue = isWard ? !!secondaryLocation?.trim() : !!location;

  return (
    <div className="flex flex-col">
      <h2 className="pb-2 text-lg">Select Primary Location</h2>

      <div className=" pb-8 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {locations.map((loc) => (
          <button
            key={loc.value}
            onClick={() => handleSelectLocation(loc.value)}
            className={`p-4 rounded-lg shadow-sm transition ${
              location === loc.value ? "bg-primaryC text-on-primary font-bold" : "bg-surfaceHigh hover:bg-surfaceHighest"
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>

      {/* Only show ward text input for ward locations */}
      {isWard && (
        <div className="pb-8">
          <h2 className="pb-2 text-lg">Enter Ward Name:</h2>
          <input
            type="text"
            value={secondaryLocation ?? ""}
            onChange={(e) => setSecondaryLocation(e.target.value)}
            className={`
              border-2 border-outline px-2 py-4 w-full rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              ${secondaryLocation ? "bg-primaryC border-primaryC text-on-primary font-bold" : "text-on-surfaceV bg-surfaceHigh"}
            `}
            placeholder="Ward Name"
          />
        </div>
      )}



      {/* Continue button */}
      <button
        disabled={!canContinue}
        onClick={onNext}
        className={`self-center w-1/2 sm:w-1/3  p-4 rounded-lg transition ${
          canContinue
            ? "bg-accept-green text-on-primary font-bold hover:bg-accept-greenH shadow-sm"
            : "bg-surfaceV text-on-surfaceV cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
