import "./bodyheader.css"
import {Link} from 'react-router-dom'   
import { MdKeyboardArrowRight } from "react-icons/md";

const Bodyheader = ({title}) => {
  return (
    <>
        <div className="b-header-bg">
            <div className="page-title">
                <h2>{title}</h2>
                <div className="ul-links">
                <ul>
                    <li>
                        <Link to='/Home'>Home</Link>
                    </li>    
                       <li><MdKeyboardArrowRight/></li>
                    <li>  
                        <Link to=''>{title}</Link>
                    </li>
                </ul>
                </div>
            </div>
        </div>
    </>
  )
}

export default Bodyheader;