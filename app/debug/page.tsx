'use client';

import { useState } from 'react';
import { equipmentList, EquipmentItem } from '../../context/equipment';
import { LocationCode, getLocationLabel, sites } from '../../context/locations';

export default function DebugEquipmentPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationCode | null>(null);
  const [patientWeight, setPatientWeight] = useState<number>(0);

  const allLocations: LocationCode[] = [...sites.Hutt, ...sites.Wellington];

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesLocation = selectedLocation
      ? item.location.includes(selectedLocation)
      : true;

    const matchesWeight =
      patientWeight > 0
        ? (typeof item.minLoad === 'number' ? patientWeight >= item.minLoad : true) &&
          (typeof item.maxLoad === 'number' ? patientWeight <= item.maxLoad : true)
        : true;

    return matchesLocation && matchesWeight;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Equipment</h1>

      {/* Location selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Location:</label>
        <select
          value={selectedLocation ?? ''}
          onChange={(e) =>
            setSelectedLocation((e.target.value as LocationCode) || null)
          }
          className="border rounded p-2"
        >
          <option value="">All</option>
          {allLocations.map((loc) => (
            <option key={loc} value={loc}>
              {getLocationLabel(loc)}
            </option>
          ))}
        </select>
      </div>

      {/* Weight input */}
      <div className="mb-6">
        <label className="mr-2 font-medium">Patient Weight (kg):</label>
        <input
          type="number"
          value={patientWeight || ''}
          onChange={(e) => setPatientWeight(parseInt(e.target.value, 10) || 0)}
          className="border rounded p-2 w-24"
        />
      </div>

      {/* Equipment list */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Equipment List</h2>
        {filteredEquipment.length === 0 ? (
          <p className="text-gray-500">
            No equipment available for this location and weight.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Min Load</th>
                  <th className="border px-4 py-2">Max Load</th>
                  <th className="border px-4 py-2">Width (cm)</th>
                  <th className="border px-4 py-2">Seat Width (cm)</th>
                  <th className="border px-4 py-2">Locations</th>
                  <th className="border px-4 py-2">Procurement</th>
                  <th className="border px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((item) => (
                  <tr key={item.name} className="border-b">
                    <td className="border px-4 py-2">{item.category}</td>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.minLoad ?? '-'}</td>
                    <td className="border px-4 py-2">{item.maxLoad ?? '-'}</td>
                    <td className="border px-4 py-2">{item.width ?? '-'}</td>
                    <td className="border px-4 py-2">{item.seatWidth ?? '-'}</td>
                    <td className="border px-4 py-2">
                      {item.location.map(getLocationLabel).join(', ')}
                    </td>
                    <td className="border px-4 py-2">
                      {JSON.stringify(item.procurement)}
                    </td>
                    <td className="border px-4 py-2">{item.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
