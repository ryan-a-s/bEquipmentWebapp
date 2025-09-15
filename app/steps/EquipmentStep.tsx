'use client';

import { useAppContext } from '../../context/AppContext';
import { equipmentList, EquipmentItem } from '../../context/equipment';
import { isWardLocation, sites, LocationCode } from '../../context/locations';

type Props = {
  onNext: () => void;
};

export default function EquipmentStep({ onNext }: Props) {
  const { location, dependencyStatus, patientWeight, equipment, setEquipment } = useAppContext();

  if (!location || !patientWeight) return <p className="p-4">Missing patient info or location.</p>;

  const exactWeight = patientWeight.max ?? patientWeight.min;

  // Determine category lists based on location and dependency
  let requiredCategories: string[] = [];
  let optionalCategories: string[] = [];

  const isWard = isWardLocation(location);
  const isED = !isWard;

  if (isED) {
    requiredCategories = ['Bed', 'Mattress', 'Mat', 'Accessories'];
    optionalCategories = ['Commode'];
  } else if (isWard && dependencyStatus === 'independent') {
    requiredCategories = ['Bed', 'Mattress', 'Commode'];
    optionalCategories = ['Walking Aids', 'Wheelchairs', 'Bedside Chairs'];
  } else if (isWard && dependencyStatus === 'dependent') {
    requiredCategories = ['Bed', 'Mattress', 'Commode', 'Hoist', 'Slings', 'Mat'];
    optionalCategories = ['Wheelchairs', 'Bedside Chairs'];
  }

  const allCategories = [...requiredCategories, ...optionalCategories];

  // Filter equipment by category, location, and max load
  const getItemsByCategory = (category: string) =>
    equipmentList.filter(
      (item) =>
        item.category === category &&
        item.location.includes(location) &&
        exactWeight <= item.maxLoad
    );

  // Check if a category has any items available
  const isEmptyCategory = (category: string) => getItemsByCategory(category).length === 0;

  // Handle selecting / deselecting items
  const handleSelect = (category: string, name: string) => {
    setEquipment({
      ...equipment,
      [category]: equipment[category] === name ? undefined : name,
    });
  };

  // Get procurement text based on site
  const getProcurement = (item: EquipmentItem) => {
    const site = sites.Wellington.includes(location) ? 'Wellington' : 'Hutt';
    return item.procurement[site] ?? 'N/A';
  };

  return (
    <div className="p-4 space-y-6">
      {allCategories.map((category) => {
        const items = getItemsByCategory(category);

        return (
          <div key={category} className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3">{category}</h2>

            {isEmptyCategory(category) && (
              <p className="text-gray-500 mb-2">
                No available {category.toLowerCase()} under the patient’s weight limit.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item) => {
                const isSelected = equipment[category] === item.name;
                const isDefaultForBed =
                  category === 'Mattress' &&
                  equipment.Bed &&
                  item.defaultForBeds?.includes(equipment.Bed);

                return (
                  <button
                    key={item.name}
                    onClick={() => handleSelect(category, item.name)}
                    className={`p-4 border rounded-lg text-left shadow-sm transition ${
                      isSelected
                        ? 'bg-blue-200 text-black border-blue-600'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Max load: {item.maxLoad}kg</p>
                    <p className="text-sm text-gray-500">
                      Procurement:{' '}
                      {isDefaultForBed ? 'Included with bed' : getProcurement(item)}
                    </p>
                    {item.notes && <p className="text-xs text-gray-400 mt-1">{item.notes}</p>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        onClick={onNext}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Continue
      </button>
    </div>
  );
}
