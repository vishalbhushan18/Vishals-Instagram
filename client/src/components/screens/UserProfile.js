import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom' 

const Profile = ()=> {
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch}  = useContext(UserContext)
    const {userid} = useParams()
    const [showFollow,setShowFollow] = useState(state?!state.following.includes(userid):true)

// console.log(userid)
     useEffect(()=> {
     fetch(`/user/${userid}`, {
 headers: {
     "Authorization":"Bearer "+localStorage.getItem("jwt")
 }
     }).then(res=>res.json())
     .then(result=>{
        //  console.log(result)
         setProfile(result)
        //  setPics(result.mypost)
     })
 },[])


const followUser = () => {
    fetch('/follow', {
        method:"put",
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body: JSON.stringify({
           followId:userid 
        })
    }).then(res=> res.json())
    .then(data=>{
        // console.log(data)
        dispatch({type:"UPDATE",
        payload:{following:data.following,
            followers:data.followers
        }})
 localStorage.setItem("user",JSON.stringify(data))
  setProfile((prevState)=> {
      return {
          ...prevState,
          user:{
              ...prevState.user,
              followers:[...prevState.user.followers,data._id]
          }
      }
  })
  setShowFollow(false)
    })
}


const unfollowUser = () => {
    fetch('/unfollow', {
        method:"put",
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body: JSON.stringify({
           unfollowId:userid 
        })
    }).then(res=> res.json())
    .then(data=>{
        // console.log(data)
        dispatch({type:"UPDATE",
        payload:{following:data.following,
            followers:data.followers
        }})
 localStorage.setItem("user",JSON.stringify(data))
 
 setProfile((prevState)=> {
    const newFollowers =  
    prevState.user.followers.filter(item=> item!=data._id)
      return {
          ...prevState,
          user:{
              ...prevState.user,
              followers:newFollowers
          }
      }
  })
  setShowFollow(true)
    })
}

    return (
         <>
         {userProfile ? 
         
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
        <img style={{width:"200px",borderRadius:"80px"}}
        src={userProfile.user.pic}
        />
    
    </div>
    <div>
        <h4> {userProfile.user.name} </h4>
        <h5> {userProfile.user.email} </h5>
    <div style={{display:"flex",justifyContent:"space-between",
    width:"108%"}}>
    <h6>{userProfile.posts.length} Post(s)</h6>
    <h6>{userProfile.user.followers.length} Follower(s)</h6>
    <h6>{userProfile.user.following.length} Following</h6>
    </div>

{showFollow?
    <button className="btn btn-block waves-effect"
    onClick={()=>followUser()}
    >
   Follow
</button>
:
<button className="btn btn-block waves-effect"
onClick={()=>unfollowUser()}
>
Unfollow
</button>
}

    </div>
    </div>
          
          <div className="gallery">
    {
        userProfile.posts.map(item =>{
            return(
                <img key={item._id} className="item" src={item.photo} alt={item.title}/>
    
            )
        })
    }
    
             
    </div>
           </div>
        


        : <h2>loading!!!</h2>
        }

        </>
    )
}

export default Profile