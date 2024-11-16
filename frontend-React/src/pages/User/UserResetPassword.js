import { Card, Form, Input, Button, message, Space } from "antd"
import { userPasswordUpdateService } from "src/api/user"
import { useSelector, useDispatch } from 'react-redux'
import { fetchLogin, fetchUserInfo } from '@/store/modules/user'
import './index.scss'

const UserResetPassword = () => {
    // destruct username from redux
    const { username } = useSelector(state => state.user.userInfo)
    const [passwordUpdateForm] = Form.useForm()
    const dispatch = useDispatch()

    const handleUpdatePassword = async (values) => {

        // console.log("form values: ", values)
        // destruct form data
        const { oldPassword, newPassword, rePassword } = values
        const updateForm = {
            old_pwd: oldPassword,
            new_pwd: newPassword,
            re_pwd: rePassword
        }
        const newLoginForm = {
            username: username,
            password: newPassword
        }

        try {
            const response = await userPasswordUpdateService(updateForm)
            if (response.code === 0) { // 0 indicates success
                // use  username,new password and dispatch to fetchLogin() to fetch new token. 
                await dispatch(fetchLogin(newLoginForm))
                // invoke fetchUserInfo() to fetch latest userinfo(actually the updateTime in redux)
                dispatch(fetchUserInfo())
                //setUpdateStatus(true)
                message.success("user password updated.")

            }
        } catch (error) {
            console.log("error during password update: ", error)
        }
        // after update, reset form values
        // passwordUpdateForm.resetFields()
        handleCancel()

    }

    const handleCancel = () => {
        passwordUpdateForm.resetFields()
    }

    return (
        <Card
            className="user-reset-form"
        >
            <div className="header">
                <span>Profile</span>
            </div>
            <Form onFinish={handleUpdatePassword} // submit form data by button html type = submit
                form={passwordUpdateForm}
                className="password-form"
            >

                <div className="form-row" >
                    <Form.Item
                        name="oldPassword"
                        size="large"
                        label="Current password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input old password.',
                            },
                            {
                                pattern: /^[a-zA-Z0-9]{5,16}$/,
                                message: "please input old password."
                            }
                        ]}
                        className="form-item"
                    >
                        <Input className="form-input" type="password" placeholder="input your current password" />
                    </Form.Item>
                </div>

                <div className="form-row">
                    <Form.Item
                        name="newPassword"
                        size="large"
                        label="New password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input new password',
                            },
                            {
                                pattern: /^[a-zA-Z0-9]{5,16}$/,
                                message: "please input new password"
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    // prevent from inputting old password
                                    if (!value || getFieldValue('oldPassword') !== value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Same as old password!"));
                                },
                            }),
                        ]}
                        className="form-item"
                    >
                        <Input className="form-input" type="password" placeholder="input your new password" />
                    </Form.Item>
                </div>

                <div className="form-row">
                    <Form.Item
                        name="rePassword"
                        size="large"
                        label="Confirm new password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input new password',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    // check whether same as new password input at the first time
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("new passwords don't match!"));
                                },
                            }),
                        ]}
                        className="form-item"
                    >
                        <Input className="form-input" type="password" placeholder="input your new password again" />
                    </Form.Item>
                </div>
                <div className="form-row">
                    <Form.Item
                        className="button-row"
                    >
                        <Space>
                            <Button key="search" type="primary" htmlType="submit">
                                Change
                            </Button>
                            <Button key="reset" onClick={handleCancel}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </div>
            </Form>
        </Card>
    )

}

export default UserResetPassword