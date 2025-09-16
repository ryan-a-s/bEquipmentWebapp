'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import { equipmentList, EquipmentItem } from '../../context/equipment';
import { isWardLocation, sites } from '../../context/locations';

type Props = {
  onNext?: () => void;
};

export default function EquipmentStep({ onNext }: Props) {
  const { location, dependencyStatus, patientWeight, equipment, setEquipment } =
    useAppContext();
  const router = useRouter();

  const exactWeight = patientWeight?.max ?? patientWeight?.min;
  const isWard = location ? isWardLocation(location) : false;
  const isED = !isWard;

  // ----------------
  // Auto-select default mattress if bed chosen
  // ----------------
  useEffect(() => {
    if (!equipment.Bed) return;

    const defaultMattress = equipmentList.find(
      (item) =>
        item.category === 'Mattress' &&
        item.defaultForBeds?.includes(equipment.Bed as string)
    );

    if (
      defaultMattress &&
      (!equipment.Mattress ||
        !equipmentList.find((m) => m.name === equipment.Mattress)
          ?.compatibleBeds?.includes(equipment.Bed as string))
    ) {
      setEquipment({
        ...equipment,
        Mattress: defaultMattress.name,
      });
    }
  }, [equipment.Bed, equipment.Mattress, setEquipment]);

  // ----------------
  // Auto-select pumps based on mat / hoversling logic
  // ----------------
  useEffect(() => {
    if (!exactWeight) return;

    let selectedPump: string | undefined;

    if (equipment.Slings === 'Hoversling') {
      selectedPump = '2x Hovertech Pumps';
    } else if (equipment.Mat) {
      selectedPump = exactWeight >= 300 ? '2x Pumps' : 'Pump';
    }

    if (selectedPump && equipment.Accessories !== selectedPump) {
      setEquipment({
        ...equipment,
        Accessories: selectedPump,
      });
    }
  }, [equipment.Mat, equipment.Slings, exactWeight, equipment.Accessories, setEquipment]);

  // Bail out after hooks
  if (!location || !patientWeight) {
    return <p className="p-4">Missing patient info, location, or weight.</p>;
  }

  const showAccessories = !!equipment.Mat || equipment.Slings === 'Hoversling';

  // ----------------
  // Category setup
  // ----------------
  let requiredCategories: string[] = [];
  let optionalCategories: string[] = [];

  if (isED) {
    requiredCategories = ['Bed', 'Mattress', 'Mat'];
    optionalCategories = ['Commode'];
  } else if (isWard && dependencyStatus === 'independent') {
    requiredCategories = ['Bed', 'Mattress', 'Commode'];
    optionalCategories = ['Walking Aids', 'Wheelchairs', 'Bedside Chairs'];
  } else if (isWard && dependencyStatus === 'dependent') {
    requiredCategories = ['Bed', 'Mattress', 'Commode', 'Hoist', 'Slings', 'Mat'];
    optionalCategories = ['Wheelchairs', 'Bedside Chairs'];
  }

  if (showAccessories) requiredCategories.push('Accessories');

  const allCategories = [...requiredCategories, ...optionalCategories];

  // ----------------
  // Filter equipment
  // ----------------
  const getItemsByCategory = (category: string) =>
    equipmentList.filter((item) => {
      if (item.category !== category) return false;
      if (!location) return false;
      if (!item.location.includes(location)) return false;

      if (item.maxLoad > 0 && exactWeight! > item.maxLoad) return false;

      if (category === 'Mattress' && equipment.Bed) {
        return item.compatibleBeds?.includes(equipment.Bed);
      }

      if (category === 'Accessories') {
        // Only show the auto-selected pump
        if (['Pump', '2x Pumps', '2x Hovertech Pumps'].includes(item.name)) {
          return item.name === equipment.Accessories;
        }
      }

      return true;
    });

  const isEmptyCategory = (category: string) =>
    getItemsByCategory(category).length === 0;

  const handleSelect = (category: string, name: string) => {
    setEquipment({
      ...equipment,
      [category]: equipment[category] === name ? undefined : name,
    });
  };

  const getProcurement = (item: EquipmentItem) => {
    const site = location && sites.Wellington.includes(location) ? 'Wellington' : 'Hutt';
    return item.procurement?.[site] ?? 'N/A';
  };

  const handleContinue = () => {
    onNext?.();
    router.push('/ordersummary');
  };

  return (
    <div className="p-4 space-y-6">
      <p className="p-2 bg-yellow-100 text-yellow-800 rounded">
        If your patient is likely to be in ED for an extended period of time, contact M&H specialist for advice on other equipment requirements.
      </p>

      {allCategories.map((category) => {
        const items = getItemsByCategory(category);
        if (!items.length) return null; // hide empty categories

        return (
          <div key={category} className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3">{category}</h2>

            {isEmptyCategory(category) && (
              <p className="text-gray-500 mb-2">
                No available {category.toLowerCase()} under the patient’s weight limit.
                Please get in contact with moving and handling specialist.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item) => {
                const isSelected = equipment[category] === item.name;
                const isDefaultForBed =
                  category === 'Mattress' &&
                  equipment.Bed &&
                  item.defaultForBeds?.includes(equipment.Bed as string);

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

                    {item.category !== 'Accessories' && (
                      <p className="text-sm text-gray-500">
                        Max load: {item.maxLoad > 0 ? `${item.maxLoad}kg` : 'N/A'}
                      </p>
                    )}

                    <p className="text-sm text-gray-500">
                      Procurement: {isDefaultForBed ? 'Included with bed' : getProcurement(item)}
                    </p>

                    {item.notes && (
                      <p className="text-xs text-gray-400 mt-1">{item.notes}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        onClick={handleContinue}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Continue
      </button>
    </div>
  );
}
