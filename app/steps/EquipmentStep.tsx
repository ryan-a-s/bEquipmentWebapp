'use client';
import { useAppContext } from '../../context/AppContext';
import { equipmentList } from '../../context/equipment';

export default function EquipmentStep() {
  const { location, dependencyStatus, patientWeight, equipment, setEquipment } = useAppContext();

  if (!location || !patientWeight) return <p className="p-4">Missing patient/location info.</p>;

  const exactWeight = patientWeight.max ?? patientWeight.min;

  // Determine categories
  let requiredCategories: string[] = [];
  let optionalCategories: string[] = [];

  if (location.includes('Emergency')) {
    requiredCategories = ['Bed', 'Mattress', 'Mat', 'Accessories'];
  } else if (location.includes('Ward') && dependencyStatus === 'independent') {
    requiredCategories = ['Bed', 'Mattress', 'Commode', 'Walking Aids'];
    optionalCategories = ['Wheelchairs', 'Bedside Chairs'];
  } else if (location.includes('Ward') && dependencyStatus === 'dependent') {
    requiredCategories = ['Bed', 'Mattress', 'Commode', 'Hoist', 'Slings'];
    optionalCategories = ['Wheelchairs', 'Bedside Chairs'];
  }

  // Filter by location and max load
  const availableEquipment = equipmentList.filter(
    (item) =>
      [...requiredCategories, ...optionalCategories].includes(item.category) &&
      item.location.includes(location) &&
      exactWeight <= item.maxLoad
  );

  const handleBedSelect = (bedName: string) => {
    const defaultMattress = equipmentList.find(
      (item) =>
        item.category === 'Mattress' &&
        item.compatibleBeds?.includes(bedName) &&
        item.defaultForBeds?.includes(bedName)
    );

    if (defaultMattress) {
      setEquipment({ Bed: bedName, Mattress: defaultMattress.name });
    } else {
      setEquipment({ Bed: bedName });
    }
  };

  const handleSelect = (category: string, name: string) => {
    // deselect if clicked again
    setEquipment(equipment[category] === name ? { [category]: '' } : { [category]: name });
  };

  const getItemsByCategory = (category: string) => {
    if (category === 'Mattress' && equipment.Bed) {
      return availableEquipment.filter(
        (item) => item.category === 'Mattress' && item.compatibleBeds?.includes(equipment.Bed)
      );
    }
    return availableEquipment.filter((item) => item.category === category);
  };

  const allRequiredSelected = requiredCategories.every((cat) => equipment[cat]);

  return (
    <div className="space-y-6">
      {[...requiredCategories, ...optionalCategories].map((category) => (
        <div key={category}>
          <h2 className="text-lg font-semibold mb-2">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getItemsByCategory(category).map((item) => {
              const isSelected = equipment[category] === item.name;
              const isDefaultForSelectedBed =
                category === 'Mattress' && equipment.Bed && item.defaultForBeds?.includes(equipment.Bed);
              const displayedProcurement =
                isDefaultForSelectedBed && equipment.Bed ? 'Included with bed' : item.procurement;

              return (
                <button
                  key={item.name}
                  onClick={() =>
                    category === 'Bed' ? handleBedSelect(item.name) : handleSelect(category, item.name)
                  }
                  className={`p-3 border rounded-lg text-left ${
                    isSelected ? 'bg-blue-200 border-blue-600' : 'bg-white hover:bg-gray-50'
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
        className={`mt-6 px-6 py-2 rounded bg-green-600 text-white ${
          !allRequiredSelected ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Continue
      </button>
    </div>
  );
}