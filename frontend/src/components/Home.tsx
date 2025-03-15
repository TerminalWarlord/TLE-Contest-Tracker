import { useEffect } from 'react';
import Contests from './Contests'
import Filter from './Filter'
import NavBar from './NavBar'
import Footer from './Footer';
import { useSearchParams } from 'react-router-dom';

const Home = () => {

  // useEffect(() => {
  //   document.body.classList.add("bg-gradient-to-tr", "from-slate-50", "to-blue-300/15");

  //   return () => document.body.classList.remove("bg-gradient-to-tr", "from-slate-50", "to-blue-300/15");
  // }, [])


  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <NavBar />
      <div className='flex flex-col items-center pt-30 pb-10'>
        <h1 className='text-4xl font-bold my-2'>Upcoming Contests</h1>
        <p className='w-4/5 text-center text-gray-500'>Upcoming Contests
          Track programming contests from Codeforces, CodeChef, and LeetCode. Never miss a contest again!</p>
      </div>
      <Filter />
      <Contests />
      <Footer />
    </div>
  )
}

export default Home