'use client';

import { useAppContext } from '../../context/AppContext';
import { getLocationLabel, isWardLocation, sites } from '../../context/locations';
import { equipmentList, EquipmentItem } from '../../context/equipment';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const { location, secondaryLocation, dependencyStatus, patientWeight, patientId, equipment } =
    useAppContext();

  const router = useRouter();

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

  const handleBack = () => { //back for make changes
    router.back();
  };

  return (
    <div className="flex-col items-center max-w-2xl mx-auto px-8 py-8 space-y-4 ">
      <div className="p-4 bg-surfaceLowest border-2 rounded-2xl border-outlineV">
        <h1 className="text-xl font-bold text-primary pb-2">Review Order</h1>
        <h2 className="text-lg font-medium">Order Details</h2>

        {/* Order info */}
        <section className="sm:flex justify-between p-2 rounded-lg text-left bg-surface">
          <div className="basis-1/2">
             <p className="font-medium">Primary Location:</p>
             <p className="text-base font-normal -mt-1">{getLocationLabel(location)} – {location}</p>

             <p className="font-medium">Secondary Location:</p>
             <p className="font-normal -mt-1">{secondaryLocation ?? 'N/A'}</p>
          </div>

          <div className="basis-1/2">
            <div className="flex items-baseline gap-1">
              <p className="font-medium">Patient NHI:</p>
              <p className="font-normal ">{patientId}</p>
            </div>

            <div className="flex items-baseline gap-1">
              <p className="font-medium">Dependency Status:</p>
              <p className="font-normal">{dependencyStatus ?? 'N/A'}</p>
            </div>

            <div className="flex items-baseline gap-1">
              <p className="font-medium">Weight:</p>
              <p className="font-normal align-middle">{weightDisplay}</p>
            </div>
          </div>
        </section>

        {/* Selected Equipment */}
        <section className="pb-8 pt-2">
          <h2 className="text-lg font-medium">Selected Equipment</h2>
          {selectedEquipmentDetails.length === 0 ? (
            <p>No equipment selected yet.</p>
          ) : (
            <div className="space-y-2">
              {selectedEquipmentDetails.map((item) => {
                const site = sites.Wellington.includes(location) ? 'Wellington' : 'Hutt';
                const procurement = item.procurement?.[site] ?? 'N/A';

                return (
                  <div key={item.name} className="p-2 flex flex-col items-start rounded-lg text-left bg-surface">
                    <p className="font-medium text-on-surface">
                      {item.category}:
                    </p>
                    <p className="font-medium text-on-surface">
                      {item.name}
                    </p>

                    {/* Show Max Load if not Accessories */}
                    {item.category !== 'Accessories' && (
                      <p className="text-sm text-on-surface">Max Load: {item.maxLoad} kg</p>
                    )}

                    {/* Show width and seatWidth if present */}
                    {typeof item.width === 'number' && (
                      <p className="text-sm text-on-surface">Width: {item.width} cm</p>
                    )}
                    {typeof item.seatWidth === 'number' && (
                      <p className="text-sm text-on-surface">Seat Width: {item.seatWidth} cm</p>
                    )}

                    <p className="text-sm text-on-surface">Procurement: {procurement}</p>
                    {item.notes && <p className="text-xs text-on-surfaceV mt-1">{item.notes}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </section>
        <div className="flex justify-around gap-4">
          <button
          className=" w-1/2 sm:w-1/3  p-4 rounded-lg transition bg-primary text-on-primary font-bold hover:bg-primaryC shadow-sm"
          onClick={handleBack}
          >
            Make Changes
          </button>
        
          <button
            className="w-1/2 sm:w-1/3  p-4 rounded-lg transition bg-accept-green text-on-primary font-bold hover:bg-accept-greenH shadow-sm"
            onClick={() => alert('Order confirmed!')}
          >
            Confirm Order
          </button>

        </div>
        
      </div>
    </div>
  );
}
