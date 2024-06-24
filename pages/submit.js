import React, { useEffect, useState, useRef } from "react"
import Layout from "../components/layout/layout"
import { fetchAPI } from "../lib/api"
import { useRouter } from "next/router"

const Page = ({ homepage, items }) => {
  const router = useRouter();

  const [error, setError] = useState()

  const [userData, setUserData] = useState({
    slug: '',
    Fullname: '',
    Year: '',
    Email: '',
    Location: '',
  })

  const submitPage = useRef();
  const [loading, setLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    userData.slug = document.getElementById('fullname').value.replaceAll(' ', '-') + document.getElementById('year').value.replaceAll(' ', '-') + document.getElementById('location').value.replaceAll(' ', '-') 
    setLoading(true)
    
    console.log( userData.slug.length)
    if (document.getElementById('password').value == 'tile' || document.getElementById('password').value == 'tegeltje' || document.getElementById('password').value == 'plaster title'){
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
        if (userData.slug.length > 0) {
          router.push(`/${userData.slug}`)
        }
        setError(err.response.data.message);
        setLoading(false);
      } 
    } else {
      setError('wrong password');
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({...userData, [name]: value });
  }


  return (

    <div className="submit-page center-page" ref={submitPage}>
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
          E-mail adres (optional):
          <input type="text" name="Email" onChange={e => handleChange(e)} />
        </label>
         <br />
         <label>
          *What was the first assignment in ceramics?:
          <input id="password" type="password" name="password"  />
        </label>
        <br /><br />
        <div className="error">{error}</div>
        <div className="flex">
          <button className="button">Start</button>
        </div>
      </form>
      {loading && "Loading..."}
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
