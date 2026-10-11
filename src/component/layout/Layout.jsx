import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import ChatBotWidget from "../chat/ChatBotWidget"

const Layout = ()=>{
    return(
        <>
        <div>
        <Header/>
            <main className="min-h-screen">
                <Outlet/>
            </main>
        <Footer/>
        <ChatBotWidget/>
        </div>
        </>
    )
}

export default Layout;