import React from 'react'
import { FaBars, FaBell, FaSearch, FaUserCircle } from 'react-icons/fa'

const Navbar = () => {
  return (
    <div className='bg-[#FFC314] px-4 py-3 flex justify-between ml-64'>
      <div className='flex items-center text-x1'>
        <FaBars className='text-black me-4 cursor-pointer'/>
        <span className='text-black font-semibold'>Frota Leve</span>

      </div>
      <div className='flex items-center gap-x-5'> 
        <div className='relative md:w-65'>
          <span className='relative md:absolute inset-y-0 left-0 flex items-center pl-2'>
            <button className='p-1 focus:outline-none text-black md:text-black'><FaSearch/></button></span>
          <input type="text" className='w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block' />
        </div>
        <div className='text-black'>
          <FaBell className='w-6 h6'/>
        </div>
        <div className='relative'>
          <button className='text-black group'>
            <FaUserCircle className='w-6 h-6 mt-1'/>
            <div className='z-10 hidden absolute  bg-red-600 rounded-lg shadow w-32 group-focus:block top-full'>
              <ul> 
                <li> <a href="">profile</a></li>
                <li> <a href="">Setting</a></li>
                <li> <a href="">Log out</a></li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar