import DashboardBackofficeTemplates from "@base/src/components/templates/DashboardBackoffice";
import { Button, Input, Loading, Modal } from "@nextui-org/react";
import { Popconfirm, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// icons
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'


export default function Tags(props:any){

    const [ modalAddTags, setModalAddTags ] = useState(false)
    const [ form, setForm ] = useState({
        tagName: '',
        type: '',
        _id: ''
    })
    const [ loadingSubmitModal, setLoadingSubmitModal ] = useState(false)
    const [ loadingFetching, setLoadingFetching ] = useState(false)
    const [ params, setParams ] = useState({
        page: 1,
        limit: 10,
        tag: '',
        refresh_point: 0
    })
    const [ tags, setTags ] = useState([])
    const [ totalTag, setTotalTag ] = useState(0)
    useEffect(() => {
        setLoadingFetching(true)
        axios.get('/api/backoffice/blog/tag', { params: params })
            .then(res => {
                const { data } = res
                setTags(data?.tag)
                setTotalTag(data?.total)

            }).catch(err => {})
            .finally(() => {
                setLoadingFetching(false)
            })
    },[params])

    const SubmitModalForm = async (id=null) => {
        setLoadingSubmitModal(true)
        if (form.type === 'add'){
            await axios.post('/api/backoffice/blog/tag', { tag: form.tagName })
                .then(res => {
                    toast.success(res?.data?.msg)
                    setModalAddTags(false)
                    setParams({ ...params, refresh_point: Math.random() })
                }).catch(err => {
                    console.log(err)
                })
        }else{
            await axios.put('/api/backoffice/blog/tag?_id=' + form._id , { tag: form.tagName })
                .then(res => {
                    toast.success(res?.data?.msg)
                    setModalAddTags(false)
                    setParams({ ...params, refresh_point: Math.random() })
                }).catch(err => {
                    console.log(err)
                })
        }
        setLoadingSubmitModal(false)
    }

    useEffect(() => {
        if (!modalAddTags){
            setForm({ _id: '', tagName: '', type: 'add' })
        }
    },[modalAddTags])

    const columnTable = [
        {
            title: 'ID',
            dataIndex: '_id'
        },
        {
            title: 'Tag',
            dataIndex: 'tag'
        },
        {
            title: 'Action',
            render: (_, record:any) => {
                const id = record?._id
                const DeleteTag = async () => {
                    await axios.delete('/api/backoffice/blog/tag?_id=' + id)
                        .then(res => {
                            toast.success(res?.data?.msg)
                            setParams({ ...params, refresh_point: Math.random() })
                        }).catch(err => {})
                }

                return (
                    <div className="flex items-center space-x-2">
                        <AiFillEdit className="text-blue-500 text-lg cursor-pointer" onClick={() => {
                            setModalAddTags(true)
                            setForm({
                                ...form,
                                tagName: record?.tag,
                                type: 'edit',
                                _id: record?._id
                            })
                        }} />
                        <Popconfirm
                            title='are you sure to delete ?'
                            okButtonProps={{ style: { backgroundColor: 'blue' } }}
                            okText='Yes'
                            onConfirm={DeleteTag}
                        >
                            <AiFillDelete className="text-red-500 text-lg cursor-pointer" />
                        </Popconfirm>
                    </div>
                )
            }
        }
    ]

    return (
        <DashboardBackofficeTemplates>

            {/* modal form */}
            <Modal 
                open={modalAddTags}
                onClose={() => setModalAddTags(false)}
            >
                <Modal.Header className="border-b font-semibold text-lg">{form.type === 'edit' ? 'Edit' : 'Add' } Tags</Modal.Header>
                <Modal.Body className="mt-5">
                    <Input underlined placeholder="tag name" value={form.tagName} onChange={({ target }) => setForm({ ...form, tagName: target.value })} />
                </Modal.Body>
                <Modal.Footer>
                    <Button className="bg-blue-500" auto onClick={() => SubmitModalForm()}> 
                        {loadingSubmitModal  ? <Loading color='white' size='sm'  /> : 'Save'}
                    </Button>
                    <Button className="bg-red-500" auto onPress={() => setModalAddTags(false)}> 
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="p-5">
                <Button className="bg-blue-500" auto onPress={() => {setModalAddTags(true);setForm({ ...form, type:'add' })}}>
                    Add Tags
                </Button>

                <Table 
                    className="mt-5"
                    dataSource={tags}
                    columns={columnTable}
                    loading={loadingFetching}
                />
            </div>
        </DashboardBackofficeTemplates>
    )
}