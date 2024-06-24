import React, { useEffect, useState } from "react"
import Layout from "../components/layout/layout"
import { fetchAPI } from "../lib/api"
import Image from "../components/image"
import Item from "../components/item"

const Home = ({ homepage, items }) => {

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

  let width = 400;
  let h2Size = 50;
  let pSize = 16;
  let aSize = 25;

  function zoomIn(){
    width = width + 50;
    h2Size = h2Size + 6.25
    pSize = pSize + 0.64
    aSize = aSize + 1.5625;
    let items = document.getElementsByClassName('wrapper')
    for (let i = 0; i < items.length; i++) {
      items[i].style.width = width + 'px'
      if (items[i].getElementsByTagName('h2')[0]){
        items[i].getElementsByTagName('h2')[0].style.fontSize = h2Size + 'px'
      }
      if (items[i].getElementsByTagName('p')[0]){
        items[i].getElementsByTagName('p')[0].style.fontSize = pSize + 'px'
      }
      if (items[i].getElementsByTagName('a')[0]){
        items[i].getElementsByTagName('a')[0].style.fontSize = aSize + 'px'
      }
    }
  }

  function zoomOut(){
    width = width - 50;
    h2Size = h2Size - 6.25
    pSize = pSize - 0.64
    aSize = aSize - 1.5625;
    let items = document.getElementsByClassName('wrapper')
    for (let i = 0; i < items.length; i++) {
      items[i].style.width = width + 'px'
      if (items[i].getElementsByTagName('h2')[0]){
        items[i].getElementsByTagName('h2')[0].style.fontSize = h2Size + 'px'
      }
      if (items[i].getElementsByTagName('p')[0]){
        items[i].getElementsByTagName('p')[0].style.fontSize = pSize + 'px'
      }
      if (items[i].getElementsByTagName('a')[0]){
        items[i].getElementsByTagName('a')[0].style.fontSize = aSize + 'px'
      }
    }
  }


  return (
    <Layout>
      <a className="back" href="/submit">Submit</a>
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
                  <Item answer={answer} i={i} j={j}/>
                )
              })}
              </>
            )
          })}
        </div>
        <h1>Product Design <br/> 50 Years</h1>

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
