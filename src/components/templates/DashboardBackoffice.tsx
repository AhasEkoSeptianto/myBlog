import { BRAND_NAME } from "@base/src/utils/constants";
import { Menu, Avatar } from "antd";
import { RiDashboardLine } from 'react-icons/ri'
import { MdOutlineLogout } from 'react-icons/md'
import Cookies from "js-cookie";

export default function DashboardBackofficeTemplates(props:any){

    const Logout = () => {
        Cookies.remove('TOKEN_KEY')
        window.location.href ='/backoffice/login'
    }

    return (
        <div className="flex  min-h-screen">
            <div className="w-2/12 shadow-lg">
                <p className="py-16 text-center font-semibold text-2xl">{BRAND_NAME}</p>
                <Menu
                    mode='inline'
                    // theme="dark"
                    defaultSelectedKeys={['1']}
                >
                    <Menu.Item key='1'>
                        <div className="flex items-center space-x-2">
                            <RiDashboardLine className="text-2xl" />
                            <p className="text-lg">Dashboard</p>
                        </div>
                    </Menu.Item>
                </Menu>
            </div>
            <div className="w-10/12 bg-gray-100">
                <div className="bg-white py-2 px-1 flex justify-end">
                    <MdOutlineLogout className="text-3xl text-red-500 cursor-pointer" onClick={Logout} />
                    {/* <Avatar 
                        src='https://media.npr.org/assets/img/2022/11/08/ap22312071681283-0d9c328f69a7c7f15320e8750d6ea447532dff66.jpg'
                        size='large'
                    /> */}

                </div>
            </div>
        </div>
    )
}