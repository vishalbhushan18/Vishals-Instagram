import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile = ()=> {
    const [mypics,setPics] = useState([])
    const {state,dispatch}  = useContext(UserContext)
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

 useEffect(()=> {
     fetch('/mypost', {
 headers: {
     "Authorization":"Bearer "+localStorage.getItem("jwt")
 }
     }).then(res=>res.json())
     .then(result=>{
        //  console.log(result)
         setPics(result.mypost)
     })
 },[])

useEffect(() => {
 if(image) {
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
     localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
    dispatch({type:"UPDATEPIC", payload:data.url})
    
    // fetch('updatepic',{
    //      method:"put",
    //      headers:{
    //          "Content-Type":"application/json",
    //          "Authorization":"Bearer "+localStorage.getItem("jwt")
    //      },
    //      body: JSON.stringify({
    //          pic:data.url
    //      })
    //  }).then(res=>res.json())
    //  .then(result=>{
    //      console.log(result)
    //      localStorage.setItem("user", JSON.stringify({...state,pic:result.pic}))
    //  dispatch({type:"UPDATEPIC", payload:result.pic})
    //     })
})
    .catch(err=> {
      console.log(err)
    }) 
 }
},[image])

const updatePhoto = (file)=> {
    setImage(file)
  
}

    return (
       <div style={{        
        margin:"30px auto"
    }}>

<div style={{
    display:"flex",
    justifyContent:"space-around",
    margin:"18px 0px",    
    maxWidth:"550px",
    margin:"0px auto"
}}>
<div>
    <img style={{width:"200px",borderRadius:"50%"}}
    src={state?state.pic:"loading"}
    />

</div>
<div><h4> {state?state.name:"loading"} </h4>
<h5> {state?state.email:"loading"} </h5>
<div style={{display:"flex",justifyContent:"space-between",
width:"108%"}}>
<h6>{mypics.length} posts</h6>
<h6>{state?state.followers.length:"loading"} followers</h6>
<h6>{state?state.following.length:"loading"} following</h6>
</div>

<div className="file-field input-field">
      <div className="btn">
        <span>Update Profile Picture</span>
        <input type="file"
        onChange={(e)=> updatePhoto(e.target.files[0])} />
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
    </div>

</div>
</div>


      <div className="gallery">
{
    mypics.map(item =>{
        return(
            <img key={item._id} className="item" src={item.photo} alt={item.title}/>

        )
    })
}

         
</div>
       </div>
    )
}

export default Profile