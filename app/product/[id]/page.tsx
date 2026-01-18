'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    model_url: string;
};

import Model from '@/components/canvas/Model';


export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            if (!id) return;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                // Mock data for development if table doesn't exist yet
                if (id === 'demo-1') {
                    setProduct({
                        id: 'demo-1',
                        name: 'Demo Chair',
                        description: 'This is a demo product to show the layout before you connect the database.',
                        price: 299,
                        model_url: ''
                    });
                }
                console.error('Error fetching product:', error);
            } else {
                setProduct(data);
            }
            setLoading(false);
        }

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row animate-pulse">
                {/* 3D Viewer Skeleton */}
                <div className="w-full md:w-2/3 h-[50vh] md:h-screen bg-zinc-900" />

                {/* Details Skeleton */}
                <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center border-l border-zinc-900 gap-6">
                    <div className="h-12 bg-zinc-900 rounded w-3/4" />
                    <div className="h-8 bg-zinc-900 rounded w-1/4" />
                    <div className="space-y-4">
                        <div className="h-4 bg-zinc-900 rounded w-full" />
                        <div className="h-4 bg-zinc-900 rounded w-full" />
                        <div className="h-4 bg-zinc-900 rounded w-5/6" />
                    </div>
                    <div className="flex gap-4 mt-8">
                        <div className="h-14 bg-zinc-900 rounded-full flex-1" />
                        <div className="h-14 w-14 bg-zinc-900 rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white flex-col gap-4">
                <h1 className="text-2xl">Product not found</h1>
                <p className="text-zinc-500">Ensure you have added data to Supabase.</p>
                <Link href="/" className="text-blue-400 hover:underline">Back Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">

            {/* 3D Viewer Section (Left/Top) */}
            <div className="w-full md:w-2/3 h-[50vh] md:h-screen relative bg-gradient-to-b from-zinc-800 to-zinc-950">
                <Link href="/" className="absolute top-6 left-6 z-10 text-sm font-mono text-zinc-400 hover:text-white transition-colors bg-black/50 p-2 rounded">
                    ← Back to Gallery
                </Link>

                <Canvas className="w-full h-full">
                    <Suspense fallback={null}>
                        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                        <ambientLight intensity={0.7} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                        <Environment preset="city" />

                        <group position={[0, -1, 0]}>
                            {/* Fallback to box if no model_url, or use the real model */}
                            {product.model_url ? (
                                <Model url={product.model_url} scale={2} />
                            ) : (
                                <mesh rotation={[0, 0, 0]}>
                                    <boxGeometry args={[2, 2, 2]} />
                                    <meshStandardMaterial color="#6366f1" />
                                </mesh>
                            )}
                            <ContactShadows position={[0, -1.01, 0]} opacity={0.5} scale={10} blur={2} far={4} />
                        </group>

                        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Product Details Section (Right/Bottom) */}
            <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center bg-zinc-950/90 backdrop-blur-xl border-l border-zinc-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        {product.name}
                    </h1>
                    <p className="text-2xl font-light text-zinc-300 mb-8">${product.price}</p>

                    <div className="prose prose-invert mb-10 text-zinc-400 leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 bg-white text-black font-bold py-4 px-8 rounded-full hover:bg-zinc-200 transition-colors transform active:scale-95">
                            Add to Cart
                        </button>
                        <button className="p-4 rounded-full border border-zinc-700 hover:bg-zinc-900 transition-colors">
                            <span className="sr-only">Share</span>
                            🔗
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
