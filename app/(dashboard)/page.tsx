import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  redirect('/dashboard');
}
