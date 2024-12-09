import '../styling/Jobs.css'
import Filter from "../Components/Filter"
import JobCard from "../Components/JobCard"
import Search from "../Components/Search"
import Spinner from "../Components/Spinner"
// import NextIcon from '../assets/chevron-left'
// import ChevronLeft from '../assets/chevron-left.svg'
// import ChevronRight from '../assets/chevron-right.svg'
import useFetchJobs from '../hooks/useFetchJobs'
import { v4 as uuidv4 } from 'uuid'

import {  useState, useEffect   } from 'react'
import  Pagination from '../Components/Pagination'

  

const Jobs = () => {
  
  
 
  const [ filter, setFilter ] = useState(null)
  const [ pageNumber, setPageNumber ] = useState(1)
  const [ isVisible, setIsVisible ] = useState(false)
  const [ searchValue, setSearchValue ] = useState('')
  const [isFetchTriggered, setIsFetchTriggered] = useState(false)
  const { errorMessage, isLoading, jobs, count } =  useFetchJobs({filter, setFilter, searchValue, pageNumber, isFetchTriggered, setIsFetchTriggered, 
  
  })
  

  useEffect(() => { 
    if(window.innerWidth > 768) {
      window.scrollTo({ top: 0 });
    }
    
  } , [pageNumber])

const totalPages = Math.ceil(count / 10); // Total number of pages

  
  const handleTimeDifference = (created) => {
    const today = new Date() ;
    const createdAt = new Date(created) 
    const timeDifference = today.getTime() - createdAt.getTime()
    const daysDifference = Math.floor(timeDifference/(1000 * 60 * 60 * 24))
    return daysDifference
  }

  return (
    <>
      <main className='dashboard'> 
        <div className="jobs ">
            <Filter 
                isVisible={isVisible}  
                setIsVisible={setIsVisible}
                setFilter={setFilter} 
                filter={filter}
                setIsFetchTriggered={setIsFetchTriggered}
                setPageNumber={setPageNumber}
                 

            />
            <div className="cardContainer">
              <Search 
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setIsFetchTriggered={setIsFetchTriggered}
              />
              {
                isLoading  && <Spinner />
              }
              {
                errorMessage && <div className='error'>{errorMessage}</div>
              }

              {
               (!isLoading && count == 0) && <p className='error' style={{ margin:'auto'}}>No Job Found </p>
              }

              { !isLoading &&
                jobs.map((job) =>{ 
                   const {  id, title, company, location, category, created, redirect_url,   } = job
                   const uniqueId = uuidv4()
               
                   const daysDifference = handleTimeDifference(created)
                   
                 return (
                  <div  key={uniqueId} className="jobDetails">
                     <JobCard 
                        title={title} 
                        company={company.display_name} 
                        location={location?.area || 'Unknown Location'}
                        category={category?.label || 'No Category'}
                        postedAt={daysDifference}
                        redirectUrl={redirect_url}
                        id={id}
                        job={job}
                        filter={filter}
                      /> 
                    
                  </div>
                )})
              }

              {/* {(70 > viewMore && !isLoading) &&   <button className='viewMore' onClick={handleViewMore} aria-label='viewMore'> View More </button>} */}

              { (count > 20 && !isLoading) &&   <Pagination totalpages={totalPages}  pageNumber={pageNumber}  setPageNumber={setPageNumber} /> }
            </div>
 
        </div>

       <section className="select">
       </section>


        </main>
    </>
  )
}



export default Jobs