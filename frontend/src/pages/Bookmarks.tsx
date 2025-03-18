import Filter from '../components/Filter'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer';
import { FilterType, PlatformType } from '@/types/contest';
import { useState } from 'react';
import { FilterContext } from '@/store/filter-context';
import Contests from '@/components/Contests';


const INITIAL_PLATFORMS: PlatformType[] = ["CODEFORCES", "CODECHEF", "LEETCODE"];


const Bookmark = () => {
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [selectedPlatforms, setSelectedPlatform] = useState<PlatformType[]>(INITIAL_PLATFORMS)

  function handleFilterChange(val: FilterType) {
    setCurrentFilter(val);
  }

  function resetPlatforms() {
    setSelectedPlatform(INITIAL_PLATFORMS);
  }
  console.log(selectedPlatforms);
  console.log(currentFilter);


  function handlePlatformFilter(val: PlatformType) {
    if (selectedPlatforms.includes(val)) {
      setSelectedPlatform(prevState => {
        const filteredPlatforms = prevState.filter(platform => platform !== val);
        return filteredPlatforms;
      })
    }
    else {
      setSelectedPlatform(prevState => {
        return [
          ...prevState,
          val
        ]
      })
    }
  }

  const ctxValue = {
    type: currentFilter,
    platforms: selectedPlatforms,
    updatePlatform: handlePlatformFilter,
    updateFilterType: handleFilterChange,
    resetPlatform: resetPlatforms
  }

  return (
    <div className='w-full flex flex-col justify-between items-center  md:min-h-screen'>
      <NavBar />
      <div className='flex flex-col items-center pt-30 pb-10'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold my-2 text-center'>Upcoming Contests</h1>
        <p className='w-4/5 text-center text-gray-500 text-sm md:text-md lg:text-base'>Upcoming Contests
          Track programming contests from Codeforces, CodeChef, and LeetCode. Never miss a contest again!</p>
      </div>
      <FilterContext.Provider value={ctxValue}>
        <Filter />
        <Contests />
      </FilterContext.Provider>
      <Footer />
    </div>
  )
}

export default Bookmark