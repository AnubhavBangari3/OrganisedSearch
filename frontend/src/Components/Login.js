import React,{useState,useEffect} from 'react';
import {useCookies} from 'react-cookie';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useHistory} from 'react-router-dom';


export default function Login() {
        let history=useHistory();
      
        const [username,setUsername]=useState("")
        const [password,setPassword]=useState("")
        const [token,setToken]=useCookies(["access_token"])
        const [tokenR,setTokenR]=useCookies(["refresh_token"])

        const [loginError, setLoginError] = useState(false);


        const loginBtn = () =>{

        fetch('http://127.0.0.1:8000/api/token/',{
                method:'POST',
                headers:{
                        'Content-Type':'application/json',
                },
                body:JSON.stringify({username,password})
                })
                .then(resp => resp.json())
                .then(resp =>{
                        console.log("resp:",resp)
                        if (resp.access) 
                        {
                                setToken("access_token", resp.access);
                                setTokenR("refresh_token", resp.refresh);
                                if (token['access_token']){
                                        history.push('/main/')
                                        window.location.reload()}
                                else{
                                    
                                window.location.reload()
                                }
                        }
                })
                .catch(error=>{
                        console.log(error)
                    
                        setUsername('');
                        setPassword('');
                })
        }


  return (
          <div className="login">
                   
                    <Box>
                    <h1>Login Page</h1>

                    <TextField id="form1" fullWidth label="Username" id="Username" value={username}
          onChange={e => setUsername(e.target.value)} />

                    <TextField id="form1" type="password" fullWidth label="Password" id="Password"  value={password}
          onChange={e => setPassword(e.target.value)}/>

        {(username && password)?<Button variant="outlined" id="loginbtn" onClick={loginBtn}><b>LOGIN</b></Button>:
          <Button><b>Please fill the details</b></Button>}

        <br/>
        <Button variant="outlined" id="registerpagebtn" color="success" onClick={() => 
        {history.push('/register/')
            window.location.reload()}}>Register</Button>
            
        </Box>
          </div>
  )
}
