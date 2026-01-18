'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugPage() {
    const [status, setStatus] = useState('Checking...');
    const [info, setInfo] = useState<any>({});
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        async function checkConnection() {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            const debugInfo = {
                env_url: url ? url : 'MISSING',
                env_key_prefix: key ? key.substring(0, 5) + '...' : 'MISSING',
                supabase_client_url: supabase['supabaseUrl'], // Access internal property if possible
            };
            setInfo(debugInfo);

            try {
                // Try to simple select
                const { data, error } = await supabase.from('products').select('*').limit(1);

                if (error) {
                    setStatus('FAILED');
                    setError(error);
                } else {
                    setStatus('SUCCESS');
                    setInfo(prev => ({ ...prev, data_sample: data }));
                }
            } catch (err: any) {
                setStatus('CRASHED');
                setError(err.message);
            }
        }

        checkConnection();
    }, []);

    return (
        <div className="min-h-screen bg-black text-green-400 p-10 font-mono">
            <h1 className="text-2xl font-bold mb-4 border-b border-green-800 pb-2">System Diagnostics</h1>

            <div className="mb-6">
                <h2 className="text-white text-lg mb-2">Environment Config</h2>
                <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
                    <p>SUPABASE_URL: <span className="text-white">{info.env_url}</span></p>
                    <p>SUPABASE_KEY: <span className="text-white">{info.env_key_prefix}</span></p>
                    <p>Client Internal URL: <span className="text-white">{info.supabase_client_url}</span></p>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-white text-lg mb-2">Connection Status</h2>
                <div className={`p-4 rounded border ${status === 'SUCCESS' ? 'bg-green-900/30 border-green-600' : 'bg-red-900/30 border-red-600'}`}>
                    <p className="text-xl font-bold">{status}</p>
                </div>
            </div>

            {error && (
                <div className="mb-6">
                    <h2 className="text-white text-lg mb-2">Active Error</h2>
                    <pre className="bg-red-950 text-red-200 p-4 rounded overflow-auto border border-red-800">
                        {JSON.stringify(error, null, 2)}
                    </pre>
                    <p className="mt-2 text-zinc-500">
                        Error Code PGRST205: Means the Supabase API cannot find the table.
                        Could be wrong project, wrong schema, or schema cache stale.
                    </p>
                </div>
            )}

            {status === 'SUCCESS' && (
                <div>
                    <h2 className="text-white text-lg mb-2">Table Test Data</h2>
                    <pre className="text-xs bg-zinc-900 p-4 border border-zinc-700 text-zinc-300">
                        {JSON.stringify(info.data_sample, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
