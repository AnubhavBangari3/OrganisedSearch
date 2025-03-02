import {React,useState} from 'react'
import { Box, Button, TextField, Typography, Card, CardContent, Grid, Divider } from '@mui/material';
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
                   
                   <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{ backgroundColor: "#f5f5f5", padding: 3 }}
        >
            <Card sx={{ maxWidth: 500, padding: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Register Page
                    </Typography>
                    <Divider sx={{ marginBottom: 3 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Username"
                                id="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                id="firstName"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                id="lastName"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                id="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                id="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm Password"
                                id="ConfirmPassword"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {(username && email && first_name && last_name && password && password2) ? (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    onClick={registerBtn}
                                    disabled={password !== password2}
                                >
                                    <b>Register</b>
                                </Button>
                            ) : (
                                <Button fullWidth variant="contained" color="error" disabled>
                                    <b>Please fill all the details</b>
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    history.push('/');
                                    window.location.reload();
                                }}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
          </div>
  )
}
