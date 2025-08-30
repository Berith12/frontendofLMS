import AdminLayout from '../layouts/AdminLayout';

export default function AdminReturn(){
  // Future: find a borrower and mark a book as returned.
  return (
    <AdminLayout logoutOnlyNav>
      <h1 className="text-2xl font-bold mb-4">Return Book</h1>
      <p className="text-gray-300">Coming soon: Return processing UI.</p>
    </AdminLayout>
  );
}
