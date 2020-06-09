import React,{useState,useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = ()=> {
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
   
    useEffect(()=>{
if(url) {
    uploadFields()
}
    })

const uploadPic =  ()=> {
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset","insta-clone")
    data.append("cloud_name","accenturevishalbhushan")
    fetch("https://api.cloudinary.com/v1_1/accenturevishalbhushan/image/upload", {
      method:"post",
      body:data
    })
    .then(res=>res.json())
    .then(data=> {
    //   console.log(data)
      setUrl(data.url)
    })
    .catch(err=> {
      console.log(err)
    })
}  

const uploadFields = ()=> {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: "Invalid email",
              classes:"#c62828 red darken-3"
              }) 
              return
      }
      fetch("/signup", {
          method:"post",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
              name,
              password,
              email,
              pic:url
          })
      }).then(res=>res.json())
      .then(data=> {
          if(data.error) {
       M.toast({html: data.error,
      classes:"#c62828 red darken-3"
      })
          }
  
          else {
              M.toast({html: data.message,
                  classes:"#43a047 green darken-1"
                  }) 
                  M.toast({html: "Email sent! Please check spam if not in inbox.",
                    classes:"#43a047 green darken-1"
                    }) 

                  history.push('/signin')
          }
      }).catch(err=>{
          console.log(err)
      })
}
const PostData =()=> {

    if(image){
        uploadPic()
    }

    else{
        uploadFields()
    }

}

    return (
        <div className="myCard">
            <div className="card auth-card input-field">
        <h2 className="app-title">Vishal's Instagram</h2>
     
        <input id="name" type="text" 
        placeholder="Name"
        value={name}
        onChange={(e)=> setName(e.target.value)} 
        className="validate"/>

          <input id="email" type="text"
           placeholder="Email" 
           value={email}
        onChange={(e)=> setEmail(e.target.value)} 
           className="validate"/>
              
          <input id="password" type="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)} 
          placeholder="Password" className="validate"/>
       
       <div className="file-field input-field">
      <div className="btn">
        <span>Upload Profile Picture</span>
        <input type="file"
        onChange={(e)=> setImage(e.target.files[0])} />
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
    </div>

        <button className="btn btn-block waves-effect"
        onClick={()=>PostData()}
        >
              Sign up
        </button>
        
       <h6> Already have an account? 
           <Link to="/signin"> <b>Sign in</b></Link>
           </h6>


        </div>
        </div>
    )
}

export default Signup