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


  

export const SideBar = () => {



  const { user } = useSelector((state) => state.auth);


  
      


  const disptach=useDispatch()
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const nagitveLog = useNavigate()

  const [userdata, setuserdata] = useState([]);

  
 
  // filter data in user

  const useFilter = userdata.filter((usefilter)=> usefilter._id != user._id)
  
                 
     
 

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
  disptach(reomveSelectedUser())
    nagitveLog('/login')
  }

  
 // handle user images
   
const hanldeUserSlect=(user)=>{
  
 disptach(setSelectedUser(user))
 
}



  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-0 text-[9px] z-50 p-2 bg-blue-500 text-white rounded-lg"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 max-h-screen bg-[#FFFFFF] z-10 shadow-lg transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:block w-70 overflow-y-auto h-screen py-6 px-4`}
      >
        {/* Search Bar */}
        <div className="mb-6 flex md:mt-0 mt-11">
          <input
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
    className={`absolute right-0 mt-2 shadow-lg bg-white py-2 z-[1000] min-w-24 w-15 rounded-lg max-h-60 overflow-x-hidden ${
      isDropdownOpen ? "block" : "hidden"
    }`}
  >
    <li className="py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="w-4 h-4 mr-3"
        viewBox="0 0 512 512"
      >
        <path d="..." />
      </svg>
      Dashboard
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
               
            {userdata && useFilter.map((curuser) => (
  <li key={curuser._id} onClick={()=>hanldeUserSlect(curuser)} className="flex items-center text-sm text-black hover:text-blue-500 cursor-pointer"
  
  >
    <span className="relative inline-block mr-4">
      <img
        src={curuser.profile}
        className="ml-[13px] rounded-[50%] w-[50px] h-[50px] object-cover"
        alt="profile" 
        
      />
      <span className="h-2.5 w-2.5 rounded-full bg-green-600 block absolute bottom-1 right-0"></span>
    </span>
    <span className="font-medium">{curuser.name}</span>
    {/* <span className="bg-red-500 min-w-[20px] min-h-[20px] px-1 flex items-center justify-center text-white text-[11px] font-bold rounded-full ml-auto">
      {curuser.message ? 1 : "3"}
    </span> */}
  </li>
))}

           

          
            


           
              

            
          </ul>
        </div>
      </div>
    </>
  );
};
