import { Link, useLocation } from "react-router-dom";
import "./AppLayout.css";

function Sidebar() {
    const location = useLocation();

    const menus = [
        { name: "사용자 관리", path: "/users" },
        { name: "팀 관리", path: "/teams" },
        { name: "직급 관리", path: "/positions" },
        { name: "권한 관리", path: "/roles" },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-menu">
                {menus.map((menu) => (
                    <Link
                        key={menu.path}
                        to={menu.path}
                        className={`sidebar-item ${
                            location.pathname.startsWith(menu.path) ? "active" : ""
                        }`}
                    >
                        {menu.name}
                    </Link>
                ))}
            </div>
        </aside>
    );
}

export default Sidebar;