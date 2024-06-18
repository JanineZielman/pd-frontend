import React, { useEffect, useState, useRef } from "react"
import Layout from "../components/layout/layout"
import { fetchAPI } from "../lib/api"
import { useRouter } from "next/router"
import { BlocksRenderer } from "@strapi/blocks-react-renderer"
import Image from "../components/image"
import axios from "axios";

const Page = ({ homepage, items }) => {
  const router = useRouter();
  console.log(items)

  const [error, setError] = useState()
  const [randomNumber, setRandomNumber] = useState(getRandomInt(items.length))

  const [userData, setUserData] = useState({
    slug: '',
    Fullname: '',
    Year: '',
    Email: '',
    Location: '',
    Answer: [
      {
        Answer_Text: '',
        Answer_Link: '',
        prompt: ''
      }
    ]
  })

  const submitPage = useRef();
  const [loading, setLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    userData.slug = document.getElementById('fullname').value.replaceAll(' ', '-') + document.getElementById('year').value.replaceAll(' ', '-') + document.getElementById('location').value.replaceAll(' ', '-') 
    setLoading(true)
    console.log(userData)
    try {
      fetch('https://cms.pdapedia.nl/api/items?populate=*', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: userData,
        }),
      })
      .then(response => response.json())
      .then(setLoading(false))
      .then(router.push(`/${userData.slug}`));
    } catch (err) {
      console.log('err', err);
      if (userData.slug) {
        router.push(`/${userData.slug}`)
      }
      // setError(err.response.data.message);
      setLoading(false);
    } 
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({...userData, [name]: value });
  }

  const handleAnswer = (e) => {
    let text = document.getElementById('text').value
    let link = document.getElementById('link').value
    let prompt_id = document.getElementById('hidden').value
    setUserData({...userData, Answer: [{Answer_Text: text,  Answer_Link: link, prompt: prompt_id }]});
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }



  return (

      <div className="submit-page" ref={submitPage}>
      <form onSubmit={handleSubmit}>
        <label>
          *Who are you?
          <input id="fullname" type="text" name="Fullname" onChange={e => handleChange(e)}  />
        </label>
        <br />
        <label>
          *In which year did you graduate?
          <input id="year" type="text" name="Year" onChange={e => handleChange(e)} />
        </label>
        <br />
        <label>
          *Where do you live?
          <input id="location" type="text" name="Location" onChange={e => handleChange(e)} />
        </label>
        <br />
        <label>
          Would you like to leave us your contact information?:
          <input type="text" name="Email" onChange={e => handleChange(e)} />
        </label>
         <br />
        <label>
          <input id="hidden" type="number" value={items[randomNumber].id}/>
          <h2 id={items[randomNumber].id}>{items[randomNumber].attributes.prompt}</h2>
          Answer:
          <textarea id="text" type="text" name="Answer_Text" onChange={e => handleAnswer(e)}></textarea>
          <br/>
          Link:
          <input id="link" type="url" name="Answer_Link" onChange={e => handleAnswer(e)} />
          <br/>
          Image:
          <input type="file" accept="image/*"/>
        </label>
        <br /><br />
        <div className="error">{error}</div>
        <div className="flex">
          <button className="button">Submit</button>
          {/* <div className="button">Another prompt</div> */}
        </div>
      </form>
      {loading && "Loading..."}
      <div className='confirmation-page'>
        yay
      </div>
    </div>

  )
}

export async function getServerSideProps(ctx) {
  const [homepageRes, itemsRes] = await Promise.all([
    fetchAPI("/homepage?populate=*"),
    fetchAPI("/prompts?populate=*"),
  ])

  return {
    props: {
      homepage: homepageRes.data,
      items: itemsRes.data
    },
  }
}

export default Page
