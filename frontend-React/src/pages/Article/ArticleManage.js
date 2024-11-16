import { Button, Card, Space, Table, Empty, Modal, Form, Input, Drawer, Select, Upload, Popconfirm, message } from "antd"
import {
    FormOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons'
import { useEffect, useState } from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './index.scss'
import { useCategory } from "@/hooks/useCategory";
import {
    articleListService,
    articleUpdateService,
    articleAddService,
    articleDeleteService
} from "@/api/article"
import { getToken } from "@/utils/token"

const { Column } = Table;
const { Option } = Select;

const ArticleManage = () => {
    // define state that display article drawer 
    const [showDrawer, setShowDrawer] = useState(false)
    // define state that judge edit or newly add
    const [edit, setEdit] = useState(false)
    // define array stores image list attached to an article
    const [imageList, setImageList] = useState([])
    // define state stores status of an article ("published" or "drafted", defined by backend)
    const [pubStatus, setPubStatus] = useState("")
    // define page number
    const [pageNo, setPageNo] = useState(1)
    // method from API that try to fetch token in local storage.
    const token = getToken()
    const pageSize = 5

    // articleList parameters
    const [queryParams, setQueryParams] = useState({
        pageNum: 1,
        pageSize: pageSize,
        categoryName: null,

        // if you don't set categoryId & status to null, it won't execute at the first time since
        // "http://localhost:3000/api/article?pageNum=1&pageSize=3&categoryId=&status=" won't fetch data
        // categoryId & status become null, request become http://localhost:3000/api/article?pageNum=1&pageSize=3, fetch data ok.
        // 2nd way, or just don't define at the very beginning, only when they have values then use setQueryParams()
    })

    // use hook to fetch article category
    const { categoryList } = useCategory()

    const [articleList, setArticleList] = useState([])
    const [total, setTotal] = useState(0)
    const [searchForm] = Form.useForm()
    const [articleForm] = Form.useForm()
    useEffect(() => {
        const getList = async () => {
            // be careful about order of 2 asynchronous requests.
            // ensure that getList() only runs after categoryList is populated
            if (categoryList.length === 0) return // Wait until categoryList is populated
            try {
                const result = await articleListService(queryParams)
                const articleItems = result.data.items
                // Backend doesn't return categoryName in article list, have to fetch it from categoryList.
                for (let i = 0; i < articleItems.length; i++) {
                    let article = articleItems[i]
                    for (let j = 0; j < categoryList.length; j++) {
                        if (article.categoryId === categoryList[j].id) {
                            // when categoryIds in article array and in article category array are matched, 
                            // add "categoryName" property to article array.
                            article.categoryName = categoryList[j].categoryName
                        }
                    }
                }
                setArticleList(articleItems)
                setTotal(result.data.total)
            } catch (error) {
                console.error("error fetching article category list: ", error)
            }
        }
        getList()
    }, [queryParams, categoryList]) // Add categoryList as a dependency

    // query form 
    const onFinish = (formValues) => {
        setQueryParams({
            ...queryParams,
            categoryId: formValues.categoryId,
            status: formValues.publishState
        })
    }

    // clear article query form data 
    const handleCancel = () => {
        searchForm.resetFields()
    }

    // trigger new article query by clicked page number
    const onPageChange = (page) => {
        setPageNo(page)
        setQueryParams({
            ...queryParams,
            pageNum: page,
        })
    }

    // trigger drawer display by state
    const handleShowDrawer = () => {
        setShowDrawer(true)
    }

    const handleCloseDrawer = () => {
        setShowDrawer(false)
        // need to clear form data after drawer closed 
        // and set edit mode to false
        // clear image list state
        articleForm.resetFields() // comment this line if you want to keep form data even user closed drawer.
        setEdit(false)
        setImageList([])
    }

    // Submit article form. Need to judge whether is add or update
    const handleFinish = async (values) => {
        // if article id exists, dispatch to update, otherwise dispatch to add.
        // useState to store form properties, if article id not exists, then null.

        // destruct form values for below use
        const { title, content, categoryId } = values
        const imgItem = imageList[0]
        // if has newly uploaded image(upload response) or just use the original one
        const cover = imgItem.response ? imgItem.response.data : imgItem.url
        const articleFormData = {
            title: title,
            content: content,
            coverImg: cover,
            status: pubStatus,
            categoryId: categoryId

        }

        // if article id exists, go to update, otherwise go to newly add.
        const articleId = values.id ? values.id : null
        if (articleId) {// update
            // console.log("article form update data: ", articleForm)
            await articleUpdateService({ ...articleFormData, id: (articleId) })
            // re-render and stay at the same page after updating form. pageNum: pageNo
            setQueryParams({ ...queryParams, pageNum: pageNo })

        } else {// newly add
            await articleAddService(articleFormData)
            const oldMaxPage = Math.ceil(total / pageSize)
            const newMaxPage = Math.ceil((total + 1) / pageSize)
            // if article list pages have been +1, re-render and jump to the latest page. pageNum: newMaxPage
            if (oldMaxPage < newMaxPage) {
                setQueryParams({ ...queryParams, pageNum: newMaxPage })
            }
        }
        handleCloseDrawer()
        // prompt action information
        message.success("article been " + (articleId ? "updated." : "added."))
    }


    // image upload onchange event function
    const onChange = (value) => {
        // console.log("Updated fileList", value.fileList)
        // only when image been completely uploaded(fileList is not null), then set to state
        if (value.fileList) {
            setImageList(value.fileList)
            // console.log("value.fileList url: ", value.fileList[0].response.data)
        } else { return }
    }

    // prefill article form data by using local record data
    const prefillArticle = (record) => {
        articleForm.setFieldsValue({
            id: record.id,
            title: record.title,
            content: record.content,
            cover: record.coverImg,
            publishState: pubStatus,
            categoryId: record.categoryId,
        })
        // set edit mode to true
        setEdit(true)
        // trigger display Drawer
        setShowDrawer(true)
        const url = record.coverImg
        // imageList have to be an array with "url" property. for form display use
        setImageList([{ uid: (record.coverImg.uid), url: url }])
        // console.log("imageList: ", imageList)
    }

    // delete article
    const confirmDelete = async (data) => {

        const result = await articleDeleteService(data.id)
        // console.log("delete record data.id: ", typeof (data.id))
        console.log("article deletion result: ", result)

        const oldMaxPage = Math.ceil(total / pageSize)
        const newMaxPage = Math.ceil((total - 1) / pageSize)
        // if article list pages have -1 after deletion, jump to the new latest page
        if (oldMaxPage > newMaxPage) {
            setQueryParams({ ...queryParams, pageNum: newMaxPage })
            setPageNo(newMaxPage)

        } else {
            setQueryParams({ ...queryParams })
        }

    }

    return (
        <Card className="article-manage-form"
        >
            {/* <Card> */}
            <div className="header">
                <span className="manage-header">Article Management</span>
                {/* <div class="extra"> */}
                <Button type="primary" onClick={handleShowDrawer}>Add Article</Button>
                {/* Article drawer form */}
                <Drawer
                    title={edit ? "Update  article" : "Create new article"}
                    width={720} // large size 
                    //onClose={handleCloseDrawer}
                    open={showDrawer}
                    closable={false} // default "x" close button offered by antd locates at left top, need to disable it manually.
                    extra={
                        <Button onClick={handleCloseDrawer}>X</Button> // add a close button at the right top.
                    }
                >
                    {/* Article publish form */}
                    <Form
                        onFinish={handleFinish}
                        form={articleForm}
                    >
                        <Form.Item name="id" initialValue={null} style={{ display: 'none' }}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="title"
                            label="Article Title"
                            rules={[{ required: true, message: 'Please enter the article title' }]}
                        >
                            <Input placeholder="Enter article title" />
                        </Form.Item>

                        <Form.Item
                            name="categoryId"
                            label="Article Category"
                            rules={[{ required: true, message: 'Please select an article category' }]}
                        >
                            <Select  // when updating article, set this property to column "record.categoryName"
                                style={{ width: 150 }} placeholder="Select a category">
                                {/* Replace with dynamic options from backend */}
                                {categoryList.map(category => (
                                    <Option key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </Option>))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="cover"
                            label="Article Cover"
                            rules={[{ required: true }]}
                        >
                            <Upload name="file" action="/api/file/upload" listType="picture-card"
                                headers={{
                                    Authorization: `${token}`
                                }}
                                maxCount={1} // 1 will replace with latest image automatically, 3 need to  delete 1 uploaded image then upload.
                                fileList={imageList}
                                onChange={onChange}
                            >
                                <PlusOutlined />
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label="Content"
                            rules={[{ required: true, message: 'Please input content' }]}
                        >
                            {/* drawer form */}
                            <ReactQuill
                                className="publish-quill"
                                theme="snow"
                                placeholder="Please input content"
                            />
                        </Form.Item>

                        <Form.Item
                        >
                            {/* Form onFinish  property can validate form before submitting form */}
                            <Button type="primary" onClick={() => { setPubStatus("published") }} htmlType="submit">
                                Publish
                            </Button>
                            <Button onClick={() => { setPubStatus("drafted") }} htmlType="submit" style={{ marginLeft: 8 }}>
                                Draft
                            </Button>
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>

            {/* Article search box form */}
            <Form
                onFinish={onFinish}
                form={searchForm}
            >
                <div className="article-search-form"
                >
                    <Form.Item
                        label="Article Category"
                        name="categoryId"
                    >
                        <Select className="custom-select" placeholder="Select a category"
                        >
                            {/* Replace with dynamic options from backend */}
                            {categoryList.map(category => (
                                <Option key={category.id} value={category.id}>
                                    {category.categoryName}
                                </Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Publish Status"
                        name="publishState"
                    >
                        <Select className="custom-select" placeholder="Select a state">
                            <Option value="published">Published</Option>
                            <Option value="drafted">Drafted</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space style={{ padding: '0 30px' }}>
                            <Button key="search" type="primary" htmlType="submit">
                                Search
                            </Button>
                            <Button key="reset" onClick={handleCancel}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </div>
            </Form>

            {/* Article list table */}
            <Card
            >
                <Table dataSource={articleList}
                    rowKey="id"
                    pagination={{
                        current: pageNo, // "current" property controls which page to display, this will improve user experience a lot by manually setting which page to jump to.
                        pageSize: queryParams.pageSize,
                        onChange: onPageChange,
                        total: total,
                        hideOnSinglePage: true
                    }}
                >
                    <Column title="Article Title" width="400" dataIndex="title" key="key" />
                    <Column title="Category" dataIndex="categoryName" key="key" />
                    <Column title="Publish Time" dataIndex="createTime" key="key" />
                    <Column title="Status" dataIndex="status" key="key" />
                    <Column title="Action" width="100" key="key" // "render"  is a function that defines what will be rendered in each cell of this column.
                        render={(_, record) => ( //"_" stands for the value of dataIndex attribute; "record" (the current row data).
                            <Space size="middle"> {/* <Space> separates 2 buttons */}
                                <Button type="primary" onClick={() => { prefillArticle(record) }} shape="circle" icon={<FormOutlined />} style={{ backgroundColor: '#f0f0f0', color: '#000' }} size="default" />
                                <Popconfirm
                                    title="Delete the article"
                                    description="Are you sure to delete this article?"
                                    onConfirm={() => { confirmDelete(record) }}
                                    onCancel={() => { message.info("deletion cancelled") }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary" shape="circle" icon={<DeleteOutlined />} size="default" danger />
                                </Popconfirm>
                                {/* </span> */}
                            </Space>
                        )}
                    />
                    <Empty />
                </Table>
            </Card>

        </Card >
    )

}

export default ArticleManage