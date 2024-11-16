
import { Form, Input, Button } from 'antd'
import './index.scss'

export default function SignUp({ switchToSignIn }) {

    return (

        <>
            <div className='sign-up-form-row'>
                <Form.Item>
                    <h2>Sign Up</h2>
                </Form.Item>
            </div>
            <div className='sign-up-form-row'>
                <Form.Item label="Username:"
                    name="username"
                    // calibration is  in order break
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
                    className="sign-up-form-item"
                >
                    <Input size="large" placeholder="please input username" />
                </Form.Item>
            </div>
            <div className='sign-up-form-row'>
                <Form.Item label="Password:"
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
                    className="sign-up-form-item"
                >
                    <Input size="large" type="password" placeholder="please input password" />
                </Form.Item>
            </div>
            <div className='sign-up-form-row'>
                <Form.Item label="RePassword:"
                    name="rePassword"
                    rules={[
                        {
                            required: true,
                            message: 'Please re-input correct password!',
                        },
                        {
                            pattern: /^[a-zA-Z0-9]{5,16}$/,
                            message: "please input correct password!"
                        },
                        // validate whether the same as input password
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                    className="sign-up-form-item"
                >
                    <Input size="large" type="password" placeholder="please re-input password" />
                </Form.Item>
            </div>
            {/* sign up button */}
            <div className='sign-up-form-row'>
                <Form.Item
                    className="sign-up-form-item"
                >
                    {/* push submit will trigger calibrate logic set in form.item attribute */}
                    <Button className="button" type="primary" htmlType="submit" size="large" block>
                        Sign up
                    </Button>
                </Form.Item>
            </div>
            <div className='sign-up-form-row'>
                <Form.Item
                    className="sign-up-form-item"
                >
                    <Button type="text" onClick={switchToSignIn}>
                        ←Sign in
                    </Button>
                </Form.Item>
            </div>
        </>

    )

}