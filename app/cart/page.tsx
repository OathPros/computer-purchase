export default function CartPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Submit purchase request</h2>
        <p className="mt-2 text-sm text-gray-700">
          This form collects requester details and selected items for institutional review.
        </p>
      </div>
      <form className="grid gap-4 rounded-xl border bg-white p-6 md:grid-cols-2">
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
        <div className="md:col-span-2">
          <button type="submit" className="rounded-md bg-yorkRed px-4 py-2 text-sm font-medium text-white">
            Submit purchase request
          </button>
        </div>
      </form>
    </section>
  );
}
