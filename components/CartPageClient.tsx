"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRequestCart } from "@/components/RequestCartProvider";

type SubmitState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export default function CartPageClient() {
  const { expandedItems, estimatedTotal, setQuantity, removeItem, toggleUpgrade, clearCart } = useRequestCart();
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "idle" });

    if (!expandedItems.length) {
      setSubmitState({ status: "error", message: "Your request cart is empty." });
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
          notes: String(formData.get("notes") ?? "")
        },
        items: expandedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedUpgrades: item.selectedUpgrades
        }))
      })
    });

    if (!response.ok) {
      setSubmitState({ status: "error", message: "Unable to submit your purchase request right now." });
      return;
    }

    setSubmitState({ status: "success", message: "Submit purchase request received. Procurement follow-up is not enabled yet." });
    event.currentTarget.reset();
    clearCart();
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Request cart</h2>
        <p className="mt-2 text-sm text-gray-700">Review selected products, choose options, and submit your request for institutional review.</p>
      </div>

      {!expandedItems.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-lg font-medium text-gray-900">Your request cart is empty.</p>
          <p className="mt-2 text-sm text-gray-600">Browse approved products and use “Add to request” to build your cart.</p>
          <Link href="/" className="mt-4 inline-flex rounded-md bg-yorkRed px-4 py-2 text-sm font-medium text-white hover:opacity-90">
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
                <button type="button" onClick={() => removeItem(item.productId)} className="text-sm font-medium text-yorkRed hover:underline">
                  Remove item
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm font-medium">Quantity</span>
                <button type="button" onClick={() => setQuantity(item.productId, item.quantity - 1)} className="h-8 w-8 rounded-md border text-lg">-</button>
                <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                <button type="button" onClick={() => setQuantity(item.productId, item.quantity + 1)} className="h-8 w-8 rounded-md border text-lg">+</button>
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
          <span className="mb-1 block font-medium">Full name</span>
          <input className="w-full rounded-md border px-3 py-2" name="fullName" required />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">York email</span>
          <input type="email" className="w-full rounded-md border px-3 py-2" name="email" required />
        </label>
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Department</span>
          <input className="w-full rounded-md border px-3 py-2" name="department" required />
        </label>
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Notes</span>
          <textarea className="w-full rounded-md border px-3 py-2" name="notes" rows={4} />
        </label>
        <div className="md:col-span-2 flex items-center gap-4">
          <button type="submit" className="rounded-md bg-yorkRed px-4 py-2 text-sm font-medium text-white">
            Submit purchase request
          </button>
          {submitState.status !== "idle" && (
            <p className={`text-sm ${submitState.status === "success" ? "text-green-700" : "text-red-700"}`}>{submitState.message}</p>
          )}
        </div>
      </form>
    </section>
  );
}
