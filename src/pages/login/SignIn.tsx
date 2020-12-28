import React, { useState, useContext } from 'react'
import gql from 'graphql-tag'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useHistory } from "react-router-dom";
import { User, useUserDispatch, USER_LOGIN } from '../../contexts/userContext';
import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, makeStyles, TextField, Typography } from '@material-ui/core';


const LOGIN_QL = gql`
  query Login($email: String!, $pass: String!) {
    login(email: $email, password:$pass) {
      id,
      token,
      email,
      roles {
        role,
        id
      }
    }
}
`;

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  

export const SignIn: React.FC<{ show: boolean, onHide: () => void }> = ({ show, onHide: doHide }) => {
    const classes = useStyles();
    const [email, setEmail] = useState(localStorage.getItem('user.email') as string)
    const [pass, setPass] = useState('')

    const [invalidEmail, setInvalidEmail] = useState(false)
    const [invalidPass, setInvalidPass] = useState(false)

    const history = useHistory()
    const dispatch = useUserDispatch()

    const [login, { loading, data, error }] = useLazyQuery(LOGIN_QL, {
        onCompleted: (d) => {
            dispatch({
                type: USER_LOGIN,
                user: d.login as User
            })
            onHide()
            history.push('/dashboard')
        }, onError: (error) => {
            setInvalidEmail(true)
            setInvalidPass(true)
            setPass('')
        }
    });

    const onLogin = async () => {
        login({ variables: { email, pass } })
    }

    const onEmailChange = (event:any) => {
        setEmail(event.target.value)
        setInvalidEmail(false)
        setInvalidPass(false)
    }

    const onPasswordChange = (event:any) => {
        setPass(event.target.value)
        setInvalidEmail(false)
        setInvalidPass(false)
    }

    const onHide = () => {
        setPass('')
        setInvalidEmail(false)
        setInvalidPass(false)
        doHide()
    }
    // https://material-ui.com/getting-started/templates/sign-up/
    return (
        
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={onEmailChange} value={email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={onPasswordChange} value={pass}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => onLogin()}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>

           

    )
}

 /* <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <div>
                        <Modal.Title>SigIn</Modal.Title>
                    </div>
                    
                </Modal.Header>

                <Modal.Body>
                    {loading && <div>Loading...</div>}
                    <div>
                        {invalidPass && <Alert variant={'danger'}>Email or password is not valid</Alert>}
                    </div>

                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={onEmailChange} value={email} isInvalid={invalidEmail}/>
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={onPasswordChange} value={pass} isInvalid={invalidPass} />
                        </Form.Group>
                        
                       
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={() => onLogin()}>SigIn</Button>
                    <Button variant="secondary" onClick={onHide}>Close</Button>
                </Modal.Footer>
            </Modal> */

export default SignIn