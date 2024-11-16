
import { Form, Input, Flex, Button, Checkbox } from 'antd'
import './index.scss'
// comment done
// destruct switchToSignUp property 
export default function SignIn({ switchToSignUp }) {

    return (
        <>
            <div className='sign-in-form-row'>
                <Form.Item>
                    <h2>Sign In</h2>
                </Form.Item>
            </div>
            <div className='sign-in-form-row'>
                <Form.Item
                    label="Username"
                    name="username"
                    // input rules calibration is in order break
                    rules={[
                        {
                            required: true,
                            message: 'Your username is needed!',
                        },
                        {

                            pattern: /^[a-zA-Z0-9]{5,16}$/,
                            message: "please input correct user name!"
                        }
                    ]}
                    className="sign-in-form-item"
                >
                    <Input size="large" className="form-input" placeholder="please input username" />
                </Form.Item>
            </div>
            <div className='sign-in-form-row'>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input correct password!',
                        },
                        {
                            pattern: /^[a-zA-Z0-9]{5,16}$/,
                            message: "please input correct password!"
                        }
                    ]}
                    className="sign-in-form-item"
                >
                    <Input size="large" className="form-input" type="password" placeholder="please input password" />
                </Form.Item>
            </div>
            <div className='sign-in-form-row'>
                <Form.Item
                    className="sign-in-form-item"
                >
                    <Flex justify="space-between" align="center">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox className='remember-me' >Remember me</Checkbox>
                        </Form.Item>
                        <a href="link " >Forgot password?</a>
                    </Flex>
                </Form.Item>
            </div>
            {/* sign in button */}
            <div className='sign-in-form-row'>
                <Form.Item
                    className="sign-in-form-item"
                >
                    {/* push submit will trigger calibrate logic set in form.item attribute */}
                    <Button className='button' type="primary" htmlType="submit" size="large" block>
                        Sign in
                    </Button>
                </Form.Item>
            </div>
            <div className='sign-in-form-row'>
                <Form.Item
                    className="sign-in-form-item"
                >
                    <Button type="text" onClick={switchToSignUp} >
                        Sign up →
                    </Button>
                </Form.Item>
            </div>
        </>
    )

}
