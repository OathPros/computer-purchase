export default function CartDrawer() {
  return (
    <aside className="rounded-xl border bg-white p-4">
      <h2 className="mb-2 text-base font-semibold">Request cart</h2>
      <p className="mb-3 text-sm text-gray-600">Your selected items will appear here in a later step.</p>
      <button type="button" className="rounded-md bg-yorkRed px-3 py-2 text-sm font-medium text-white" disabled>
        Submit purchase request
      </button>
    </aside>
  );
}
