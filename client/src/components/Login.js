import React from 'react'
import { useState } from 'react';

const Login = ({onLogin}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(email,password)
    
  }

  const handleSuccessfulLogin = (user) => {
    onLogin(user)
  }
  const handleFailureLogin = () => {
    alert('Failure')
  }

  const authenticateUser = async (email, password) => {
    const userData = await fetch('users.json').then(res=>res.json())
    return userData.some(user => user.email === email && user.password === password)
  }

  

  const handleLogin = async (email,password) => {
    const userExists = await authenticateUser(email,password)
    if (userExists) {
      handleSuccessfulLogin(email)
    } else {
      handleFailureLogin()
    }
  }


  return (
    <main className='p-3 container d-flex flex-column justify-content-center align-items-center min-vh-100'>
    <div className='border p-2 fs-1 text-uppercase border-5 border-black'>
      <p className='mb-0 logo'>Open</p>
      <p className='mb-0 logo'>Rec!!!</p>
    </div>
      
      <form onSubmit={handleSubmit} className='w-50 d-flex flex-column'>
        <div className="mb-3">
          <label>Email Address</label>
          <input type="email" value={email} name="" id="" className="form-control" onChange={e=>setEmail(e.target.value)} />  
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} name="" id="" className="form-control" />  
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
  </main>
  )
}

export default Login