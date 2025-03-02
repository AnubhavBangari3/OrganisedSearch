import React,{useState,useEffect} from 'react';
import {useCookies} from 'react-cookie';
import { Box, Button, TextField, Typography, Card, CardContent, CardActions, Divider, Alert  } from "@mui/material";

import {useHistory} from 'react-router-dom';


export default function Login() {
        let history=useHistory();
      
        const [username,setUsername]=useState("")
        const [password,setPassword]=useState("")
        const [token,setToken]=useCookies(["access_token"])
        const [tokenR,setTokenR]=useCookies(["refresh_token"])

        const [loginError, setLoginError] = useState(false);


        const loginBtn  =async () =>{

                const response = await fetch('http://127.0.0.1:8000/api/token/',{
                method:'POST',
                headers:{
                        'Content-Type':'application/json',
                },
                body:JSON.stringify({username,password})
                })
                const resp = await response.json();
                
              
                console.log("resp:",resp)
                if (response.ok && resp.access) 
                {
                        setToken("access_token", resp.access);
                        setTokenR("refresh_token", resp.refresh);
                        history.push('/main/')
                        setTimeout(() => {
                                
                                window.location.reload();
                                }, 5000);
                
                     
                }
                else{
                        setUsername('');
                        setPassword('');
                        setLoginError(true);
                }
              
               
        }


  return (
          <div className="login">
                 <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                sx={{ backgroundColor: "#f5f5f5", padding: 2 }}
            >
                <Card sx={{ maxWidth: 400, padding: 3, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h4" component="h1" align="center" gutterBottom>
                            Login Page
                        </Typography>
                        <Divider sx={{ marginBottom: 3 }} />
                        
                        {loginError && (
                            <Alert severity="error" sx={{ marginBottom: 2 }}>
                                Incorrect username or password. Please try again.
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </CardContent>
                    <CardActions sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={loginBtn}
                            disabled={!username || !password}
                            sx={{ padding: 1 }}
                        >
                            <b>LOGIN</b>
                        </Button>
                        <Button
                            variant="outlined"
                            color="success"
                            fullWidth
                            onClick={() => {
                                history.push("/register/");
                                window.location.reload();
                            }}
                            sx={{ padding: 1 }}
                        >
                            Register
                        </Button>
                    </CardActions>
                </Card>
            </Box>
          </div>
  )
}
