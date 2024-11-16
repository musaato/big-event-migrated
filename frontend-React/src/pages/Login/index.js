import './index.scss'
import { Row, Col, Form, message } from 'antd'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchLogin, fetchSignUp } from '@/store/modules/user'
import SignIn from './signIn'
import SignUp from './signUp'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    // define a state that manipulates sign-up sign-in form switch.
    const [isSignUp, setIsSignUp] = useState(false)
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const navigate = useNavigate()

    // switches sign-up sign-in state
    const handleSignUpState = () => {

        setIsSignUp(!isSignUp)
        // clear form data
        form.resetFields();
    }
    // to log the latest state, for debug use.
/*     useEffect(() => {
        console.log(" switched to Sign up?", isSignUp);
    }, [isSignUp]); */

    const onFinish = (values) => {
        if (values.rePassword) {
            // rePassword field indicates it's a sign up form
            submitSignUp(values)
            // console.log("sign up block executed")
        } else {
            // otherwise it's a sign in form
            submitSignIn(values)
            // console.log("sign in block executed")
        }
    }

    // collect sign in form values, username & password are both required  to be string.
    const submitSignIn = async (values) => {
        try {
            // If you don't try-catch in such asynchronous request, 
            // once error occur will be exposed to user view, should display it to developer.
            // fetchLogin() will get sign in data and set token to redux & local storage
            const res = await dispatch(fetchLogin(values))
            // console.log("submitSignIn", res)
            // redirect to homepage
            navigate("/")
            message.success("You're Signed in!")

        } catch (error) {
            console.log("error during SignIn: ", error)
        }
    }

    const submitSignUp = async (values) => {
        const signInForm = {
            username: values.username,
            password: values.password
        }
        // console.log("sign up form values: ", values) // signInForm
        try {
            //await dispatch(fetchLogin(values))
            const res = await dispatch(fetchSignUp(values))
            if (res.code === 0) { // 0 success, 1 failed
                // navigate("/login") // 1st way, redirect to login page after successfully sign up.
                message.success("Sign up success! Redirecting") 
                // 2nd way, redirect to home page after successfully sign up. improve user experience.
                submitSignIn(signInForm)
            }

        } catch (error) {
            console.log("error during SignUp: ", error)
        }
    }

    return (
        <>

            <Row className='login-page'>
                <Col span="12" className='bg'></Col>
                <Col span="7" offset="3" className='login-page-form' >
                    
                    <Form validateTrigger="onBlur"
                        onFinish={onFinish}
                        form={form}
                    >
                    {/* switch sign-up or sign-in form component by "isSignUp" state */}
                        {isSignUp ? <SignUp switchToSignIn={handleSignUpState} /> : <SignIn switchToSignUp={handleSignUpState} />}
                    </Form>

                </Col>
            </Row>
        </>
    )

}


