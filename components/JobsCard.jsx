import React from 'react'
import Image from 'next/image'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { FiMapPin, FiDollarSign, FiCalendar, FiBriefcase } from 'react-icons/fi'
import { useRouter } from 'next/router'

export default function JobsCard({job , posted}) {
    const router = useRouter();
    
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div key={job._id} className='w-full h-full bg-white rounded-2xl border border-gray-200 hover:border-blue-400 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col'>
            {/* Header with user info */}
            <div className='p-6 border-b border-gray-100'>
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md'>
                            {job?.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <h3 className='text-base font-semibold text-gray-900'>{job?.user?.name}</h3>
                            <p className='text-sm text-gray-500'>{job?.company}</p>
                        </div>
                    </div>
                    <div className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold whitespace-nowrap'>
                        {job?.job_type}
                    </div>
                </div>
            </div>

            {/* Job Title and Description */}
            <div className='px-6 pt-5 pb-4 flex-grow'>
                <h2 className='text-xl font-bold text-gray-900 mb-2 line-clamp-2'>{job?.title}</h2>
                <p className='text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
            </div>

            {/* Job Details */}
            <div className='px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-gray-100'>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0'>
                            <FiDollarSign className='text-blue-600 text-lg' />
                        </div>
                        <div>
                            <p className='text-xs text-gray-600 font-medium'>Salary</p>
                            <p className='text-sm font-bold text-gray-900'>${job?.salary}<span className='text-xs font-normal text-gray-600'>/mo</span></p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0'>
                            <FiCalendar className='text-purple-600 text-lg' />
                        </div>
                        <div>
                            <p className='text-xs text-gray-600 font-medium'>Deadline</p>
                            <p className='text-sm font-bold text-gray-900'>{formatDate(job?.job_deadline)}</p>
                        </div>
                    </div>
                    <div className='col-span-2 flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0'>
                            <FiBriefcase className='text-green-600 text-lg' />
                        </div>
                        <div>
                            <p className='text-xs text-gray-600 font-medium'>Experience</p>
                            <p className='text-sm font-bold text-gray-900'>{job?.job_experience}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category and Action */}
            <div className='px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-gray-100'>
                <div className='flex flex-wrap gap-2'>
                    <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
                        {job?.job_category}
                    </span>
                    <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>
                        {job?.job_vacancy} positions
                    </span>
                </div>
                {
                    posted ? (
                        <button 
                            onClick={() => router.push(`/frontend/detailPostedJob/${job?._id}`)} 
                            className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 group whitespace-nowrap'
                        >
                            View <AiOutlineArrowRight className='group-hover:translate-x-1 transition-transform' />
                        </button>
                    ) : (
                        <button 
                            onClick={() => router.push(`/frontend/jobDetails/${job?._id}`)} 
                            className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 group whitespace-nowrap'
                        >
                            Apply <AiOutlineArrowRight className='group-hover:translate-x-1 transition-transform' />
                        </button>
                    )
                }
            </div>
        </div>
    )
}
