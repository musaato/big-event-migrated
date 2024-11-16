import { Button, Card, Space, Table, Empty, Modal, Form, Input, message, Popconfirm } from "antd"

import {
    FormOutlined,
    DeleteOutlined
} from '@ant-design/icons'
import { useState, useEffect } from "react"
import {
    articleCategoryAddService,
    articleCategoryUpdateService,
    articleCategoryDeleteService,
} from "@/api/article"
import { request } from "@/utils"
// checked done
const { Column } = Table

const ArticleCategory = () => {
    // define modal dialogue state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm()
    const [reFetch, setReFetch] = useState(false)
    const [categoryList, setCategoryList] = useState([])
    // state indicates edit mode or update mode.
    const [edit, setEdit] = useState(false)

    // add sequence id to each category item
    // const seqData = useRef([])

    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                const result = await request.get("/category")
                //console.log("result: ", result)
                const cateList = result.data
                setCategoryList(cateList)
            } catch (error) {
                console.log("fetch error")
                // http://localhost:3000/article/category
                // if don't try and catch, login page will throw error to user, which is disaster
                // except login page, other urls without token need to do try-catch as well.
            }
        }
        fetchCategoryList()
    }, [reFetch])

    const seqData = categoryList.map((item, index) => ({//categoryList
        // need to add key to each item, otherwise "Warning: Each child in a list should have a unique "key" prop"
        ...item,
        seq: index + 1,
        key: item.id,

    })
    )

    const showModal = () => {
        setIsModalOpen(true)

    };

    // prefill data to the form
    const updateCategory = (record) => {
        //console.log("record data: ", record)
        form.setFieldsValue({
            id: record.id,
            cateName: record.categoryName,
            cateAlias: record.categoryAlias,
        })
        //console.log("form values: ", form.getFieldValue())
        setEdit(true)
        setIsModalOpen(true)
    }

    // add or update category
    const handleOk = async () => {
        const values = form.getFieldValue()
        // if cateName and cateAlias are both not exist, prompt input error message.
        if (!((values.cateName != null) && (values.cateAlias != null))) {
            // console.log("either parameter is invalid.")
            message.warning("please fulfill your form!")
            return

        }

        // console.log("HandleOk form values: ", form.getFieldValue())
        try {
            // update category if category id already exists.
            if (values.id) {
                const modifiedCategoryData = {
                    id: values.id,
                    categoryName: values.cateName,
                    categoryAlias: values.cateAlias
                }
                console.log("modifiedCategoryData: ", modifiedCategoryData)
                await articleCategoryUpdateService(modifiedCategoryData)

            } else {
                // add new category
                const categoryData = {
                    categoryName: values.cateName,
                    categoryAlias: values.cateAlias
                }
                // console.log("categoryData: ", categoryData)
                // Handle form submission here
                await articleCategoryAddService(categoryData)
            }
        } catch (error) {
            console.error("error submitting data: ", error)
        }

        form.resetFields()
        message.success(edit ? "article category successfully updated." : "article category successfully added.")
        // trigger refetching article category
        setReFetch(!reFetch)

        // set edit state to false
        setEdit(false)
        // close modal
        setIsModalOpen(false)
    }

    // delete category by category id
    const deleteCategory = async (categoryId) => {
        const result = await articleCategoryDeleteService(categoryId)
        // console.log("category deletion result: ", result)
        // note: backend result code 0 stands for success.
        message.success(result.code ? "category deletion failed." : "category has been deleted")
        setReFetch(!reFetch)
    }

    // handle cancel adding new 
    const handleCancel = () => {
        setIsModalOpen(false)
        form.resetFields() // comment this line if you want to keep form data even user closed modal.
    }


    return (
        <Card 
            className="article-category-form"
        >
            <div className="header">
                <span>Article Category</span>
                <div className="extra">
                    <Button type="primary" onClick={showModal}>Add Category</Button>
                    <Modal
                        title={edit ? "Edit Category" : "Add Category"}
                        open={isModalOpen}
                        centered
                        onCancel={handleCancel}
                        footer={[
                            <Button key="cancel" onClick={handleCancel}>
                                Cancel
                            </Button>,
                            <Button key="confirm" type="primary" onClick={handleOk}>
                                Confirm
                            </Button>,
                        ]}
                    >
                        <Form form={form}
                            validateTrigger="onBlur"
                            layout="vertical">
                            <Form.Item
                                label="Category Name"
                                name="cateName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter category name'
                                    },
                                    {

                                        pattern: /^[a-zA-Z0-9]{1,32}$/,
                                        message: "length must between 1 and 32 characters"
                                    }

                                ]}
                            >
                                <Input placeholder="Enter category name" />
                            </Form.Item>
                            <Form.Item
                                label="Category Alias"
                                name="cateAlias"
                                rules={[{
                                    required: true,
                                    message: 'Please enter Category Alias'
                                },
                                {

                                    pattern: /^[a-zA-Z0-9]{1,32}$/,
                                    message: "length must between 1 and 32 characters"
                                }
                                ]}
                            >
                                <Input placeholder="Enter Category Alias" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
            <Table dataSource={seqData}
                pagination={{ pageSize: 5, hideOnSinglePage: true }} // need to disable table pagination manually
                style={{ width: '100%', height: '100%' }}
            >
                <Column title="Sequence" dataIndex="seq" key="id" />
                <Column title="Category Name" dataIndex="categoryName" key="categoryName" />
                <Column title="Category Alias" dataIndex="categoryAlias" key="categoryAlias" />
                <Column title="Action" dataIndex="" key="id"
                // "render" is a function that defines what will be rendered in each cell of this column.
                //"_" stands for the value of dataIndex attribute; "record" (the current row data).
                    render={(_, record) => ( 
                    // <Space> separates 2 buttons
                        <Space size="middle">
                            <Button type="primary" onClick={() => { updateCategory(record) }} style={{ backgroundColor: '#f0f0f0', color: '#000' }} shape="circle" icon={<FormOutlined />} size="default" />
                            <Popconfirm
                                title="Are you sure to delete it ?"
                                onConfirm={() => { deleteCategory(record.id) }}
                                onCancel={() => { message.info("deletion cancelled.") }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" shape="circle" icon={<DeleteOutlined />} size="default" danger />
                            </Popconfirm>
                        </Space>
                    )}
                />
                <Empty />
            </Table>

        </Card >
    )

}

export default ArticleCategory