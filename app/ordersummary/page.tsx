'use client';

import { useAppContext } from '../../context/AppContext';
import { getLocationLabel, isWardLocation, sites } from '../../context/locations';
import { equipmentList } from '../../context/equipment';

export default function ReviewPage() {
  const { location, secondaryLocation, dependencyStatus, patientWeight, patientId, equipment } =
    useAppContext();

  if (!location || !patientWeight) return <p className="p-4">Missing patient/location info.</p>;

  const isWard = isWardLocation(location);

  // Show weight range for ED, exact weight for wards
  const weightDisplay = isWard
    ? `${patientWeight.min} kg`
    : patientWeight.min && patientWeight.max
    ? `${patientWeight.min} – ${patientWeight.max} kg`
    : `${patientWeight.min}+ kg`;

  const selectedEquipmentDetails = Object.entries(equipment)
    .filter(([_, name]) => name) // only include selected
    .map(([category, name]) => {
      const item = equipmentList.find((e) => e.name === name);
      return { category, ...item };
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Review Order</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Info</h2>
        <p>
          <strong>Primary Location:</strong> {location} — {getLocationLabel(location)}
        </p>
        <p><strong>Secondary Location:</strong> {secondaryLocation ?? 'N/A'}</p>
        <p><strong>Patient NHI:</strong> {patientId}</p>
        <p><strong>Dependency Status:</strong> {dependencyStatus ?? 'N/A'}</p>
        <p><strong>Weight:</strong> {weightDisplay}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Selected Equipment</h2>
        {selectedEquipmentDetails.length === 0 ? (
          <p>No equipment selected yet.</p>
        ) : (
          <div className="space-y-3">
            {selectedEquipmentDetails.map((item) => {
              if (!item) return null;

              const site = selectedLocationIsWellington(location) ? 'Wellington' : 'Hutt';
              const procurement = item?.procurement ? item.procurement[site] : 'N/A';

              return (
                <div key={item.name} className="p-3 border rounded-lg shadow-sm">
                  <p className="font-medium">
                    {item.category}: {item.name}
                  </p>

                  {/* Show Max Load unless it's Accessories */}
                  {item.category !== 'Accessories' && (
                    <p className="text-sm text-gray-500">Max Load: {item.maxLoad ?? '-' } kg</p>
                  )}

                  <p className="text-sm text-gray-500">Procurement: {procurement}</p>
                  {item.notes && <p className="text-xs text-gray-400 mt-1">{item.notes}</p>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <button
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        onClick={() => alert('Order confirmed!')}
      >
        Confirm Order
      </button>
    </div>
  );

  function selectedLocationIsWellington(location: string) {
    return sites.Wellington.includes(location as any);
  }
}
