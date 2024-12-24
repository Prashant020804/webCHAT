import React, {  useEffect, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Baseurl } from "../../services api/baseurl";
import { logout } from "../redux/fetaures/authSlice";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { reomveSelectedUser, setSelectedUser } from "../redux/fetaures/userSlice";
import { CiHome } from "react-icons/ci";

  

export const SideBar = ({socket}) => {



  const { user } = useSelector((state) => state.auth);


  
      


  const disptach=useDispatch()
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const nagitveLog = useNavigate()

  const [userdata, setuserdata] = useState([]);
  const [search,setsearch] = useState('')
 

  
 
  // filter data in user

  const filteredUsers = userdata.filter((curuser) => curuser._id !== user._id) 
  .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

                 
     // searching filter 
     const handlSearching = (value)=>{
          setsearch(value)
     }


 

  // get data in user
  const userapidata = async () => {
    try {
      const resp = await axios.get(`${Baseurl}/api/Auth/get_user`);
      const data = resp.data;
      setuserdata(data.user); 
    
    } catch (error) {
      console.log(error);
    }
  };
  
   

  useEffect(()=>{
    userapidata()
  },[])




  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Logout  redirect in loing page

  const handlelogout = ()=>{
  disptach(logout())
  if (socket) {
    
    socket.disconnect(); 
  }
  disptach(reomveSelectedUser())
    nagitveLog('/login')
  }

  
 // handle user images
   
const hanldeUserSlect=(user)=>{
  
 disptach(setSelectedUser(user))
 setSidebarOpen(false);
 
}



  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-0 text-[12px] z-50 p-2  bg-[#F0F2F5] text-black rounded-lg"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
  className={`sidebar fixed top-0 left-0 max-h-screen bg-[#FFFFFF] z-10 shadow-lg transition-transform duration-300 ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } md:static md:translate-x-0 md:block w-70 overflow-y-scroll h-screen py-6 px-4`}
>

      
        {/* Search Bar */}
        <div className="mb-6 flex md:mt-0 mt-11">
          <input
           value={search}
          onChange={(event)=>handlSearching(event.target.value)}
            type="text"
            placeholder="Something search.."
            className="w-60 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
         {/* Dropdown list logout */}

        
     
         <div className="relative font-[sans-serif] w-max mx-auto">
  <button
    type="button"
    id="dropdownToggle"
    className="flex items-center rounded-full text-[#333] text-sm outline-none"
    onClick={() => setDropdownOpen(!isDropdownOpen)}
  >
    <img
      src={user && user.profile}
      className="w-9 h-9 ml-3 rounded-[50%]"
      alt="Profile"
    />
  </button>

  <ul
    id="dropdownMenu"
    className={`absolute  right-0 mt-2 shadow-lg bg-white py-2 z-[1000] min-w-24 w-15 rounded-lg max-h-60 overflow-x-hidden ${
      isDropdownOpen ? "block" : "hidden"
    }`}
  >
    <li className="py-2.5 px-5 gap-[8px] flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
     <button>
     <CiHome />
     </button>
     Home
    </li>
    <li onClick={handlelogout} className="py-2.5 px-5 flex gap-[8px] items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
      <button className="text-8 text-blue-600/100">
      <CiLogout />
      </button>
      Logout
    </li>
  </ul>
</div>




        </div>





        {/* User List */}
        <div className="my-8 flex-1">
          <h6 className="text-sm text-gray-700 font-semibold mb-6">Teams</h6>
          <ul className="space-y-6">
            {/* All user in data with the help of api */}
               
    {/* Render filtered user list */}
{filteredUsers.map((curuser) => (
  <li
    key={curuser._id}
    onClick={() => hanldeUserSlect(curuser)}
    className="flex items-center text-sm text-black hover:text-blue-500 cursor-pointer"
  >
    <span className="relative inline-block mr-4">
      <img
        src={curuser.profile}
        className="ml-[13px] rounded-[50%] w-[50px] h-[50px] object-cover"
        alt="profile"
      />
      {/* <span className="h-2.5 w-2.5 rounded-full bg-green-600 block absolute bottom-1 right-0"></span> */}
    </span>
    <span className="font-medium">{curuser.name}</span>
  </li>
))}


           

          
            


           
              

            
          </ul>
        </div>
      </div>
    </>
  );
};
