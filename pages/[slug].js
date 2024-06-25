import { fetchAPI } from "../lib/api"
import Layout from "../components/layout/layout"
import React, { useEffect, useState, useRef } from "react"
import Item from "../components/item"

const Page = ({ page, items, homepage}) => {
  let imageId;

  useEffect(() => {
      $( function() {
        for (let i = 0; i < document.getElementsByClassName('wrapper2').length; i++) {
          let randomX =  Math.floor(Math.random() * 85) + 'vw';
          let randomY =  Math.floor(Math.random() * 85) + 'vh';
          let id = '#' + document.getElementsByClassName('wrapper2')[i].id
          $(id).draggable();
          document.getElementsByClassName('wrapper2')[i].style.marginLeft = randomX
          document.getElementsByClassName('wrapper2')[i].style.marginTop = randomY
        }
      } );   
  }, [])
  const [error, setError] = useState()
  const [randomNumber, setRandomNumber] = useState(getRandomInt(items.length))

  const [userData, setUserData] = useState({
    Answer: page.attributes.Answer
  })

  const submitPage = useRef();
  const [loading, setLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    let text = document.getElementById('text').value
    let link = document.getElementById('link').value
    let prompt_id = document.getElementById('hidden').value

    if (document.getElementById('answer_image').files[0]){
      handleUpload();
    }
   
    setTimeout(() => {
      if (document.getElementById('answer_image').files[0]){
        userData.Answer.push({Answer_Text: text,  Answer_Link: link, prompt: prompt_id, Answer_Image: [imageId] })
      } else {
        userData.Answer.push({Answer_Text: text,  Answer_Link: link, prompt: prompt_id })
      }
      try {
        fetch(`https://cms.pdapedia.nl/api/items/${page.id}?populate=*`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: userData,
          }),
        })
        .then(response => response.json())
        .then(setLoading(false))
        .then(imageId=null)
        setTimeout(() => {
          location.reload();
        }, 500);
      } catch (err) {
        console.log('err', err);
        setError(err.response.data.message);
        setLoading(false);
      } 
    }, 1000);


  }

  const handleUpload = async (e) => {
    let image = document.getElementById('answer_image').files[0]
    const formData = new FormData();
    formData.append('files', image);
    fetch(`https://cms.pdapedia.nl/api/upload`, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => imageId = data?.[0]?.id)
    .catch(error => console.error('Error:', error));
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function openPopup(){
    document.getElementById('popup').style.display = 'flex';
  }

  function closePopup(){
    document.getElementById('popup').style.display = 'none';
  }

  function print(){
    window.print();
  }


  function openPopup2(id){
    document.getElementById('popup2').style.display = 'flex';
    document.getElementById('yes-button').onclick = function() {
      removeItem(id)
    }
  }

  function closePopup2(){
    document.getElementById('popup2').style.display = 'none';
  }

  function removeItem(id){
    console.log(userData.Answer.filter(item => item.id !== id))

    let newData = {
      Answer: userData.Answer.filter(item => item.id !== id)
    }

    try {
      fetch(`https://cms.pdapedia.nl/api/items/${page.id}?populate=*`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: newData,
        }),
      })
      .then(response => response.json())
      .then(setLoading(false))
      .then(location.reload());
    } catch (err) {
      console.log('err', err);
      setError(err.response.data.message);
      setLoading(false);
    } 
  }


  return (
    <Layout homepage={homepage}>
      <a className="back" href="/">Back to home</a>
      <div className="content2">
          {page.attributes.Answer?.map((item, i) => {
            return(
              <div className="wrapper2" id={`wrapper${i}-0`}>
                <div className="delete-button" onClick={() => openPopup2(item.id)}>X</div>
                <Item answer={item} i={i} j={'0'}/>
              </div>
            )
          })}
        </div>
      <h1>  {page.attributes.Fullname}</h1>
      <div className="button open-popup" onClick={openPopup}>Answer prompt</div>

      <div id="popup" className="submit-page popup" ref={submitPage}>
        <form onSubmit={handleSubmit}>
          <div className="close" onClick={closePopup}>X</div>
          <label>
            <input id="hidden" type="number" value={items[randomNumber].id}/>
            <h2 id={items[randomNumber].id}>{items[randomNumber].attributes.prompt}</h2>
            Answer:
            <textarea id="text" type="text" name="Answer_Text"></textarea>
            <br/>
            Link:
            <input id="link" type="url" name="Answer_Link" />
            <br/>
            Image:
            <input id="answer_image" type="file" accept="image/*"/>
          </label>
          <br /><br />
          <div className="error">{error}</div>
          <div className="flex">
            <button className="button">Submit</button>
            <div className="space"></div>
          </div>
        </form>
        {loading && "Loading..."}
      </div>
      <div className="print-button" onClick={print}>Print</div>
      <div className="popup" id="popup2">
          <form>
            <h2>Are you sure you want to delete this item?</h2><br/>
            <div className="flex">
              <button className="button" id={`yes-button`}>Yes</button>
              <button className="button" onClick={closePopup2}>No</button>
          </div>
          </form>
      </div>
    </Layout>
  )
}


export async function getServerSideProps({ params }) {
  const pagesRes = 
    await fetchAPI( `/items?filters[slug][$eq]=${params.slug}&populate[Answer][populate]=*&populate=*`
  );

  const homepageRes = await fetchAPI("/homepage?populate=*");

  const promptsRes = await fetchAPI("/prompts?populate=*");

  return {
    props: { 
      page: pagesRes.data[0], 
      items: promptsRes.data,
      homepage: homepageRes.data
    },
  };
}


export default Page
