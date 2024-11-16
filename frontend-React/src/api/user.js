import { request } from "@/utils"

// 1.1 sign in service
/*         request params 
    Format: x-www-form-urlencoded
    Param       Type    Necessary   Note
    username   string      Y        length 5-16 not null
    password   string      Y        length 5-16 not null 
*/

/*         response data
    Format: application/json
    Attr    Type    Necessary  Note
    code    number     Y       0: success, 1: failed
    msg     string     N
    data    object     Y       JWT 
*/
export const userSignInService = (signInForm)=>{
    const params = new URLSearchParams();
    for(let key in signInForm){
        params.append(key,signInForm[key])
    }
    return request.post('/user/login',params)
}

// 1.2 sign up service.
/*         request params 
    Format: x-www-form-urlencoded
    Param       Type    Necessary   Note
    username   string      Y        length 5-16 not null
    password   string      Y        length 5-16 not null 
*/

/*         response data
    Format: application/json
    Attr    Type    Necessary  Note
    code    number     Y       0: success, 1: failed
    msg     string     N
    data    object     N       JWT 
*/
export const userSignUpService = (signUpForm)=>{
   const params = new URLSearchParams()
   for (let key in signUpForm) {
    params.append(key, signUpForm[key]);
   } 
   return request.post("/user/register", params)
}

// 2.1 fetch user info
/*             request params: null */
/*             response data
    Format: application/json
    Attr        Type    Necessary  Note
    code        number     Y       0: success, 1: failed
    msg         string     N
    data        object     Y       user info data 
     || 
    {id         number     N
     username   string     N
     password   string     N
     nickname   string     N
     email      string     N
     userPic    string     N
     createTime string     N
     updateTime string     N
      }  
*/
export const userInfoService = ()=>{
    return request.get('/user/userInfo')
}


// 2.2 update user info
/*         request params 
    Format: application/json
    Param       Type    Necessary   Note
    id         number      Y        user id
    username   string      N        length 5-16 not null
    password   string      Y        length 5-16 not null 
    email      string      Y        email format 
*/

/*         response data
    Format: application/json
    Attr    Type    Necessary  Note
    code    number     Y       0: success, 1: failed
    msg     string     N
    data    object     N        
*/

export const userInfoUpdateService = (userInfoForm) => {
    return request.put('/user/update', userInfoForm)
}

// 2.3 update user avatar
/*         request params 
    Format: queryString
    Param       Type    Necessary   Note
    avatarUrl   string      Y        
*/

/*         response data
    Format: application/json
    Attr    Type    Necessary  Note
    code    number     Y       0: success, 1: failed
    msg     string     N
    data    object     N        
*/
export const userAvatarUpdateService = (avatarUrl) => {
    const params = new URLSearchParams();
    params.append('avatarUrl', avatarUrl)
    return request.patch('/user/updateAvatar', params)
}

// 2.4 update user password
/*         request params 
    Format: application/json
    Param       Type    Necessary   Note
    old_pwd   string      Y         length 5-16 not null
    new_pwd   string      Y         length 5-16 not null
    re_pwd    string      Y         length 5-16 not null
*/

/*         response data
    Format: application/json
    Attr    Type    Necessary  Note
    code    number     Y       0: success, 1: failed
    msg     string     N       
    data    object     N       
*/
export const userPasswordUpdateService = (passwordUpdateForm) => {
    return request.patch('/user/updatePwd', passwordUpdateForm)
}
