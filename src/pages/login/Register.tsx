import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Modal, Form, Alert, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { User, useUserDispatch, USER_LOGIN } from '../../contexts/userContext';

const SIGNIN_MUTATION = gql`
  mutation signUp($email: String!, $pass: String!) {
    createUser(email: $email, password: $pass) {
      id
      token
      roles {
        role
        id
      }
    }
  }
`;

export const Register: React.FC<{ show: boolean; onHide: () => void }> = ({
  show,
  onHide: doHide
}) => {
  const [email, setEmail] = useState("ahoj");
  const [pass, setPass] = useState("ahoj");
  const [copy, setCopy] = useState("");

  const history = useHistory()
  const dispatch = useUserDispatch()

  const [signIn, { loading, data, error }] = useMutation(SIGNIN_MUTATION, {
    errorPolicy: "none",
    onCompleted: (data) => {
      console.log('e,c',data)
      if(data.createUser){
        dispatch({
          type: USER_LOGIN,
          user: data.createUser as User
      })
      onHide()
      history.push('/dashboard')
      } else {
        setInvalidEmail(true)
      }
      
    },
    onError: () => {
      console.log('onError',data)
      setInvalidEmail(true)
    }
  });

  const [invalidEmail, setInvalidEmail] = useState(false);
  
  const [invalidPass, setInvalidPass] = useState(false);
  const [validPass, setValidPass] = useState(false);

  const [invalidCopy, setInvalidCopy] = useState(false);

  const onRegister = async () => {
    if(pass != copy) {
      setInvalidCopy(true)
      return 
    }

    signIn({ variables: { email, pass } })
  };

  const onHide = () => {
    setPass("");
    setCopy("");
    doHide();
  };

  const onEmailChange = (event: any) => {
    setEmail(event.target.value);
    setInvalidEmail(false);
  };

  const onPasswordChange = (event: any) => {
    const pass = event.target.value as string
    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    setValidPass(regularExpression.test(pass))

    setPass(pass);
    setInvalidEmail(false);
    setInvalidPass(false);
  };

  const onCopyChange = (event: any) => {
    const c = event.target.value
    setCopy(c)
    setInvalidEmail(false)
    setInvalidPass(false)

    if(c == pass){
      setInvalidCopy(false)
    }
  };

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
            {invalidEmail && (
              <Alert variant={"danger"}>Email is probably taken, did you <Link to="/forgotten-password">forgotten password</Link>?</Alert>
            )}
            {invalidCopy && (
              <Alert variant={"danger"}>The retyped password is not the same</Alert>
            )}
          </div>

          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={onEmailChange}
                value={email}
                isInvalid={invalidEmail}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={onPasswordChange}
                value={pass}
                isInvalid={invalidPass}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Re-Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Retype Password"
                onChange={onCopyChange}
                value={copy}
                isInvalid={invalidCopy}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={() => onRegister()}>
            Register
          </Button>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;
