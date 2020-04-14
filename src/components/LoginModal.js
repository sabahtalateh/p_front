import React, { useRef } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const LoginModal = (props) => {
    const modalProps = { ...props }
    delete modalProps.onLoginAction
    delete modalProps.loggingIn
    delete modalProps.loginFailed

    const email = useRef('')
    const password = useRef('')

    const submitButton = props.loggingIn
        ? <button className="btn btn-primary" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            &nbsp;Submit
        </button>
        : <Button type="submit"
                  onClick={ () => props.onLoginAction(email.current.value, password.current.value) }>Submit</Button>

    const error = props.loginFailed &&
        <span style={ {
            marginBottom: '16px',
            display: 'block'
        } } className="help-block alert-danger">Wrong Credentials</span>

    return (
        <Modal
            { ...modalProps }
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Login
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={ (e) => {
                    e.preventDefault()
                } }>
                    <div className="form-group">
                        App has 3 predefined users
                        <br/>
                        <b>user1@mail.com</b>
                        <br/>
                        <b>user2@mail.com</b>
                        <br/>
                        <b>user3@mail.com</b>
                        <br/>
                        Passwords are <b>password</b>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input ref={ email } type="text" className="form-control" id="email"
                               placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input ref={ password } type="password"
                               className="form-control"
                               id="password" placeholder="Password"/>
                    </div>
                    { error }
                    { submitButton }
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default LoginModal
