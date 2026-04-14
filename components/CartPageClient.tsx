"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRequestCart } from "@/components/RequestCartProvider";

type RequestSummary = {
  requester: {
    fullName: string;
    email: string;
    department: string;
    phoneNumber: string;
    approverName: string;
    budgetCostCentre: string;
    deliveryLocation: string;
    urgency: string;
    businessJustification: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    selectedUpgrades: string[];
  }>;
  estimatedTotal: number;
};

type SubmitState =
  | { status: "idle" }
  | { status: "success"; message: string; summary: RequestSummary }
  | { status: "error"; message: string };

export default function CartPageClient() {
  const { expandedItems, estimatedTotal, setQuantity, removeItem, toggleUpgrade, clearCart } = useRequestCart();
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "idle" });

    if (!expandedItems.length) {
      setSubmitState({ status: "error", message: "Your request list is empty." });
      return;
    }

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/submit-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requester: {
          fullName: String(formData.get("fullName") ?? ""),
          email: String(formData.get("email") ?? ""),
          department: String(formData.get("department") ?? ""),
          phoneNumber: String(formData.get("phoneNumber") ?? ""),
          approverName: String(formData.get("approverName") ?? ""),
          budgetCostCentre: String(formData.get("budgetCostCentre") ?? ""),
          deliveryLocation: String(formData.get("deliveryLocation") ?? ""),
          urgency: String(formData.get("urgency") ?? ""),
          businessJustification: String(formData.get("businessJustification") ?? ""),
          notes: String(formData.get("notes") ?? "")
        },
        items: expandedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedUpgrades: item.selectedUpgrades
        }))
      })
    });

    const data = (await response.json()) as { message?: string; summary?: RequestSummary };

    if (!response.ok || !data.summary) {
      setSubmitState({ status: "error", message: data.message ?? "Unable to submit your request right now. Please try again." });
      return;
    }

    setSubmitState({ status: "success", message: data.message ?? "Request submitted.", summary: data.summary });
    event.currentTarget.reset();
    clearCart();
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Request list</h2>
        <p className="mt-2 text-sm text-gray-700">Review selected products, choose options, and submit your request for institutional review.</p>
      </div>

      {submitState.status === "success" ? (
        <article className="space-y-4 rounded-xl border border-green-200 bg-green-50 p-6">
          <h3 className="text-xl font-semibold text-green-800">Request submitted</h3>
          <p className="text-sm text-green-900">{submitState.message}</p>

          <div className="rounded-lg bg-white p-4">
            <h4 className="text-sm font-semibold text-gray-900">Requester details</h4>
            <dl className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-700 md:grid-cols-2">
              <div><dt className="font-medium">Name</dt><dd>{submitState.summary.requester.fullName}</dd></div>
              <div><dt className="font-medium">York email</dt><dd>{submitState.summary.requester.email}</dd></div>
              <div><dt className="font-medium">Department/Faculty</dt><dd>{submitState.summary.requester.department}</dd></div>
              <div><dt className="font-medium">Phone number</dt><dd>{submitState.summary.requester.phoneNumber}</dd></div>
              <div><dt className="font-medium">Manager/Approver</dt><dd>{submitState.summary.requester.approverName}</dd></div>
              <div><dt className="font-medium">Budget/Cost centre</dt><dd>{submitState.summary.requester.budgetCostCentre}</dd></div>
              <div><dt className="font-medium">Delivery location</dt><dd>{submitState.summary.requester.deliveryLocation}</dd></div>
              <div><dt className="font-medium">Urgency</dt><dd>{submitState.summary.requester.urgency}</dd></div>
              <div className="md:col-span-2"><dt className="font-medium">Business justification</dt><dd>{submitState.summary.requester.businessJustification}</dd></div>
              {submitState.summary.requester.notes ? (
                <div className="md:col-span-2"><dt className="font-medium">Additional notes</dt><dd>{submitState.summary.requester.notes}</dd></div>
              ) : null}
            </dl>
          </div>

          <div className="rounded-lg bg-white p-4">
            <h4 className="text-sm font-semibold text-gray-900">Requested items</h4>
            <ul className="mt-2 space-y-3 text-sm text-gray-700">
              {submitState.summary.items.map((item) => (
                <li key={item.productId} className="rounded-md border p-3">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Unit price: ${item.unitPrice.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p>Line total: ${item.lineTotal.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p>Upgrades: {item.selectedUpgrades.length ? item.selectedUpgrades.join(", ") : "None"}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-semibold text-gray-900">Estimated total: ${submitState.summary.estimatedTotal.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <button type="button" onClick={() => setSubmitState({ status: "idle" })} className="rounded-md bg-yorkRed px-4 py-2 text-sm font-medium text-white">
            Start another request
          </button>
        </article>
      ) : (
        <>
          {!expandedItems.length ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="text-lg font-medium text-gray-900">Your request list is empty.</p>
              <p className="mt-2 text-sm text-gray-600">Browse approved products and use “Add to request list” to build your request list.</p>
              <Link href="/" className="mt-4 inline-flex rounded-md bg-yorkRed px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {expandedItems.map((item) => (
                <article key={item.productId} className="rounded-xl border bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">${item.product.price.toLocaleString("en-CA")} each</p>
                    </div>
                    <button type="button" onClick={() => removeItem(item.productId)} className="text-sm font-medium text-yorkRed underline-offset-2 hover:underline">
                      Remove item
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm font-medium">Quantity</span>
                    <button type="button" aria-label={`Decrease quantity for ${item.product.name}`} onClick={() => setQuantity(item.productId, item.quantity - 1)} className="h-8 w-8 rounded-md border border-gray-400 text-lg">-</button>
                    <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button type="button" aria-label={`Increase quantity for ${item.product.name}`} onClick={() => setQuantity(item.productId, item.quantity + 1)} className="h-8 w-8 rounded-md border border-gray-400 text-lg">+</button>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-900">Available product options/upgrades</p>
                    {item.product.optionalUpgrades.length ? (
                      <div className="mt-2 grid gap-2">
                        {item.product.optionalUpgrades.map((upgrade) => {
                          const inputId = `${item.productId}-${upgrade}`;
                          const isChecked = item.selectedUpgrades.includes(upgrade);
                          return (
                            <label key={upgrade} htmlFor={inputId} className="flex items-center gap-2 text-sm text-gray-700">
                              <input
                                id={inputId}
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleUpgrade(item.productId, upgrade)}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              {upgrade}
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-600">No optional upgrades are listed for this product.</p>
                    )}
                  </div>
                </article>
              ))}

              <div className="rounded-xl border bg-white p-4">
                <p className="text-lg font-semibold">Estimated total: ${estimatedTotal.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="mt-1 text-xs text-gray-500">Estimated total includes base product pricing and excludes upgrade-specific pricing adjustments.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border bg-white p-6 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Requester name</span>
              <input className="w-full rounded-md border px-3 py-2" name="fullName" required />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">York email</span>
              <input type="email" className="w-full rounded-md border px-3 py-2" name="email" required />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Department or faculty</span>
              <input className="w-full rounded-md border px-3 py-2" name="department" required />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Phone number</span>
              <input type="tel" className="w-full rounded-md border px-3 py-2" name="phoneNumber" required />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Manager or approver name</span>
              <input className="w-full rounded-md border px-3 py-2" name="approverName" required />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Budget or cost centre</span>
              <input className="w-full rounded-md border px-3 py-2" name="budgetCostCentre" required />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="mb-1 block font-medium">Delivery location</span>
              <input className="w-full rounded-md border px-3 py-2" name="deliveryLocation" required />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="mb-1 block font-medium">Urgency</span>
              <select className="w-full rounded-md border px-3 py-2" name="urgency" required defaultValue="">
                <option value="" disabled>Select urgency</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </label>
            <label className="text-sm md:col-span-2">
              <span className="mb-1 block font-medium">Business justification</span>
              <textarea className="w-full rounded-md border px-3 py-2" name="businessJustification" rows={4} required />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="mb-1 block font-medium">Additional notes</span>
              <textarea className="w-full rounded-md border px-3 py-2" name="notes" rows={3} />
            </label>
            <div className="md:col-span-2 flex items-center gap-4">
              <button type="submit" className="rounded-md bg-yorkRed px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                Submit equipment request
              </button>
              {submitState.status === "error" && <p role="alert" className="text-sm font-medium text-red-800">{submitState.message}</p>}
            </div>
          </form>
        </>
      )}
    </section>
  );
}
