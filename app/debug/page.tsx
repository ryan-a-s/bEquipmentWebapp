'use client';

import { useState } from 'react';
import { equipmentList, EquipmentItem } from '../../context/equipment';
import { LocationCode, getLocationLabel, sites } from '../../context/locations';

export default function DebugEquipmentPage() {
  const [equipment, setEquipment] = useState<Record<string, string>>({});
  const [selectedBed, setSelectedBed] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationCode | null>(null);
  const [patientWeight, setPatientWeight] = useState<number>(0);

  const allLocations: LocationCode[] = [...sites.Hutt, ...sites.Wellington];

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesLocation = selectedLocation
      ? item.location.includes(selectedLocation)
      : true;

    const matchesWeight = patientWeight > 0 ? patientWeight <= item.maxLoad : true;

    return matchesLocation && matchesWeight;
  });

  const handleSelect = (item: EquipmentItem) => {
    if (item.category === 'Bed') {
      setSelectedBed(item.name);
      const defaultMattress = equipmentList.find(
        (m) =>
          m.category === 'Mattress' &&
          m.compatibleBeds?.includes(item.name) &&
          m.defaultForBeds?.includes(item.name)
      );

      const newEquipment: Record<string, string> = { Bed: item.name };
      if (defaultMattress) newEquipment.Mattress = defaultMattress.name;
      setEquipment(newEquipment);
    } else {
      setEquipment({ ...equipment, [item.category]: item.name });
    }
  };

  const getDisplayedProcurement = (item: EquipmentItem) => {
    if (item.category === 'Mattress' && selectedBed && item.defaultForBeds?.includes(selectedBed)) {
      return 'Included with bed';
    }

    if (!selectedLocation) return '-';
    const site = sites.Wellington.includes(selectedLocation) ? 'Wellington' : 'Hutt';
    return item.procurement[site] ?? '-';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Equipment</h1>

      {/* Location selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Location:</label>
        <select
          value={selectedLocation ?? ''}
          onChange={(e) => setSelectedLocation(e.target.value as LocationCode || null)}
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

      {/* Current selections */}
      <div className="mb-8 p-4 bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Current Selections</h2>
        {Object.keys(equipment).length === 0 ? (
          <p className="text-gray-500">No equipment selected yet.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-1">
            {Object.entries(equipment).map(([category, item]) => (
              <li key={category}>
                <span className="font-medium">{category}:</span> {item}
              </li>
            ))}
          </ul>
        )}
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
                  <th className="border px-4 py-2">Max Load</th>
                  <th className="border px-4 py-2">Locations</th>
                  <th className="border px-4 py-2">Procurement</th>
                  <th className="border px-4 py-2">Compatible Beds</th>
                  <th className="border px-4 py-2">Default For Beds</th>
                  <th className="border px-4 py-2">Notes</th>
                  <th className="border px-4 py-2">Displayed Procurement</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((item) => {
                  const isSelected = equipment[item.category] === item.name;
                  const displayedProcurement = getDisplayedProcurement(item);

                  return (
                    <tr
                      key={item.name}
                      onClick={() => handleSelect(item)}
                      className={`cursor-pointer hover:bg-gray-100 ${
                        isSelected ? 'bg-green-100 font-semibold' : ''
                      }`}
                    >
                      <td className="border px-4 py-2">{item.category}</td>
                      <td className="border px-4 py-2">{item.name}</td>
                      <td className="border px-4 py-2">{item.maxLoad}</td>
                      <td className="border px-4 py-2">
                        {item.location.map(getLocationLabel).join(', ')}
                      </td>
                      <td className="border px-4 py-2">{JSON.stringify(item.procurement)}</td>
                      <td className="border px-4 py-2">{item.compatibleBeds?.join(', ') || '-'}</td>
                      <td className="border px-4 py-2">{item.defaultForBeds?.join(', ') || '-'}</td>
                      <td className="border px-4 py-2">{item.notes || '-'}</td>
                      <td className="border px-4 py-2">{displayedProcurement}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
