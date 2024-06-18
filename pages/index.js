import React, { useEffect, useState } from "react"
import Layout from "../components/layout/layout"
import { fetchAPI } from "../lib/api"
import { useRouter } from "next/router"
import { BlocksRenderer } from "@strapi/blocks-react-renderer"
import Image from "../components/image"

const Home = ({ homepage, items }) => {

  console.log(items)

  let counter = 1;


  useEffect(() => {

      $( function() {
        for (let i = 0; i < document.getElementsByClassName('wrapper').length; i++) {
          let randomX =  Math.floor(Math.random() * 100) + 'vw';
          let randomY =  Math.floor(Math.random() * 100) + 'vh';
          let id = '#' + document.getElementsByClassName('wrapper')[i].id
          $(id).draggable();
          document.getElementsByClassName('wrapper')[i].style.marginLeft = randomX
          document.getElementsByClassName('wrapper')[i].style.marginTop = randomY
        }
      } );
      
  }, [])

  function placeAbove(event){
    if (event.target.parentElement.id){
      counter++
      document.getElementById(event.target.parentElement.id).style.zIndex = counter;
    }
    if (event.target.id){
      counter++
      document.getElementById(event.target.id).style.zIndex = counter;
    }
  }


  return (
    <Layout>

        <div className="content">
          {items.map((item, i) => {
            return(
              <>
              {item.attributes.Answer.map((answer,j) => {
                return(
                  <div className="wrapper" id={`wrapper${i}-${j}`} key={`wrapper${i}`} onMouseDown={placeAbove}>
                    {/* <p>{answer.prompt.data.attributes.prompt}</p> */}
                    <h2>{answer.Answer_Text}</h2>
                    {answer.Answer_Image.data && 
                      <div className="halftone">
                        <Image image={answer.Answer_Image.data}/>
                      </div>
                    }
                  </div>
                )
              })}
              
              </>
            )
          })}
        </div>
        <h1>Product Design <br/> 50 jaar</h1>

    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const [homepageRes, itemsRes] = await Promise.all([
    fetchAPI("/homepage?populate=*"),
    fetchAPI("/items?populate[Answer][populate]=*&populate=*"),
  ])

  return {
    props: {
      homepage: homepageRes.data,
      items: itemsRes.data
    },
  }
}

export default Home
