import { fetchAPI } from "../lib/api"
import Layout from "../components/layout/layout"
import React, {useState, useEffect} from "react"

const Page = ({ page}) => {
  console.log(page)

  let counter = 1;


  useEffect(() => {

      $( function() {
        for (let i = 0; i < document.getElementsByClassName('wrapper').length; i++) {
          let randomX =  Math.floor(Math.random() * 85) + 'vw';
          let randomY =  Math.floor(Math.random() * 85) + 'vh';
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
      <div className="content2">
          {page.attributes.Answer?.map((item, i) => {
            return(
              <div className="wrapper" id={`wrapper${i}`} key={`wrapper${i}`} onMouseDown={placeAbove}>
                {/* <p>{answer.prompt.data.attributes.prompt}</p> */}
                <h2>{item.Answer_Text}</h2>
                {item.Answer_Image?.data && 
                  <div className="halftone">
                    <Image image={answer.Answer_Image.data}/>
                  </div>
                }
              </div>
            )
          })}
        </div>
      <h1>  {page.attributes.Fullname}
      <br/>
      <div className="button">Another prompt</div>
      </h1>
     
    </Layout>
  )
}


export async function getServerSideProps({ params }) {
  const pagesRes = 
    await fetchAPI( `/items?filters[slug][$eq]=${params.slug}&populate=*`
  );

  return {
    props: { 
      page: pagesRes.data[0], 
    },
  };
}


export default Page
