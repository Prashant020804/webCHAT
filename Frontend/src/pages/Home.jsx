import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react'


import { SideBar } from '../components/SideBar'
import { Chat } from '../components/Chat'
import { useSelector } from 'react-redux';

export default function Home() {
  const { user ,isAuthenticated} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  return (
    <section className="section bg-[url('https://w0.peakpx.com/wallpaper/744/548/HD-wallpaper-whatsapp-ma-doodle-pattern-thumbnail.jpg')] bg-gray-200 bg-center opacity-100">
      <div className="flex md:flex-row flex-col">
        {/* Sidebar */}
        <div
          className="basis-[25%] h-[100vh] md:bg-[#FFFFFF]  bg-[#FFFFFF] overflow-y-auto "
          
        >
          <SideBar />
        </div>

        {/* Chat Section */}
        <div
          className="basis-[75%] h-[100vh] overflow-y-auto"
         
        >
          <Chat />
        </div>
      </div>
    </section>
  );
}

