import { Card, Form, Input, Button, message } from "antd"
import './index.scss'
import { useSelector, useDispatch } from 'react-redux'
import { userInfoUpdateService } from "src/api/user"
import { useEffect, useState } from "react"
import { fetchUserInfo } from '@/store/modules/user'

const UserInfo = () => {
    // import and destruct user info data from redux
    const { id: userId, username, nickname, email } = useSelector(state => state.user.userInfo)

    const [userInfo, setUserInfo] = useState({
        nickname: nickname ? nickname : null,
        email: email ? email : null
    })

    // update nickname or email state within this page
    useEffect(() => {
        setUserInfo(() => ({
            nickname: nickname,
            email: email,
        }))
    }, [nickname, email])

    const dispatch = useDispatch()
    const [userInfoForm] = Form.useForm()
    // prefill user info form data
    userInfoForm.setFieldsValue({
        nickname: userInfo.nickname,
        email: userInfo.email
    })

    // submit user update info
    const handleFinish = async (updatedForm) => {
        const { nickname, email } = updatedForm
        const updateForm = {
            id: userId,
            nickname: nickname,
            email: email

        }
        try {
            const response = await userInfoUpdateService(updateForm)
            if (response.code === 0) {
                message.success("user info updated.")
            }

        } catch (error) {
            console.error('Error updating user info: ', error);
        }

        setUserInfo(updateForm)
        // update user info in redux store 
        dispatch(fetchUserInfo())

    }

    return (
        <Card className="user-info-form">
            <div className="header">
                <span>Profile</span>
            </div>

            <Form onFinish={handleFinish} // submit form data by button html type = submit
                form={userInfoForm}
                className="info-form"
            >

                <div className="form-row" >
                    <Form.Item
                        name="username"
                        size="large"
                        label="Username"
                        className="user-form-item"
                    >
                        <Input className="form-input" disabled placeholder={username} />
                    </Form.Item>
                </div>

                <div className="form-row">
                    <Form.Item
                        name="nickname"
                        size="large"
                        label="Nickname"
                        rules={[
                            {
                                required: true,
                                message: 'Please input nickname',
                            },
                            {
                                pattern: /^[a-zA-Z0-9]{5,16}$/,
                                message: "please input correct nick name!"
                            }
                        ]}
                        className="user-form-item"

                    >
                        <Input className="form-input" placeholder="input your nickname" />
                    </Form.Item>
                </div>

                <div className="form-row">
                    <Form.Item
                        name="email"
                        size="large"
                        label="E-mail"
                        rules={[
                            {
                                required: true,
                                message: 'Please input email address',
                            },
                            {
                                type: "email",
                                message: 'email is invalid'
                            }
                        ]}
                        className="user-form-item"
                    >
                        <Input className="form-input" placeholder="input your email" />
                    </Form.Item>
                </div>

                <div className="form-row">
                    <Form.Item
                        className="button-row"
                    >
                        {/* submit triggers onFinish */}
                        <Button className='button' type="primary" htmlType="submit" size="medium" block>
                            Submit Change
                        </Button>
                    </Form.Item>
                </div>

            </Form>

        </Card>
    )

}

export default UserInfo