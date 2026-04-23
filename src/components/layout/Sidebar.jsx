import Main from "../../pages/Main";
import UserList from "../../pages/UserList";
import TeamList from "../../pages/TeamList";
import PositionList from "../../pages/PositionList";
import RoleList from "../../pages/RoleList";

function Sidebar({ onMenuClick, activeKey, isCollapsed, onToggle }) {
    if (isCollapsed) {
        return null;
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="sidebar-brand-text">TASK MGR</span>

                <button
                    type="button"
                    className="sidebar-toggle"
                    onClick={onToggle}
                >
                    ‹
                </button>
            </div>

            <div className="sidebar-menu">
                <div
                    className={`sidebar-item ${activeKey === "main" ? "active" : ""}`}
                    onClick={() => onMenuClick("main", "메인", <Main />)}
                >
                    <span className="sidebar-item-label">메인</span>
                </div>

                <div
                    className={`sidebar-item ${activeKey === "users" ? "active" : ""}`}
                    onClick={() => onMenuClick("users", "사용자 관리", <UserList />)}
                >
                    <span className="sidebar-item-label">사용자 관리</span>
                </div>

                <div
                    className={`sidebar-item ${activeKey === "teams" ? "active" : ""}`}
                    onClick={() => onMenuClick("teams", "팀 관리", <TeamList />)}
                >
                    <span className="sidebar-item-label">팀 관리</span>
                </div>

                <div
                    className={`sidebar-item ${activeKey === "positions" ? "active" : ""}`}
                    onClick={() => onMenuClick("positions", "직급 관리", <PositionList />)}
                >
                    <span className="sidebar-item-label">직급 관리</span>
                </div>

                <div
                    className={`sidebar-item ${activeKey === "roles" ? "active" : ""}`}
                    onClick={() => onMenuClick("roles", "권한 관리", <RoleList />)}
                >
                    <span className="sidebar-item-label">권한 관리</span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;