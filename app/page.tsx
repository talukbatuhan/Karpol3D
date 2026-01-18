'use client';

import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import ProductList from '@/components/ProductList';

// Dynamically import Scene and View to avoid SSR issues with Canvas
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false });
const View = dynamic(() => import('@react-three/drei').then((mod) => mod.View), { ssr: false });
const Model = dynamic(() => import('@/components/canvas/Model'), { ssr: false });

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null!);

  return (
    <main
      ref={containerRef}
      className="flex min-h-screen flex-col items-center justify-between p-24 bg-zinc-950 text-white overflow-hidden relative"
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-zinc-700 bg-zinc-900/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-zinc-800/50 lg:p-4">
          Karpol 3D Showcase
        </p>
      </div>

      <div className="relative w-full h-[600px] flex items-center justify-center mb-10">
        {/* HTML Content for specific 3D View */}
        <div className="absolute top-0 right-0 p-4 z-20 pointer-events-none w-full h-full flex items-center justify-end pr-10 md:pr-20">
          <div className="pointer-events-auto text-right">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Future Design
            </h1>
            <p className="mt-4 text-zinc-400 max-w-md ml-auto text-lg">
              Explore our collection of cutting-edge products in immersive 3D.
            </p>
          </div>
        </div>

        {/* 3D View */}
        <View className="absolute top-0 left-0 w-full h-full">
          <Suspense fallback={null}>
            {/* Placeholder Model for now */}
            <Model scale={2} position={[0, -1, 0]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableZoom={false} />
            <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={40} />
          </Suspense>
        </View>
      </div>

      <div className="w-full z-10 px-4 pb-20">
        <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
        <ProductList />
      </div>


      {/* The Global Canvas Scene */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-zinc-950">
        <Scene eventSource={containerRef} eventPrefix="client" />
      </div>
    </main>
  );
}
