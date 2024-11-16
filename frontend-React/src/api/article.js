
import { request } from "@/utils"

// 1. article category service
// 1.1 fetch category list
export const articleCategoryListService = () => {
    return request.get('/category')
}

// 1.2 add new category
export const articleCategoryAddService = (categoryData) => {
    return request.post('/category', categoryData)
}

// 1.3 update category
export const articleCategoryUpdateService = (categoryData) => {
    return request.put('/category', categoryData)
}

// 1.4 delete category by category id
export const articleCategoryDeleteService = (id) => {
    return request.delete('/category?id=' + id)
}

// 2. article services
// 2.1 fetch all articles by user id, category and so on
/*         request params 
    Format: queryString
    Param       Type    Necessary   Note
    pageNum    number      Y 
    pageSize   number      Y
    categoryId number      N
    status     string      N        "published" or "drafted"
*/

/*         response data
    Format: application/json
    Attr          Type    Necessary  Note
    code          number     Y       0: success, 1: failed
    msg           string     N
    data          object     Y
     ||
     {total       number     Y       article records number
      items       array      Y       article detail
       ||
      {id         number     N
       title      string     N
       content    string     N
       coverImg   string     N
       status     string     N
       categoryId number     N
       createTime string     N
       updateTime string     N
      }
    }        
*/
export const articleListService = (params) => {
    return request.get('/article', { params: params })
    //return request.get('/article', params)
}

// 2.2 publish newly added article
/*         request params 
    Format: application/json
    Param      Type    Necessary   Note
    title      string      Y        
    content    string      Y
    coverImg   string      Y       url of 1 image
    status     string      Y       "published" or "drafted"
    categoryId number      Y
*/

/*         response data
    Format: application/json
    Attr    Type    Necessary  Note
    code    number     Y       0: success, 1: failed
    msg     string     N
    data    object     N       
*/
export const articleAddService = (formData) => {
    return request.post('/article', formData)
}

// 2.3 update article
/*         request params 
    Format: application/json
    Param      Type    Necessary   Note
    id         number      Y       article id
    title      string      Y        
    content    string      Y
    coverImg   string      Y       url of 1 image
    status     string      Y       "published" or "drafted"
    categoryId number      Y
*/

/*         response data
    Format: application/json
    Attr    Type    Necessary  Note
    code    number     Y       0: success, 1: failed
    msg     string     N
    data    object     N       
*/
export const articleUpdateService = (formData) => {
    return request.put('/article', formData)
}

// 2.4 delete article
/*         request params 
    Format: queryString
    Param      Type    Necessary   Note
    id         number      Y       article id
*/

/*         response data
    Format: application/json
    Attr    Type    Necessary  Note
    code    number     Y       0: success, 1: failed
    msg     string     N
    data    object     N       
*/
export const articleDeleteService = (articleId) => {
    return request.delete('/article?id=' + articleId)
}