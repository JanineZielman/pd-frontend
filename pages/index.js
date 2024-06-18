import React, { useEffect, useState } from "react"
import Layout from "../components/layout/layout"
import { fetchAPI } from "../lib/api"
import { useRouter } from "next/router"
import { BlocksRenderer } from "@strapi/blocks-react-renderer"
import Image from "../components/image"

const Home = ({ homepage, items }) => {


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


  return (
    <Layout>
      {items.map((item, i) => {
        return(
          <div className="wrapper" id={`wrapper${i}`} key={`wrapper${i}`}>
            <p>{item.attributes.Prompt}</p>
            <h2>{item.attributes.Answer_Text}</h2>
            {item.attributes.Answer_Image.data && 
              <div class="halftone">
                <Image image={item.attributes.Answer_Image.data}/>
              </div>
            }
          </div>
        )
      })}
      <h1>Product Design <br/> 50 jaar</h1>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const [homepageRes, itemsRes] = await Promise.all([
    fetchAPI("/homepage?populate=*"),
    fetchAPI("/items?populate=*"),
  ])

  return {
    props: {
      homepage: homepageRes.data,
      items: itemsRes.data
    },
  }
}

export default Home
