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

  // Bail out after hooks
  if (!location || !patientWeight) {
    return <p className="p-4">Missing patient info, location, or weight.</p>;
  }

  // ----------------
  // Category setup
  // ----------------
  let requiredCategories: string[] = [];
  let optionalCategories: string[] = [];

  const showAccessories =
    !!equipment.Hovermat || equipment.Slings === 'Hoversling';

  if (isED) {
    requiredCategories = ['Bed + Mattress', 'Hovermat'];
    optionalCategories = ['Commode Options'];
  } else if (isWard && dependencyStatus === 'independent') {
    requiredCategories = ['Bed + Mattress', 'Commode Options'];
    optionalCategories = ['Walking Aids', 'Wheelchairs', 'Bedside Chairs'];
  } else if (isWard && dependencyStatus === 'dependent') {
    requiredCategories = [
      'Bed + Mattress',
      'Commode Options',
      'Hoist',
      'Slings',
      'Hovermat',
    ];
    optionalCategories = ['Wheelchairs', 'Bedside Chairs'];
  }

  // Remove Hovermat if Hoversling is selected
  if (equipment.Slings === 'Hoversling') {
    requiredCategories = requiredCategories.filter(
      (c) => c !== 'Hovermat'
    );
  }

  if (showAccessories) {
    requiredCategories.push('Accessories');
  }

const allCategories = [...requiredCategories, ...optionalCategories];


  // ----------------
  // Auto-select pumps based on Hovermat / Hoversling logic
  // ----------------
  useEffect(() => {
    if (!exactWeight) return;

    let selectedPump: string | undefined;
    const updates = { ...equipment };

    if (equipment.Slings === 'Hoversling') {
      selectedPump = '2x Hovertech Pumps';

      // Clear Hovermat if previously selected
      if (updates.Hovermat) {
        updates.Hovermat = undefined;
      }
    } else if (equipment.Hovermat) {
      selectedPump =
        exactWeight >= 380
          ? '2x Air Supply for Hovermat'
          : 'Air Supply for Hovermat';
    }

    if (selectedPump && updates.Accessories !== selectedPump) {
      updates.Accessories = selectedPump;
    }

    // Only call setEquipment if something actually changed
    if (JSON.stringify(updates) !== JSON.stringify(equipment)) {
      setEquipment(updates);
    }
  }, [equipment.Slings, equipment.Hovermat, exactWeight, equipment, setEquipment]);


  // ----------------
  // Filter equipment
  // ----------------
  const getItemsByCategory = (category: string) =>
    equipmentList.filter((item) => {
      if (item.category !== category) return false;
      if (!location) return false;
      if (!item.location.includes(location)) return false;

      // Enforce min/max load only if defined
      if (typeof item.minLoad === 'number' && exactWeight! < item.minLoad) return false;
      if (typeof item.maxLoad === 'number' && item.maxLoad > 0 && exactWeight! > item.maxLoad)
        return false;

      if (category === 'Accessories') {
        // Only show the auto-selected pump
        if (
          [
            'Air Supply for Hovermat',
            '2x Air Supply for Hovermat',
            '2x Hovertech Pumps',
          ].includes(item.name)
        ) {
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
      {isED && (
        <p className="p-2 bg-yellow-100 text-yellow-800 rounded">
          If your patient is likely to be in ED for an extended period of time, contact
          M&amp;H specialist for advice on other equipment requirements.
        </p>
      )}

      {allCategories.map((category) => {
        const items = getItemsByCategory(category);
        if (!items.length) return null; // hide empty categories

        return (
          <div key={category} className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3">{category}</h2>

            {/* Extra info for Bed + Mattress */}
            {category === 'Bed + Mattress' && (
              <p className="p-2 bg-yellow-100 text-yellow-800 rounded">
                May need to consider alternative mattresses for pressure care or turning assist. Follow usual ordering processes for these alternative mattresses.
              </p>
            )}

            {/* Extra info for Walking Aids + Independent */}
            {category === 'Walking Aids' && dependencyStatus === 'independent' && (
              <p className="p-2 bg-yellow-100 text-yellow-800 rounded">
                Consider the patient&apos;s usual walking aid, refer to physio if mobility
                levels have changed.
              </p>
            )}

            {/* Extra info for Slings */}
            {category === 'Slings' && (
              <p className="p-2 bg-yellow-100 text-yellow-800 rounded">
                Other slings may be available with various SWL and width, check with CEP and refer to OT.
              </p>
            )}

            {/* If category is empty (no equipment in SWL) */}
            {isEmptyCategory(category) && (
              <p className="text-gray-500 mb-2">
                No available {category.toLowerCase()} under the patient’s weight limit.
                Please get in contact with moving and handling specialist.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item) => {
                const isSelected = equipment[category] === item.name;

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
                      <>
                        {typeof item.maxLoad === 'number' && item.maxLoad > 0 && (
                          <p className="text-sm text-gray-500">
                            Max load: {item.maxLoad}kg
                          </p>
                        )}

                      </>
                    )}

                    {typeof item.width === 'number' && (
                      <p className="text-sm text-gray-500">Width: {item.width} cm</p>
                    )}
                    {typeof item.seatWidth === 'number' && (
                      <p className="text-sm text-gray-500">Seat width: {item.seatWidth} cm</p>
                    )}

                    <p className="text-sm text-gray-500">
                      Procurement: {getProcurement(item)}
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
