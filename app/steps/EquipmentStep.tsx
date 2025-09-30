'use client';

import Image from "next/image";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import { equipmentList, EquipmentItem } from '../../context/equipment';
import { isWardLocation, sites } from '../../context/locations';

const BASE_PATH = '/bEquipmentWebapp'; // Only used for images, for github pages

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
  // Category setup
  // ----------------
  let requiredCategories: string[] = [];
  let optionalCategories: string[] = [];

  const showAccessories =
    !!equipment.Hovermat || equipment.Slings === 'Hoversling';

  if (isED) {
    requiredCategories = ['Bed + Mattress', 'Hovermat'];
    optionalCategories = ['Commode Options'];
  } else if (isWard && dependencyStatus === 'Independent') {
    requiredCategories = ['Bed + Mattress', 'Commode Options'];
    optionalCategories = ['Walking Aids', 'Wheelchairs', 'Bedside Chairs'];
  } else if (isWard && dependencyStatus === 'Dependent') {
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
        exactWeight >= 350
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

  // Bail out after hooks
  if (!location || !patientWeight) {
    return <p className="p-4">Missing patient info, location, or weight.</p>;
  }

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

  
  // Continue button enabled logic
  const canContinue = requiredCategories.every(
    (cat) => equipment[cat] !== undefined
  );

  const handleContinue = () => {
    onNext?.();
    router.push('/ordersummary');
  };


  return (
    <div className="flex flex-col space-y-4">
      {isED && (
        <div className='p-2 flex justify-content-center gap-2 bg-alert-yellow rounded-lg'>
          <Image className="" src={`${BASE_PATH}/warning.svg`} alt="Warning Icon" width={24} height={24}/>
          <p className="text-on-alert tracking-tight">
            If your patient is likely to be in ED for an extended period of time, contact
            M&amp;H specialist for advice on other equipment requirements.
          </p>
        </div>
      )}

      {allCategories.map((category) => {
        const items = getItemsByCategory(category);
       

        return (
          <div key={category} className="bg-surface rounded-lg p-2 space-y-2">
            <h2 className="flex items-center gap-1 text-lg font-medium">
              {category}
              {optionalCategories.includes(category) && (
                <span className="text-sm font-normal text-on-surfaceV"> (Optional)</span>
              )}
            </h2>

            {/* Extra info for Bed + Mattress */}
            {category === 'Bed + Mattress' && (
              <div className='p-2 flex justify-content-center gap-2 bg-alert-yellow rounded-lg'>
                <Image className="" src={`${BASE_PATH}/warning.svg`} alt="Warning Icon" width={24} height={24}/>
                <p className="text-on-alert tracking-tight">
                  May need to consider alternative mattresses for pressure care or turning assist. 
                  Follow usual ordering processes for these alternative mattresses.
                </p>
              </div>
            )}

            {/* Extra info for Walking Aids + Independent */}
            {category === 'Walking Aids' && dependencyStatus === 'Independent' && (
              <div className='p-2 flex justify-content-center gap-2 bg-alert-yellow rounded-lg'>
                <Image className="" src={`${BASE_PATH}/warning.svg`} alt="Warning Icon" width={24} height={24}/>
                <p className="text-on-alert tracking-tight">
                  Consider the patient&apos;s usual walking aid, refer to physio if mobility
                  levels have changed.
                </p>
              </div>
            )}

            {/* Extra info for Slings */}
            {category === 'Slings' && (
              <div className='p-2 flex justify-content-center gap-2 bg-alert-yellow rounded-lg'>
                <Image className="" src={`${BASE_PATH}/warning.svg`} alt="Warning Icon" width={24} height={24}/>
                <p className="text-on-alert tracking-tight">
                  Other slings may be available with various SWL and width, check with CEP and refer to OT.
                </p>
              </div>
            )}

            {/* If category is empty (no equipment in SWL) */}
            {isEmptyCategory(category) && (
              <div className='p-2 flex justify-content-center gap-2 bg-error rounded-lg'>
                <Image className="" src={`${BASE_PATH}/error.svg`} alt="Error Icon" width={24} height={24}/>
                <p className="text-on-primary tracking-tight">
                  No available {category.toLowerCase()} under the patient’s weight limit.
                  Please get in contact with moving and handling specialist.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 md:items-stretch gap-y-4 gap-x-2">
              {items.map((item) => {
                const isSelected = equipment[category] === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => handleSelect(category, item.name)}
                    className={`p-2 flex flex-col items-start rounded-lg text-left shadow-sm transition ${
                      isSelected
                        ? "bg-primaryC text-on-primary font-bold"
                        : "bg-surfaceHigh hover:bg-surfaceHighest"
                    }`}
                  >
                    <p
                      className={`text-base ${
                        isSelected ? "text-on-primary" : "font-medium text-on-surface"
                      }`}
                    >
                      {item.name}
                    </p>

                    {item.category !== "Accessories" && typeof item.maxLoad === "number" && item.maxLoad > 0 && (
                      <p
                        className={`text-sm ${
                          isSelected ? "text-on-primary font-medium" : "text-on-surface"
                        }`}
                      >
                        Max load: {item.maxLoad}kg
                      </p>
                    )}

                    {typeof item.width === "number" && (
                      <p
                        className={`text-sm ${
                          isSelected ? "text-on-primary font-medium" : "text-on-surface"
                        }`}
                      >
                        Width: {item.width} cm
                      </p>
                    )}

                    {typeof item.seatWidth === "number" && (
                      <p
                        className={`text-sm ${
                          isSelected ? "text-on-primary font-medium" : "text-on-surface"
                        }`}
                      >
                        Seat width: {item.seatWidth} cm
                      </p>
                    )}

                    <p
                      className={`text-sm ${
                        isSelected ? "text-on-primary font-medium" : "text-on-surface"
                      }`}
                    >
                      Procurement: {getProcurement(item)}
                    </p>

                    {item.notes && (
                      <p
                        className={`text-xs mt-1 ${
                          isSelected ? "text-on-primary/90 font-medium" : "text-on-surfaceV"
                        }`}
                      >
                        {item.notes}
                      </p>
                    )}
                  </button>

                );
              })}
            </div>
          </div>
        );
      })}

      <button
        disabled={!canContinue}
        onClick={handleContinue}
        className={`self-center w-1/2 sm:w-1/3  p-4 mt-4 rounded-lg transition ${
          canContinue
            ? "bg-accept-green text-on-primary font-bold hover:bg-accept-greenH shadow-sm"
            : "bg-surfaceV text-outline cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
