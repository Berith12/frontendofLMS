import AdminLayout from '../layouts/AdminLayout';

export default function AdminBorrowers(){
  // Future: list all borrowers, their active loans, etc.
  return (
  <AdminLayout logoutOnlyNav>
      <h1 className="text-2xl font-bold mb-4">Borrowers</h1>
      <p className="text-gray-300">Coming soon: list borrowers and their loans.</p>
    </AdminLayout>
  );
}
