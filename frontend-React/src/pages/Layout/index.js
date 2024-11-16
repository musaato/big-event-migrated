import { Layout, Menu, Popconfirm, Dropdown, Avatar, Space, message, } from 'antd'
import {
    BookFilled,
    FileZipFilled,
    SelectOutlined,
    EditOutlined,
    LogoutOutlined,
    CaretDownOutlined,
    UserOutlined,
} from '@ant-design/icons'
import './index.scss'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import avatar from '@/assets/default.png'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserInfo, fetchUserInfo } from '@/store/modules/user'

const { Header, Content, Footer, Sider } = Layout;

const items = [
    // selectedKey matches one of selectedKeys(this array) by key, will highlight that path
    {
        label: 'ArticleCategory',
        key: '/article/category',
        icon: <BookFilled />,
    },
    {
        label: 'Article Management',
        //key: '/article/manage',
        key: '/',
        icon: <FileZipFilled />,
    },
    {
        label: 'Profile',
        key: '/sub1',
        icon: <UserOutlined />,
        children: [
            {
                key: '/user/info',
                label: 'User Info',
                icon: <UserOutlined />,
            },
            {
                key: '/user/avatar',
                label: 'Change Avatar',
                icon: <SelectOutlined />,
            },
            {
                key: '/user/resetPassword',
                label: 'Reset Password',
                icon: <EditOutlined />,
            },
        ],
    }
]

const GeekLayout = () => {

    const navigate = useNavigate()

    const onMenuClick = ({ key }) => {
        // console.log("Menu been clicked.", key)
        if (key !== "logout") {
            // console.log("none logout bottom has been activated, key is ", key)
            navigate(key)

        }
    }

    //  reverse highlight
    //  1. fetch current route path
    const location = useLocation()
    console.log("fetched by useLocation: ", location.pathname)
    const selectedKey = location.pathname
    console.log("selectedKey: ", selectedKey)

    // only execute once when this page be loaded.
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUserInfo())
    }, [dispatch])

    // fetch user info from redux store
    const { nickname, userPic } = useSelector(state => state.user.userInfo)

    const handleLogout = () => {
        console.log("you are logout");
        // clear user info and redirect to login page
        dispatch(clearUserInfo())
        message.success("You are sign out.")
        navigate('/login')

    }
    const userItems = [
        { key: '/user/info', label: 'User Info', icon: <UserOutlined />, },
        { key: '/user/avatar', label: 'Change Avatar', icon: <SelectOutlined />, },
        { key: '/user/resetPassword', label: 'Reset Password', icon: <EditOutlined />, },
        {
            key: 'logout', icon: <LogoutOutlined />,
            label: (
                <Popconfirm
                    title="Are you sure you want to log out?"
                    onConfirm={() => handleLogout()}
                    okText="Yes"
                    cancelText="No"
                ><span>Sign Out</span>
                </Popconfirm>
            ),
        },
    ]


    return (
        <Layout className="layout-container">
            {/* left Side menu */}
            <Sider width={200} className="site-layout-background">
                <div className="logo" />
                <Menu
                    mode="inline"
                    theme="dark"
                    // highlighted key, "selectedKeys" is the highlight attribute of Menu component
                    selectedKeys={selectedKey}
                    onClick={onMenuClick}
                    items={items}
                    style={{ height: '100%', borderRight: 0 }}
                >
                </Menu>
            </Sider>
            {/* right div */}
            <Layout>
                {/* header */}
                <Header className="header">
                    <div className="header-div" >Welcome! <strong>{nickname}</strong></div>
                    <Dropdown
                        placement="bottomRight"
                        dropdownRender={() => <Menu onClick={onMenuClick} items={userItems} />}
                        trigger={['hover']}
                        style={{
                            display: "flex",
                            align: "center",
                        }}
                    >
                        <Space>
                            <Avatar size="large" src={<img src={userPic ? userPic : avatar} alt="avatar" />}  /* icon={<UserOutlined />} */ />
                            <CaretDownOutlined style={{
                                color: "#999",
                                marginleft: 10
                            }} />
                        </Space>
                    </Dropdown>
                </Header>
                {/* content */}
                <Layout className="layout-content" style={{ padding: 20 }}>
                    {/* secondary route exit */}
                    <Content
                        style={{
                            margin: '0px 0px 0',
                        }}
                    >
                        <div
                            style={{
                                padding: 0,
                                minHeight: 1000,
                            }}
                        >
                            {/* render child route */}
                            <Outlet />
                        </div>
                    </Content>
                </Layout>

                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Big Event ©2024
                </Footer>
            </Layout>
        </Layout>
    )
}

export default GeekLayout