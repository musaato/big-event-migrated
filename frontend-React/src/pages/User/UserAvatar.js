import { Card, Row, Col, Button, Upload, Image, message } from "antd"
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'
import avatar from '@/assets/default.png'
import { useEffect, useState } from "react";
import { getToken } from "@/utils"
import { userAvatarUpdateService } from "src/api/user"
import { fetchUserInfo } from '@/store/modules/user'
import './index.scss'

const UserAvatar = () => {
    // fetch token from client local storage
    const token = getToken()
    const [updateAvatarState, setUpdateAvatarState] = useState(false)
    const [imageList, setImageList] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const dispatch = useDispatch()

    // destruct avatar userPic from redux
    const { userPic } = useSelector(state => state.user.userInfo)
    //console.log("imageList Or userPic: ", imageList.response ? imageList.response : userPic)

    // set avatar preview <Image> tag by image fetched from new uploaded or redux
    useEffect(() => {
        console.log("use image from redux user info.")
        setImageUrl(userPic) //"https://s3-object-storage.s3.ap-northeast-1.amazonaws.com/0a703064-c940-4d11-b003-8c00fa65676d.jpg"
    }, [userPic])

    const onChange = (value) => {
        // this state-change will ensure <upload> keep uploading until completed.
        setImageList(value.fileList)

        // judge wether upload is completed or not by status, otherwise keep returning.
        if (value.fileList[0].status === "done") {
            const newImgUrl = value.fileList[0].response.data
            setImageUrl(newImgUrl) // update <Image> tag src by newly uploaded image url.
            setUpdateAvatarState(true) // set avatar update state to true
        } else { return }
    }

    // confirm upload avatar to backend and update user info property "userPic" in redux.
    const updateAvatar = async () => {

        // only newly uploaded image will be allowed to submit update request.
        if (updateAvatarState === true) {

            try {
                const result = await userAvatarUpdateService(imageUrl)
                console.log("update avatar result: ", result)
                message.success((result.code === 0) ? "your avatar updated." : "avatar update failed.")
                setUpdateAvatarState(false)
            } catch (error) {
                console.error("Error occurred during updating avatar: ", error)
            }
            // update user info in redux
            dispatch(fetchUserInfo()) // need to invoke this to update layout avatar(top right)
        } else {
            message.info("select a new image to update.")
        }
    }

    return (
        <Card className="user-avatar-form">
            <div className="header">
                <span>Change Avatar</span>
            </div>
            <Row>
                <Col>
                    <Upload
                        className="avatar-uploader"
                        name="file"
                        action="/api/file/upload"
                        listType="picture-card"
                        headers={{
                            Authorization: `${token}`
                        }}
                        maxCount={1}
                        fileList={imageList}
                        onChange={onChange}
                        showUploadList={false}
                    >
                    </Upload>
                    <div
                        className="rounded-image"
                    >
                        {imageUrl ? (
                            <Image src={imageUrl}
                                className="image-preview"
                            />
                        ) : (
                            <Image src={avatar} />
                        )}
                    </div>
                    <br />
                    <div>
                        <Button
                            type="primary"
                            // invoke <Upload>
                            onClick={() => document.querySelector('.avatar-uploader input[type="file"]').click()}
                            icon={<PlusOutlined />}
                        >
                            Select image
                        </Button>
                        <Button
                            type="primary"
                            style={{ backgroundColor: 'green', borderColor: 'green' }}
                            onClick={updateAvatar}
                            icon={<UploadOutlined />}
                            htmlType="submit"
                        >
                            Upload avatar
                        </Button>
                    </div>
                </Col>
            </Row>
        </Card>
    )

}

export default UserAvatar