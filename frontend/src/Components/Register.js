import {React,useState} from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useHistory} from 'react-router-dom';

export default function Register() {
            let history=useHistory();
            const [username,setUsername]=useState("")
            const [email,setEmail]=useState("")
            const [first_name,setFirstName]=useState("")
            const [last_name,setLastName]=useState("")
            const [password,setPassword]=useState("")
            const [password2,setPassword2]=useState("")

            const registerBtn = () => {
              fetch('http://127.0.0.1:8000/register/',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({username,email,first_name,last_name,password,password2})
            })
            .then(resp => resp.json())
            .then(() => {
             
                history.push('/')
                window.location.reload()
         
            })
            }



  return (
          <div className="register">
                   
          <Box>
          <h1>Register Page</h1>

          <TextField fullWidth label="Username" id="Username" value={username}
         onChange={e => setUsername(e.target.value)} />

        <TextField fullWidth label="First Name" id="firstName" value={first_name}
                onChange={e => setFirstName(e.target.value)} />

        <TextField fullWidth label="Last Name" id="lastName" value={last_name}
                onChange={e => setLastName(e.target.value)} />

        
          
          <TextField fullWidth label="Email"  id="Email" 
            value={email} onChange={e => setEmail(e.target.value)} />

          <TextField type="password" fullWidth label="Password" id="Password" value={password}
        onChange={e => setPassword(e.target.value)}/>
          <TextField type="password" fullWidth label="Confirm Password" id="ConfirmPassword" value={password2}
        onChange={e => setPassword2(e.target.value)}/>

          <br/>
          
          {(username && email && first_name && last_name && password && password2)
        ? <Button variant="outlined" id="registerbtn"color="success" onClick={registerBtn}  disabled={(password !== password2)}><b>Register</b></Button> :
        <Button color="error"> <b>Please fill the details</b></Button>}
         
         <br/>
          <Button variant="outlined" id="loginbtnpg" onClick={() => 
            {history.push('/')
            window.location.reload()}}>Login</Button>
                  
          </Box>
          </div>
  )
}
