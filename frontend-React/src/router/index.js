import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import { createBrowserRouter } from 'react-router-dom'
import { AuthRoute } from '@/components/AuthRoute'
import { lazy, Suspense } from 'react'
// lazy function manages component importation, collaborate with <Suspense> below
const ArticleCategory = lazy(() => import('@/pages/Article/ArticleCategory'))
const ArticleManage = lazy(() => import('@/pages/Article/ArticleManage'))
const UserInfo = lazy(() => import('@/pages/User/UserInfo'))
const UserAvatar = lazy(() => import('@/pages/User/UserAvatar'))
const UserResetPassword = lazy(() => import('@/pages/User/UserResetPassword'))

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/",
        // if no token, then redirect by AuthRoute
        element: <AuthRoute><Layout /></AuthRoute>,

        // don't forget to add <Outlet/> in parent component(Layout/index.js)
        children: [
            {
                path: 'article/category',
                element: <Suspense fallback={'loading article category page'}><ArticleCategory /></Suspense>
            },
            {
                index: true,
                element: <Suspense fallback={'loading'}><ArticleManage /></Suspense>
            },
            {
                path: 'user/info',
                element: <Suspense fallback={'loading user info page'}><UserInfo /></Suspense>
            },
            {
                path: 'user/avatar',
                element: <Suspense fallback={'loading user avatar page'}><UserAvatar /></Suspense>
            },
            {
                path: 'user/resetPassword',
                element: <Suspense fallback={'loading reset password page'}><UserResetPassword /></Suspense>
            }
        ]
    }
])

export default router