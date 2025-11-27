// client/src/components/HostelCard.jsx
import React from "react";

export default function HostelCard({ listing, onContact, onSave }) {
  const img = listing.images?.[0] || "/placeholder.jpg";

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      <img src={img} alt={listing.name} className="w-full h-44 object-cover" />
      <div className="p-3">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold">{listing.name}</h3>
            <div className="text-sm text-gray-600">
              {listing.city} • {listing.pincode || "-"}
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold">₹{listing.price}</div>
            <div className="text-xs text-gray-500">/ month</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex gap-2">
            {listing.ac && (
              <span className="px-2 py-1 bg-gray-100 rounded">AC</span>
            )}
            <span className="px-2 py-1 bg-gray-100 rounded">
              {listing.sharing}-sharing
            </span>
            {listing.wifi && (
              <span className="px-2 py-1 bg-gray-100 rounded">Wi-Fi</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSave?.(listing)}
              className="text-sm px-3 py-1 border rounded"
            >
              Save
            </button>
            <button
              onClick={() => onContact?.(listing)}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
