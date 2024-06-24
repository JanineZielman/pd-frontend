import { BlocksRenderer } from "@strapi/blocks-react-renderer"

const Layout = ({ children, homepage }) => {
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
