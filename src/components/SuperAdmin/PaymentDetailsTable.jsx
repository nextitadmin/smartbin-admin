import React from "react";
import { useNavigate } from "react-router-dom";
import pspRevenueData from "../../mock/pspRevenueData";

const formatNaira = (value) => {
  const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(num)) return "—";
  return `₦${num.toLocaleString()}`;
};

/**
 * Preview table for SuperAdmin revenue page.
 * Navigates to the full PSP revenue page at `/payment-details`.
 */
const PaymentDetailsTable = ({ pspRevenue = [] }) => {
  const navigate = useNavigate();

  const fullRows = Array.isArray(pspRevenue) && pspRevenue.length ? pspRevenue : pspRevenueData;
  const previewRows = fullRows.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-zinc-800 text-lg">PSP revenue</h2>
        <button
          onClick={() => navigate("/payment-details", { state: { pspRevenue: fullRows } })}
          className="text-sm text-green-600 hover:text-green-800 cursor-pointer"
        >
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
                S/N
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
                PSP Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
                LCDA
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
                Household covered
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
                Revenue(₦)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
                Bills(₦)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {previewRows.map((row, index) => (
              <tr key={row.id ?? index} className="hover:bg-zinc-50 text-left">
                <td className="px-4 py-3 text-sm text-zinc-600">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-zinc-600">{row.psp_company}</td>
                <td className="px-4 py-3 text-sm text-zinc-600">{row.lcda}</td>
                <td className="px-4 py-3 text-sm text-zinc-600">
                  {Number(row.household_covered ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-700">{formatNaira(row.revenue)}</td>
                <td className="px-4 py-3 text-sm text-zinc-700">
                  {formatNaira(row.outStandingBill)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentDetailsTable;