import React, { useState } from 'react'
import Header from '../components/Header/Header'
import Tech from '../components/Tech/Tech'
import Experience from '../components/Experience/Experience'
import LetBuild from '../components/LetBuild/LetBuilld'
import Project from '../components/Project/Project'

const Home = () => {
  const [category, setCategory] = useState("All")
  
  return (
    <div>
      <Header/>
      <Tech category={category} setCategory={setCategory}/>
      <Experience/>
      <Project/>
      <LetBuild/>
    </div>
  )
}

export default Home