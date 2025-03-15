import Contests from './Contests'
import Filter from './Filter'
import NavBar from './NavBar'
import Footer from './Footer';
import { FilterType, PlatformType } from '@/types/contest';
import { useState } from 'react';
import { FilterContext } from '@/store/filter-context';

const Home = () => {
  const [currentFilter, setCurrentFilter] = useState<FilterType>("upcoming");
  const [selectedPlatforms, setSelectedPlatform] = useState<PlatformType[]>(["codeforces", "codechef", "leetcode"])

  function handleFilterChange(val: FilterType) {
    setCurrentFilter(val);
  }

  function resetPlatforms() {
    setSelectedPlatform(["codeforces", "codechef", "leetcode"]);
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
    <div className='w-full flex flex-col justify-center items-center'>
      <NavBar />
      <div className='flex flex-col items-center pt-30 pb-10'>
        <h1 className='text-4xl font-bold my-2'>Upcoming Contests</h1>
        <p className='w-4/5 text-center text-gray-500'>Upcoming Contests
          Track programming contests from Codeforces, CodeChef, and LeetCode. Never miss a contest again!</p>
      </div>
      <FilterContext.Provider value={ctxValue}>
        <Filter/>
        <Contests />
      </FilterContext.Provider>
      <Footer />
    </div>
  )
}

export default Home