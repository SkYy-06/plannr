"use client";


import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react'




const ExploreLayout = () => {
    const pathname = usePathname()
    const isMainExplore = pathname === "/explore";
    const router = useRouter()

  return (
    <div className='pb-16 min-h-screen'>
        <div className='max-w-7xl mx-auto px-6'>
{!isMainExplore && (
    <div className='mb-6'>
        <Button variant='ghost' onclick = {() => router.pust("/explore")} className={gap-2 -ml-2}>

            <ArrowLeft className='w-4 h-4'/>

Back to Explore
        </Button>

    </div>

)}

        </div>
    </div>
  )
}

export default ExploreLayout