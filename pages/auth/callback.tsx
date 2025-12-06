import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createSupabaseComponentClient } from '@/utils/supabase/clients/component';
import type { GetServerSideProps } from 'next';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createSupabaseComponentClient();
      // The session is automatically handled by Supabase
      // Just redirect to dashboard
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Verifying your email...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

// Force this page to be server-rendered, not statically generated
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
