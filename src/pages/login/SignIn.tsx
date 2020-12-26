import React, { useState, useContext } from 'react'
import gql from 'graphql-tag'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useHistory } from "react-router-dom";
import { User, useUserDispatch, USER_LOGIN } from '../../contexts/userContext';
import { Modal, Form, Button, Alert } from 'react-bootstrap'

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

export const SignIn: React.FC<{ show: boolean, onHide: () => void }> = ({ show, onHide: doHide }) => {
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

    return (
        <div>
            <Modal show={show} onHide={onHide}>
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
            </Modal>


        </div>
    )
}

export default SignIn