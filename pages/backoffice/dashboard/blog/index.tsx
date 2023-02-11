// import MyEditor from "@base/src/components/molecules/editor/draftJsEditor";
import DashboardBackofficeTemplates from "@base/src/components/templates/DashboardBackoffice";
import { Button, Input, Loading, Modal, Switch } from "@nextui-org/react";
import { use, useEffect, useState } from "react";
import dynamic from 'next/dynamic'
import LabelRequired from "@base/src/components/atom/labelRequired";
import { Card, Popconfirm, Popover, Select, Table, Tag } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
const MyEditor = dynamic(() => import('@base/src/components/molecules/editor/draftJsEditor'), {
    loading: () => <p>Loading...</p>,
    ssr: false
  })

import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import moment from "moment";

export default function Blog(props:any){

    const [ modalFormBlog, setModalFormBlog ] = useState({
        open: false
    })

    const [ tagList, setTagList  ] = useState([])
    const [ laodingSubmit, setLoadingSubmit ] = useState(false)
    const [ addContentForm, setAddContentForm ] = useState<any>(null)
    const [ params, setParams ] = useState({
        page: 1,
        limit: 10,
        refresh_point: 1
    })
    const [ totalData, setTotalData ] = useState(0)
    const [ blog, setBlog ] = useState([])
    const [ loadingBlog, setLoadingBlog ] = useState(false)

    useEffect(() => {
        axios.get('/api/backoffice/blog/tag', { params: { page: 1, limit: 10000, tag: '' } })
            .then(res => {
                const { data } = res
                setTagList(data?.tag)

            }).catch(err => {})
    },[])

    const SubmitForm = async () => {

        if (addContentForm.tag?.length <= 1) return toast.warning('harap pilih minimal 1 tag')

        setLoadingSubmit(true)
        await axios.post('/api/backoffice/blog/blog', addContentForm)
            .then(res => {
                toast.success('Success Menambahkan Blog')
                setModalFormBlog({ open: false })
            }).catch(err => {})
            .finally(() => {
                setLoadingSubmit(false)
            })
    }

    useEffect(() => {
        setLoadingBlog(true)
        axios.get('/api/backoffice/blog/blog', { params: params })
            .then(res => {
                let data = res?.data?.blog
                setTotalData(res?.data?.total)
                setBlog(data)
            }).catch(err => {})
            .finally(() => {
                setLoadingBlog(false)
            })
    },[params])


    const DeleteBlog = async (item:any) => {
        return await axios.delete('/api/backoffice/blog/blog?_id=' + item?._id)
            .then(res => {
                toast.success(res?.data?.msg);
                setParams({ ...params, refresh_point: Math.random() })
            }).catch(err => {})
    }

    return (
        <DashboardBackofficeTemplates>

            <Modal
                open={modalFormBlog.open}
                onClose={() => setModalFormBlog({ ...modalFormBlog, open: false })}
                width='60%'
                closeButton
                
            >
                <Modal.Header className="border-b">
                    <p className="text-lg font-semibold">Add New Blogs</p>
                </Modal.Header>
                <Modal.Body>
                    {modalFormBlog.open && (
                        <ModalFormBlog 
                            tag={tagList}
                            onChange={(val:any) => setAddContentForm(val)}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button auto className="bg-gray-500" size='sm'> 
                        Cancel
                    </Button>
                    <Button auto className="bg-blue-500" size='sm' onClick={SubmitForm} disabled={laodingSubmit}> 
                        {laodingSubmit ? <Loading size='sm' color='white' /> : 'Submit'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="py-16 px-5 flex items-center justify-between">
                <p></p>
                <p className="text-2xl italic">List of my blogs</p>
                <Button className="bg-blue-500" size='md' onClick={() => setModalFormBlog({ ...modalFormBlog, open: true })}>
                    Add New Blog
                </Button>
            </div>
            
            <div className="p-2 flex flex-wrap ">
                {blog?.map((item:any, idx:any) => (
                    <Card key={idx} title={
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-lg font-semibold">{item?.title}</p>
                                <p className="text-xs">{moment(item?.created_at).format('lll')}</p>
                            </div>
                            <Popover
                                placement="rightTop"
                                title='Option'
                                content={
                                    <div>
                                        <p className="cursor-pointer hover:bg-gray-200">Edit</p>
                                        <Popconfirm
                                            title='are you sure ?'
                                            onConfirm={() => DeleteBlog(item)}
                                        >
                                            <p className="cursor-pointer hover:bg-gray-200">Delete</p>
                                        </Popconfirm>
                                    </div>
                                }
                            >
                                <BsThreeDots className="cursor-pointer" />
                            </Popover>
                        </div>
                    } className='h-max mb-5 w-1/3 '
                    >
                        <div dangerouslySetInnerHTML={{ __html: item?.Content }}></div>
                    </Card>
                ))}
            </div>

        </DashboardBackofficeTemplates>
    )
}

const ModalFormBlog = ({ tag, onChange }: any) => {

    let initialForm = {
        title: '',
        content: '',
        tag: []
    }

    const [ form, setForm ] = useState<any>(initialForm)


    const HandleChangeTags = (e:any) => {
        let value = e.target.value

        setForm({ ...form, tag: [...form.tag, value] })
    }

    useEffect(() => {
        onChange(form)
    },[form])

    useEffect(() => {
        setForm(initialForm)
    },[])


    return (
        <div className="container space-y-2 py-10 cursor-auto"> 
            <div>
                <LabelRequired label='Title :' />
                <Input 
                    css={{ width: '50%' }}
                    placeholder="type title blog"
                    underlined
                    onChange={({ target }) => setForm({ ...form, title: target.value })} 
                />
            </div>
            <div>
                <LabelRequired label='Content :' />
                <MyEditor 
                    data={form.content}
                    disable={false}
                    idx={1}
                    onChanges={(e:any) => setForm({ ...form, content: e })}
                />
            </div>

            <div>
                <LabelRequired label='Tags' />
                <div className="flex items-center space-x-1 flex-wrap">
                    {form?.tag?.map((item:any, idx:any) => (
                        <Tag 
                            key={idx} 
                            closable 
                            onClose={(e:any) => setForm({ ...form, tag: form.tag.filter((t:any) => t !== item) })}
                        >
                            {item}
                        </Tag>
                    ))}
                </div>

                <select 
                    className="border-2 rounded p-2 w-1/2"
                    onChange={HandleChangeTags}    
                >
                    {tag?.map((t:any, idx:any) => (
                        <option key={idx} value={t.tag}>{t.tag}</option>
                    ))}
                </select>
                
            </div>
                
        </div>
    )
}