import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = (props) => {
    const navigate=useNavigate()
    const {Component}=props;
    useEffect(()=>{
        let login=localStorage.getItem('login');
        if (login !== 'true') {
            navigate('/signin');
          }
        console.log(login)
       

    },[])
  return (
    <div>

        {Component}
      
    </div>
  )
}

export default ProtectedRoute;
