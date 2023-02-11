import { BRAND_NAME } from "@base/src/utils/constants";
import { Menu, Avatar, Layout } from "antd";
import { RiDashboardLine } from 'react-icons/ri'
import { MdOutlineLogout } from 'react-icons/md'
import { ImBlogger } from 'react-icons/im'
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";

const MenuList: any = [
    {
        icon: <RiDashboardLine className="text-lg" />,
        label: 'Dashboard',
        link: '/backoffice/dashboard'
    },
    {
        label: 'Blogs',
        icon: <ImBlogger className='text-lg' />,
        link: '/backoffice/dashboard/blog' ,
        subMenu: [
            {
                icon: <ImBlogger className='text-lg' />,
                label: 'My Blogs',
                link: '/backoffice/dashboard/blog'        
            },
            {
                icon: <ImBlogger className='text-lg' />,
                label: 'Tags',
                link: '/backoffice/dashboard/blog/tags'        
            }
        ]
    }
]

export default function DashboardBackofficeTemplates(props:any){

    const Logout = () => {
        Cookies.remove('TOKEN_KEY')
        window.location.href ='/backoffice/login'
    }

    const route = useRouter()

    return (
        <div className="flex min-h-screen">
            <Layout.Sider 
                className="shadow-lg"
                width={'15%'}
                
            >
                <p className="py-16 text-center font-semibold text-2xl">{BRAND_NAME}</p>
                <Menu
                    mode='inline'
                    theme="light"
                    defaultSelectedKeys={[route.pathname]}
                >
                    {MenuList.map((menu:any, idx:any) => (
                        <>
                            {menu.subMenu? (
                                <Menu.SubMenu  icon={menu.icon} title={<p className="text-lg">{menu.label}</p>}>
                                    {menu.subMenu.map((sub_menu:any, idx:any) => (
                                        <Menu.Item key={menu.link} icon={sub_menu.icon}>
                                            <Link legacyBehavior href={sub_menu.link}>
                                                <a className="text-lg">{sub_menu.label}</a>
                                            </Link>
                                        </Menu.Item>
                                    ))}
                                </Menu.SubMenu>
                            ) : (
                                <Menu.Item icon={menu.icon} key={menu.link} >
                                    <Link legacyBehavior href={menu.link}>
                                        <a className="text-lg">{menu.label}</a>
                                    </Link>
                                </Menu.Item>
                            )}
                        </>
                    ))}
                </Menu>
            </Layout.Sider>
            <div style={{ width: '85%' }} className="bg-gray-100">
                <div className="bg-white py-2 px-1 flex justify-end">
                    <MdOutlineLogout className="text-3xl text-red-500 cursor-pointer" onClick={Logout} />
                    {/* <Avatar 
                        src='https://media.npr.org/assets/img/2022/11/08/ap22312071681283-0d9c328f69a7c7f15320e8750d6ea447532dff66.jpg'
                        size='large'
                    /> */}
                </div>
                
                {props?.children}

            </div>
        </div>
    )
}