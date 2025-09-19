'use client';

import { useAppContext } from '../../context/AppContext';
import { getLocationLabel, isWardLocation, sites } from '../../context/locations';
import { equipmentList, EquipmentItem } from '../../context/equipment';

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

  // Filter selected equipment and get details
  const selectedEquipmentDetails: EquipmentItem[] = Object.entries(equipment)
    .filter(([_, name]) => !!name)
    .map(([_, name]) => equipmentList.find((e) => e.name === name))
    .filter((item): item is EquipmentItem => !!item);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Review Order</h1>

      {/* Order info */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Info</h2>
        <p>
          <strong>Primary Location:</strong> {location} — {getLocationLabel(location)}
        </p>
        <p>
          <strong>Secondary Location:</strong> {secondaryLocation ?? 'N/A'}
        </p>
        <p>
          <strong>Patient NHI:</strong> {patientId}
        </p>
        <p>
          <strong>Dependency Status:</strong> {dependencyStatus ?? 'N/A'}
        </p>
        <p>
          <strong>Weight:</strong> {weightDisplay}
        </p>
      </section>

      {/* Selected Equipment */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Selected Equipment</h2>
        {selectedEquipmentDetails.length === 0 ? (
          <p>No equipment selected yet.</p>
        ) : (
          <div className="space-y-3">
            {selectedEquipmentDetails.map((item) => {
              const site = sites.Wellington.includes(location) ? 'Wellington' : 'Hutt';
              const procurement = item.procurement?.[site] ?? 'N/A';

              return (
                <div key={item.name} className="p-3 border rounded-lg shadow-sm">
                  <p className="font-medium">
                    {item.category}: {item.name}
                  </p>

                  {/* Show Max Load if not Accessories */}
                  {item.category !== 'Accessories' && (
                    <p className="text-sm text-gray-500">Max Load: {item.maxLoad} kg</p>
                  )}

                  {/* Show width and seatWidth if present */}
                  {typeof item.width === 'number' && (
                    <p className="text-sm text-gray-500">Width: {item.width} cm</p>
                  )}
                  {typeof item.seatWidth === 'number' && (
                    <p className="text-sm text-gray-500">Seat Width: {item.seatWidth} cm</p>
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
}
