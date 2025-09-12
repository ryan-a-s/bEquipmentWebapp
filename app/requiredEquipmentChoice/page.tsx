'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import { equipmentList } from '../../context/equipment';

export default function RequiredEquipmentChoicePage() {
  const router = useRouter();
  const { location, secondaryLocation, dependencyStatus, patientWeight, equipment, setEquipment } =
    useAppContext();

  if (!location || !patientWeight) return <p className="p-4">Missing patient/location info.</p>;

  const exactWeight = patientWeight.max ?? patientWeight.min;

  // Determine categories to show
  let requiredCategories: string[] = [];
  let optionalCategories: string[] = [];

  if (location.includes('Emergency')) {
    requiredCategories = ['Bed', 'Mattress','Mat', 'Accessories'];
    optionalCategories = ['Commode'];

  } else if (location.includes('Wards') && dependencyStatus === 'independent') {
    requiredCategories = ['Bed', 'Mattress', 'Commode'];
    optionalCategories = ['Walking Aids','Wheelchairs', 'Bedside Chairs'];
  } else if (location.includes('Wards') && dependencyStatus === 'dependent') {
    requiredCategories = ['Bed', 'Mattress', 'Commode', 'Hoist', 'Slings', 'Mat'];
    optionalCategories = ['Wheelchairs', 'Bedside Chairs'];
  }

  // Filter equipment by location and max load
  const availableEquipment = equipmentList.filter(
    (item) =>
      [...requiredCategories, ...optionalCategories].includes(item.category) &&
      item.location.includes(location) &&
      exactWeight <= item.maxLoad
  );

  // Handle bed selection/deselection
  const handleBedSelect = (bedName: string) => {
    setEquipment(prev => {
      if (prev.Bed === bedName) {
        // Deselect bed & default mattress
        const updated = { ...prev };
        delete updated.Bed;
        if (prev.Mattress) delete updated.Mattress;
        return updated;
      }

      // Select bed & auto-select default mattress
      const defaultMattress = equipmentList.find(
        (item) =>
          item.category === 'Mattress' &&
          item.compatibleBeds?.includes(bedName) &&
          item.defaultForBeds?.includes(bedName)
      );

      return defaultMattress
        ? { ...prev, Bed: bedName, Mattress: defaultMattress.name }
        : { ...prev, Bed: bedName };
    });
  };

  // Handle other category selection/deselection
  const handleSelect = (category: string, name: string) => {
    setEquipment(prev => {
      if (prev[category] === name) {
        const updated = { ...prev };
        delete updated[category];
        return updated;
      }
      return { ...prev, [category]: name };
    });
  };

  const getItemsByCategory = (category: string) => {
    if (category === 'Mattress' && equipment.Bed) {
      return availableEquipment.filter(
        (item) =>
          item.category === 'Mattress' &&
          item.compatibleBeds?.includes(equipment.Bed)
      );
    }
    return availableEquipment.filter((item) => item.category === category);
  };

  const allRequiredSelected = requiredCategories.every((cat) => equipment[cat]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Required Equipment</h1>
      <p className="mb-4 text-gray-600">
        Location: {location}{secondaryLocation ? `: ${secondaryLocation}` : ''} | Dependency: {dependencyStatus ?? 'N/A'} | Weight: {exactWeight}kg
      </p>

      {[...requiredCategories, ...optionalCategories].map((category) => (
        <div key={category} className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            {category} {optionalCategories.includes(category) && <span className="text-gray-500 text-sm">(optional)</span>}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getItemsByCategory(category).map((item) => {
              const isSelected = equipment[category] === item.name;
              const isDefaultForSelectedBed =
                category === 'Mattress' &&
                equipment.Bed &&
                item.defaultForBeds?.includes(equipment.Bed);

              const displayedProcurement =
                isDefaultForSelectedBed && equipment.Bed
                  ? 'Included with bed'
                  : item.procurement;

              return (
                <button
                  key={item.name}
                  onClick={() =>
                    category === 'Bed'
                      ? handleBedSelect(item.name)
                      : handleSelect(category, item.name)
                  }
                  className={`p-4 border rounded-lg text-left shadow-sm transition ${
                    isSelected
                      ? 'bg-blue-200 text-black border-blue-600'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Max load: {item.maxLoad}kg</p>
                  <p className="text-sm text-gray-500">Procurement: {displayedProcurement}</p>
                  {item.notes && <p className="text-xs text-gray-400 mt-1">{item.notes}</p>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        disabled={!allRequiredSelected}
        onClick={() => router.push('/nextPage')}
        className={`mt-8 px-6 py-3 rounded-lg shadow-md ${
          allRequiredSelected
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}