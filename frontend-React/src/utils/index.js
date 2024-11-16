// export all methods within utils category to this portal index file

import { http as request } from './request'
import { setToken, getToken, removeToken } from './token'
export {
    request,
    setToken,
    getToken,
    removeToken
}