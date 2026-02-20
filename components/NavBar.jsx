import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { BiLogOut } from 'react-icons/bi';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import { setUserData } from '@/Utils/UserSlice';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';



export default function NavBar() {
    const dispatch = useDispatch();
    const [openJobs, setOpenJobs] = useState(false)


    useEffect(() => {
        dispatch(setUserData(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null));
    }, [dispatch])


    const Router = useRouter();
    const user = useSelector(state => state.User.userData)


    const [isOpen, setIsOpen] = useState(false);

    const [scrolled, isScrolled] = useState(false);


    const useOutsideClick = (callback) => {
        const ref = React.useRef();

        React.useEffect(() => {
            const handleClick = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            };

            document.addEventListener('click', handleClick, true);

            return () => {
                document.removeEventListener('click', handleClick, true);
            };
        }, [ref]);

        return ref;
    };


    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                isScrolled(true)
            } else {
                isScrolled(false)
            }
        })
        return () => {
            window.removeEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    isScrolled(true)
                } else {
                    isScrolled(false)
                }
            })
        }
    }, [scrolled])


    const handleLogout = async () => {
        Cookies.remove('token');
        localStorage.removeItem('user')
        Router.reload();
    }




    const handleClickOutside = () => {
        setIsOpen(false);
    };
    const ref = useOutsideClick(handleClickOutside);

    return (
        <>
            <div className={`w-full ${scrolled ? "bg-white shadow-lg" : "bg-white"} px-4 md:px-8 h-20 text-gray-800 flex items-center justify-between fixed top-0 left-0 z-50 transition-all duration-300`}>
                <div className='h-full flex items-center justify-center'>
                    <Link href={'/'}>
                    <p className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>JobHub</p>
                    </Link>
                </div>
                <div className='h-full hidden items-center justify-center lg:flex gap-1'>
                    <Link href={'/frontend/postAJob'} className="px-4 py-2 text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg" >Post Jobs</Link>
                    <Link href={'/frontend/displayJobs'} className="px-4 py-2 text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg" >View Jobs</Link>
                    <Link href={'/frontend/postedJob'} className="px-4 py-2 text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg" >Posted Jobs</Link>
                    <Link href={'/frontend/dashboard'} className="px-4 py-2 text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg" >Dashboard</Link>
                </div>
                <div className='h-full hidden items-center justify-center lg:flex gap-4' >
                    {
                        user !== null ? (
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold'>
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <p className='text-sm font-semibold'>{user?.name}</p>
                                </div>
                                <button onClick={handleLogout} className='p-2 hover:bg-red-100 rounded-lg transition-all duration-300'>
                                    <BiLogOut className='text-xl text-red-500' />
                                </button>
                            </div>
                        ) : (
                            <div className='flex gap-3'>
                                <Link href={'/auth/login'} className='px-4 py-2 border border-blue-600 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300'>Login</Link>
                                <Link href={'/auth/register'} className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300'>Sign Up</Link>
                            </div>
                        )
                    }

                </div>

                <div className='flex lg:hidden px-2 py-2'>
                    <button onClick={() => setIsOpen(state => !state)} className='p-2 hover:bg-gray-100 rounded-lg transition-all duration-300'>
                        {isOpen ? <MdClose className='text-2xl' /> : <GiHamburgerMenu className='text-2xl' />}
                    </button>
                </div>

                {
                    isOpen && (
                        <div ref={ref} className='flex w-full py-4 bg-white shadow-lg absolute top-20 left-0 items-center justify-center flex-col border-t border-gray-200'>
                            <div className='px-4 flex items-center justify-center flex-col py-2 gap-2 w-full'>
                                <Link href={'/'} onClick={() => setIsOpen(false)} className="px-4 py-2 w-full text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg text-center" >Home</Link>
                                <button onClick={() => setOpenJobs(state => !state)} className="px-4 py-2 w-full text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2" >Jobs {openJobs ? <AiFillCaretUp className='text-sm' /> : <AiFillCaretDown className='text-sm' />} </button>

                                {
                                    openJobs &&
                                    <>
                                        <Link href={'/frontend/displayJobs'} onClick={() => setIsOpen(false)} className="px-4 py-2 w-full text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg text-center" >View Jobs</Link>
                                        <Link href={'/frontend/postAJob'} onClick={() => setIsOpen(false)} className="px-4 py-2 w-full text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg text-center" >Post Jobs</Link>
                                        <Link href={'/frontend/postedJob'} onClick={() => setIsOpen(false)} className="px-4 py-2 w-full text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg text-center" >Posted Jobs</Link>
                                    </>
                                }
                                <Link href={'/frontend/dashboard'} onClick={() => setIsOpen(false)} className="px-4 py-2 w-full text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg text-center" >Dashboard</Link>
                                <Link href={'/'} onClick={() => setIsOpen(false)} className="px-4 py-2 w-full text-base font-medium transition-all duration-300 hover:bg-gray-100 rounded-lg text-center" >Contact</Link>
                            </div>
                            <div className='px-4 w-full flex items-center justify-center flex-col gap-2 border-t border-gray-200 py-4'>
                                {
                                    user !== null ? (
                                        <div className='w-full'>
                                            <div className='flex items-center gap-2 mb-4 px-4 py-2 bg-gray-100 rounded-lg'>
                                                <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold'>
                                                    {user?.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <p className='text-sm font-semibold'>{user?.name}</p>
                                            </div>
                                            <button onClick={handleLogout} className='w-full py-2 px-4 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-all duration-300 flex items-center justify-center gap-2'>
                                                <BiLogOut /> Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='w-full flex flex-col gap-2'>
                                            <Link href={'/auth/login'} className='px-4 py-2 border border-blue-600 rounded-lg text-blue-600 font-semibold text-center hover:bg-blue-50 transition-all duration-300'>Login</Link>
                                            <Link href={'/auth/register'} className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-300'>Sign Up</Link>
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    )
                }

            </div>
        </>
    )
}
