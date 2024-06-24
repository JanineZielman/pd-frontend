
import { BlocksRenderer } from "@strapi/blocks-react-renderer"
import { useEffect } from "react";

const Layout = ({ children, homepage }) => {

  useEffect(() => {
    var r = document.querySelector(':root');
    r.style.setProperty('--primary', homepage.attributes.PrimaryColor);
    r.style.setProperty('--secondary', homepage.attributes.SecondaryColor);
  })

  function toggleMenu() {
   document.getElementById('menu-icon').classList.toggle("change");
   document.getElementById('menu').classList.toggle("active");
  }

  return(
    <div>
      <div class="menu-icon" id="menu-icon" onClick={toggleMenu}>
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
      {children}
      <div className="menu" id="menu">
        <BlocksRenderer content={homepage.attributes.About}/>
      </div>
    </div>
  )
}

export default Layout
