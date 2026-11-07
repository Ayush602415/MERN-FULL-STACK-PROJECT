import { Outlet } from "react-router";
import Navbar from "../components/Navbar";



const MainLayout = () => (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(91,33,182,0.12),_transparent_45%),#101010]">
        <Navbar />
        <Outlet />
    </div>
);

export default MainLayout;