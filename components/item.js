import Image from "./image";

const Item = ({ answer, i, j}) => {

  let counter = 2;
  
  function placeAbove(event){
    
    if (event.target.parentElement.id){
      counter++
      document.getElementById(event.target.parentElement.id).style.zIndex = counter;
    }
    if (event.target.id){
      counter++
      document.getElementById(event.target.id).style.zIndex = counter;
    }
    if (event.target.parentElement.parentElement.parentElement.id){
      counter++
      document.getElementById(event.target.parentElement.parentElement.parentElement.id).style.zIndex = counter;
    }
    if (event.target.parentElement.children[0].checked == false){
      event.target.parentElement.parentElement.classList.add('print-active');
    }
    if (event.target.parentElement.children[0].checked == true){
      event.target.parentElement.parentElement.classList.remove('print-active');
    }
  }

  return (
    <div className="wrapper" id={`wrapper${i}-${j}`} key={`wrapper${i}`} onMouseDown={placeAbove}>
      <label className="checkbox-container">
        <input id="checkbox" type="checkbox"/>
        <span className="checkmark"></span>
      </label>
      <p>{answer.prompt.data?.attributes.prompt}</p>
      <h2>{answer.Answer_Text}</h2>
      {answer.Answer_Image.data && 
        <div className="halftone">
          <Image image={answer.Answer_Image.data}/>
        </div>
      }
      {answer.Answer_Link && 
        <a className="answer-link" href={answer.Answer_Link} target="_blank">➝ {answer.Answer_Link}</a>
      }
    </div>
  )
}

export default Item
