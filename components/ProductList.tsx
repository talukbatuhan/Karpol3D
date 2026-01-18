'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
    id: string;
    name: string;
    price: number;
    thumbnail_url: string;
    model_url: string;
};

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.log('Connected to Supabase URL:', supabase['supabaseUrl']);
                    console.error('Error fetching products:', error.message, error.details, error.hint);
                } else {
                    setProducts(data || []);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center text-zinc-500 py-10">Loading products...</div>;
    }

    if (products.length === 0) {
        return (
            <div className="text-center text-zinc-500 py-10">
                <p>No products found.</p>
                <p className="text-sm mt-2">Make sure you have added items to your Supabase &quot;products&quot; table.</p>
                <Link href="/product/demo-1" className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm">
                    View Demo Product
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto p-4 z-10 relative">
            {products.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="group relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-600 transition-colors"
                    >
                        <div className="aspect-square relative flex items-center justify-center bg-zinc-800/30">
                            {product.thumbnail_url ? (
                                <Image
                                    src={product.thumbnail_url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="text-4xl">📦</div>
                            )}
                            {/* Optional: Add a small 3D badge or indicator */}
                            <div className="absolute top-2 right-2 bg-blue-600 text-xs px-2 py-1 rounded text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                View 3D
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                            <p className="text-zinc-400">${product.price}</p>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}
