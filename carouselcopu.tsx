"use client"
import {useState} from "react"


export default function CategoryCarousel() {

  const [slide, setSlide] = useState(0)
  const nextSlide = () =>{
      setSlide(slide === data.length - 1 ? 0 : slide + 1);
  }
  const prevSlide = () =>{
      setSlide(slide === 0 ? data.length - 1 : slide - 1);
  }
  
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()
    
    } catch (error) {
      console.error(console.error();
      .message)
    } 

  

    return (
      <div className="flex">
        <h1>Products</h1>
        <p>Lista produktów</p>
      </div>
    );
  }

export const Carousel = ({data}) =>{
const [slide, setSlide] = useState(0)
const nextSlide = () =>{
    setSlide(slide === data.length - 1 ? 0 : slide + 1);
}
const prevSlide = () =>{
    setSlide(slide === 0 ? data.length - 1 : slide - 1);
}

 



    return(
    <div className="carousel">
        <BsArrowLeftCircleFill className="arrow arrow-left" onClick={prevSlide} />
        {data.map((item, idx) =>{
            return <img src={item.src} alt ={item.alt} key={idx} className={ slide === idx ?"slide" :"slide slide-hidden"}/>
        })}
        <BsArrowRightCircleFill className="arrow arrow-right"onClick={nextSlide} />
        <span className="indicators">
            {data.map((_, idx) => {
                return <button key={idx } className={slide === idx ? "indicator" : "indicator indicator-inactive"} onClick={() => setSlide(idx)}
                ></button>
            })}
        </span>
    </div>
    )
}