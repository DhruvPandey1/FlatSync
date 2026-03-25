import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthProvider({ children }:{
  children: React.ReactNode;
}) {
  const token = (await cookies()).get('admin_token')?.value;

  if (!token) redirect('/admin/login');

  return (
    <>
      {children}
    </>
  );
}