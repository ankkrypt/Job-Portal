import React, { useEffect, useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import Image from 'next/image'
import { BsFillBookmarkFill } from 'react-icons/bs'
import { useSelector } from 'react-redux';
import JobsCard from './JobsCard';

export default function Intro() {
  const [search, setSearch] = useState('');
  const jobData = useSelector(state => state.Job.JobData);
  const [filterJobs, setFilteredJobs] = useState([])
  const [doneSearch , setDoneSearch] = useState(false)




  const handleSearch = (e) => {
    e.preventDefault();
    const filteredJobs = jobData?.filter((job) => {
      let x = job?.job_category;
      return x?.toUpperCase() === search?.toUpperCase().trim();
    });
    setFilteredJobs(filteredJobs);
    setDoneSearch(true)
  }

  return (
    <>
      <div className='w-full h-full flex items-center lg:justify-start py-24 justify-center flex-wrap bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'>
        <div className='lg:w-3/6 w-full sm:p-2 h-full my-2 flex items-center justify-center px-4 md:items-start md:justify-start md:p-20 flex-col'>
          <div className='mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold inline-block'>✨ The Future of Job Hunting</div>
          <h1 className='md:text-6xl text-3xl sm:text-2xl font-black mb-6 text-gray-900 leading-tight'>
            Find Your <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Perfect Job.</span>
          </h1>
          <p className='md:text-lg sm:text-base text-sm mb-12 text-gray-600 leading-relaxed'>Discover thousands of job opportunities from top companies. Get hired by the best employers in the industry.</p>
          
          <div className='bg-white rounded-xl shadow-xl overflow-hidden mb-8 w-full md:w-11/12 border border-gray-200'>
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200'>
              <div className='flex items-center gap-3'>
                <BiSearchAlt className='text-2xl text-blue-600' />
                <input 
                  onChange={(e) => setSearch(e.target.value)} 
                  type="text" 
                  placeholder='Search jobs by category... e.g. Marketing, Development' 
                  className='flex-1 bg-transparent text-base outline-none text-gray-700 placeholder-gray-500'
                />
              </div>
              <button 
                onClick={handleSearch} 
                className='px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 ml-2 whitespace-nowrap'
              >
                Search
              </button>
            </div>
            <div className='px-4 py-3 bg-gray-50'>
              <div className='flex items-center gap-2 mb-2'>
                <BsFillBookmarkFill className='text-blue-600 text-sm' />
                <h3 className='text-sm font-semibold text-gray-700'>Popular Categories:</h3>
              </div>
              <div className='flex gap-2 flex-wrap'>
                <span className='px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-700 hover:border-blue-600 cursor-pointer transition-all duration-300'>💻 Software</span>
                <span className='px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-700 hover:border-blue-600 cursor-pointer transition-all duration-300'>📱 Marketing</span>
                <span className='px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-700 hover:border-blue-600 cursor-pointer transition-all duration-300'>🎨 UI/UX Design</span>
              </div>
            </div>
          </div>

          <div className='flex gap-4 items-center text-sm text-gray-600'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 rounded-full bg-green-500'></div>
              <span>2,400+ Active Users</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 rounded-full bg-blue-500'></div>
              <span>5,000+ Jobs Listed</span>
            </div>
          </div>
        </div>

        <div className='w-full lg:w-3/6 my-2 h-full hidden items-center justify-center flex-col p-20 lg:flex'>
          <div className='relative w-full h-full max-w-md'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-30'></div>
            <div className='relative bg-white rounded-3xl shadow-2xl p-8'>
              <Image width={400} height={500} src="/intro.png" alt="job-search" className='w-full h-auto' />
            </div>
          </div>
        </div>
      </div>

      {
        doneSearch && (
          <div className='w-full flex flex-wrap items-center justify-center py-12 px-4 bg-white'>
            <div className='w-full mb-8'>
              <h2 className='text-3xl font-semibold text-gray-900 mb-2'>Search Results</h2>
              <p className='text-gray-600'>Found {filterJobs.length} job{filterJobs.length !== 1 ? 's' : ''}</p>
            </div>
            {
              Array.isArray(filterJobs) && filterJobs.length > 0 ? filterJobs?.map((job) => {
                return (
                  <JobsCard job={job} key={job?._id} />
                )
              }) : <div className='w-full text-center py-12'>
                <p className='text-lg font-semibold text-gray-500 mb-2'>No jobs found</p>
                <p className='text-gray-400'>Try searching with a different category</p>
              </div>
            }
          </div>
        )
      }
    </>
  )
}


