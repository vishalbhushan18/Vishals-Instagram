import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = () => {
  const searchModal = useRef('')
  const [search,setSearch] = useState('')
  const [userDetails,setuserDetails] = useState([])
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
useEffect(()=> {
  M.Modal.init(searchModal.current)
},[])

  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });
  const renderList = ()=> {
    if(state){
      return [
        <li key="1"><i className="large material-icons modal-trigger" 
        data-target="modal1"
        style={{color:"black"}}>search</i></li>,
        <li key="2"><Link to="/profile">My Profile</Link></li>,
            <li  key="3"><Link to="/create">Create Post</Link></li>,
            <li  key="4"><Link to="/myfollowingposts">My Following Posts</Link></li>,
     <li  key="5">
        <button className="btn btn-logout btn-block waves-effect"
        onClick={()=>{
          localStorage.clear()
          dispatch({type:"CLEAR"})
          history.push('/signin')
        }}
        >
              Logout
        </button>
     </li>
          ]
    } else {
      return [
        <li key="6"><Link to="/signin">Signin</Link></li>,
        <li key="7"><Link to="/signup">Signup</Link></li>

      ]
    }
  }  


const fetchUsers = (query)=> {
  setSearch(query)
  fetch('/searchUsers',{
    method:"post",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      query
    })
  }).then(res=> res.json())
  .then(results=> {
    // console.log(results)
    setuserDetails(results.user)
  })
}

  return(
    <>
        <nav style={{padding:'0px 20px',backgroundColor:"white"}}>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/signin"} className="brand-logo">Vishal's Instagram</Link>
          <a href="#" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i></a>

          <ul className="right hide-on-med-and-down">
          {renderList()}
          </ul>
        </div>
      </nav>

      <ul className="sidenav sidenav-close" id="mobile-demo">
{renderList()}
</ul>

<div id="modal1" className="modal" ref={searchModal}>
    <div className="modal-content">
    <nav>
    <div className="nav-wrapper">
      <form>
        <div className="input-field">
          <input id="search" type="search"
          placeholder="Search users"
          value={search}
          onChange={(e)=>fetchUsers(e.target.value)}
          required/>
          <label className="label-icon"><i className="material-icons">search</i></label>
          <i className="material-icons">close</i>
        </div>
      </form>
    </div>
  </nav>

  <div className="collection">
    {userDetails.map(item=> {
      return <Link to={item._id !== state._id 
      ?
      "/profile/"+item._id:'/profile'
      } onClick={()=> {
        M.Modal.getInstance(searchModal.current).close()
        setSearch('')
      }}> 
      <a className="collection-item active">
        <img src={item.pic} style={{width:"5%", borderRadius:"50%"}}/><span className="name"
         style={{verticalAlign:"middle",margin:"auto 5px"}}>{item.name}</span></a>
   </Link>
    })}
      </div>

    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat"
      onClick={()=>setSearch('')}
      >Close</button>
    </div>
  </div>

</>
)
}

export default NavBar
