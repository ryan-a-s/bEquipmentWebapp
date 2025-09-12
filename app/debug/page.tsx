'use client';

import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { equipmentList, EquipmentItem } from '../../context/equipment';

export default function DebugEquipmentPage() {
  const { equipment, setEquipment } = useAppContext();
  const selectedBed = equipment.Bed ?? null;

  const allLocations = [
    'Hutt Wards',
    'Wellington Wards',
    'Hutt Emergency Department',
    'Wellington Emergency Department',
  ];

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const filteredEquipment = selectedLocation
    ? equipmentList.filter((item) => item.location.includes(selectedLocation))
    : equipmentList;

  const handleSelect = (item: EquipmentItem) => {
    if (item.category === 'Bed') {
      const defaultMattress = equipmentList.find(
        (m) =>
          m.category === 'Mattress' &&
          m.compatibleBeds?.includes(item.name) &&
          m.defaultForBeds?.includes(item.name)
      );

      const newEquipment: Record<string, string> = { Bed: item.name };
      if (defaultMattress) {
        newEquipment.Mattress = defaultMattress.name;
      }

      setEquipment(newEquipment);
    } else {
      setEquipment({ [item.category]: item.name });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Equipment</h1>

      {/* Location filter */}
      <div className="mb-6">
        <label className="mr-2 font-medium">Filter by Location:</label>
        <select
          value={selectedLocation ?? ''}
          onChange={(e) => setSelectedLocation(e.target.value || null)}
          className="border rounded p-2"
        >
          <option value="">All</option>
          {allLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
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
          <p className="text-gray-500">No equipment available for this location.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Max Load</th>
                  <th className="border px-4 py-2">Location</th>
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

                  let displayedProcurement = item.procurement;
                  const isDefaultForSelectedBed =
                    item.category === 'Mattress' &&
                    selectedBed &&
                    item.defaultForBeds?.includes(selectedBed);

                  if (isDefaultForSelectedBed) displayedProcurement = 'Included with bed';

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
                      <td className="border px-4 py-2">{item.location.join(', ')}</td>
                      <td className="border px-4 py-2">{item.procurement}</td>
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
