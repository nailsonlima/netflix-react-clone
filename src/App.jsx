import { useEffect, useState } from 'react'

import Tmdb from './Tmdb'

import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

import './App.css'

function App() {

const [movieList, setMovieList] = useState([]);
const [featuredData, setFeaturedData] = useState(null);
const [blackHeader, setBlackHeader] = useState(false)

useEffect(()=>{
  const loadAll = async ()=>{
    //Pegando a lista total de movies
    let list = await Tmdb.getHomeList();
    setMovieList(list);
  

  //pegando o Featured
  let originals = list.filter(i=>i.slug === 'originals');
  let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1))
  let chosem = originals[0].items.results[randomChosen]
  let chosemInfo = await Tmdb.getMovieInfo(chosem.id, 'tv');
  setFeaturedData(chosemInfo)
  }
  loadAll();
}, []);

useEffect(()=>{
  const scrollListener = () => {
    if(window.scrollY > 5){
      setBlackHeader(true)
    }else{
      setBlackHeader(false)
    }
  }
  window.addEventListener('scroll', scrollListener)
  return () => {
    window.removeEventListener('scroll', scrollListener)
  }
}, [])

  return (
    <div className="page">
      
      <Header black={blackHeader}/>

      {featuredData && 
        <FeaturedMovie item={featuredData}/>
      }


      <section className="list">
        {movieList.map((item, key)=>(
          <MovieRow title={item.title} items={item.items} key={key}/>
        ))}
      </section>

      <footer>
        Feito com <span role='img' aria-label='coracao'>🧡</span> por Nailson<br />
        Direitos de imagem para Netflix <br />
        Dados pegos de Themoviedb.org
      </footer>

          {movieList.length <= 0 &&
          <div className="loading">
            <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="carregando" />
          </div>
          }
    </div>
  )
}

export default App
