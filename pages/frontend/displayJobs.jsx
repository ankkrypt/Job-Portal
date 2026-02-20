import useSWRInfinite from 'swr/infinite';
import { get_job } from '@/Services/job';
import React from 'react';
import NavBar from '@/components/NavBar';
import JobsCard from '@/components/JobsCard';
import { InfinitySpin } from 'react-loader-spinner';

const PAGE_SIZE = 20;

const fetcher = (pageIndex) => get_job(pageIndex + 1, PAGE_SIZE);

export default function DisplayJobs() {
    const {
        data,
        error,
        size,
        setSize,
        isValidating
    } = useSWRInfinite(
        (index) => `/api/job/getAllJobs?page=${index + 1}&limit=${PAGE_SIZE}`,
        fetcher
    );

    const jobs = data ? [].concat(...data.map(d => d.data)) : [];
    const isLoadingMore = isValidating && size > 0 && data && typeof data[size - 1] === "undefined";
    const isReachingEnd = data && data[data.length - 1]?.data.length < PAGE_SIZE;

    // Infinite scroll handler (simplified)
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop
            >= document.documentElement.offsetHeight - 500 &&
            !isLoadingMore && !isReachingEnd
        ) {
            setSize(size + 1);
        }
    };

    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    return (
        <>
            <NavBar />
            <div className='w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-20 pb-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    {/* Header Section */}
                    <div className='mb-16'>
                        <div className='text-center md:text-left mb-12'>
                            <h1 className='text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight'>
                                Explore <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Available Jobs</span>
                            </h1>
                            <p className='text-xl text-gray-600 max-w-2xl'>
                                Browse through thousands of job opportunities and find your next career move
                            </p>
                        </div>
                        
                        {jobs.length > 0 && (
                            <div className='flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 shadow-sm'>
                                <div>
                                    <p className='text-sm text-gray-600'>Total Jobs Available</p>
                                    <p className='text-2xl font-bold text-gray-900'>{jobs.length}+ Positions</p>
                                </div>
                                <div className='h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white'>
                                    📋
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Jobs Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-12'>
                        {jobs.length > 0 ? jobs.map((job) => (
                            <div key={job?._id} className='h-full'>
                                <JobsCard job={job} />
                            </div>
                        )) : (
                            <div className='col-span-full py-20'>
                                <div className='text-center'>
                                    <div className='text-6xl mb-4'>🔍</div>
                                    <p className='text-2xl font-bold text-gray-900 mb-2'>No jobs found yet</p>
                                    <p className='text-lg text-gray-500'>Check back soon for new exciting opportunities</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {isLoadingMore && (
                        <div className='flex justify-center py-12'>
                            <div className='text-center'>
                                <InfinitySpin width='100' color='#3b82f6' />
                                <p className='text-gray-600 mt-4 font-medium'>Loading more jobs...</p>
                            </div>
                        </div>
                    )}
                    
                    {/* End of List Message */}
                    {isReachingEnd && jobs.length > 0 && (
                        <div className='text-center py-12'>
                            <div className='inline-block px-8 py-4 bg-white rounded-lg border-2 border-dashed border-gray-300'>
                                <p className='text-lg font-semibold text-gray-700'>✨ You've reached the end of the list!</p>
                                <p className='text-gray-600 mt-1'>More jobs coming soon</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}