import React, { useEffect, useState } from "react"
import Layout from "../components/layout/layout"
import { fetchAPI } from "../lib/api"
import Image from "../components/image"

const Home = ({ homepage, items }) => {
  let counter = 1;

  useEffect(() => {
      $( function() {
        for (let i = 0; i < document.getElementsByClassName('wrapper').length; i++) {
          let randomX =  Math.floor(Math.random() * 150) + 'vw';
          let randomY =  Math.floor(Math.random() * 150) + 'vh';
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

  function zoomIn(){
    var Page = document.getElementById('content');
    var zoom = parseInt(Page.style.zoom ? Page.style.zoom : 100) + 5 +'%'
    Page.style.zoom = zoom;
    return false;
  }

  function zoomOut(){
    var Page = document.getElementById('content');
    var zoom = parseInt(Page.style.zoom ? Page.style.zoom : 100) - 5 +'%'
    Page.style.zoom = zoom;
    return false;
  }


  return (
    <Layout>
      <div className="zoom-in-out">
        <div onClick={zoomIn}>+</div>
        <div onClick={zoomOut}>-</div>
      </div>
        <div className="content" id="content">
          {items.map((item, i) => {
            return(
              <>
              {item.attributes.Answer.map((answer,j) => {
                return(
                  <div className="wrapper" id={`wrapper${i}-${j}`} key={`wrapper${i}`} onMouseDown={placeAbove}>
                    <p>{answer.prompt.data?.attributes.prompt}</p>
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
