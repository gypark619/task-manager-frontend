import "./AppLayout.css";
import Sidebar from "./Sidebar";

function AppLayout({
    title,
    children,
    headerRight,
    tabs = [],
    onMenuClick,
    onCloseAllTabs,
    activeKey,
    isSidebarCollapsed,
    onToggleSidebar
}) {
    return (
        <div className="app-layout">
            {isSidebarCollapsed && (
                <button
                    type="button"
                    className="sidebar-floating-toggle"
                    onClick={onToggleSidebar}
                >
                    ☰
                </button>
            )}

            <Sidebar
                onMenuClick={onMenuClick}
                activeKey={activeKey}
                isCollapsed={isSidebarCollapsed}
                onToggle={onToggleSidebar}
            />

            <div className="app-layout-main">
                <header className="app-layout-header">
                    <div className="app-layout-header-inner">
                        <div className={`page-tabs ${isSidebarCollapsed ? "sidebar-hidden" : ""}`}>
                            {tabs.map((tab) => (
                                <div
                                    key={tab.key}
                                    className={`page-tab ${tab.active ? "active" : ""}`}
                                    onClick={tab.onClick}
                                >
                                    <span className="page-tab-label">{tab.label}</span>

                                    {tab.key !== "main" && (
                                        <span
                                            className="tab-close"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                tab.onClose();
                                            }}
                                        >
                                            ×
                                        </span>
                                    )}
                                </div>
                            ))}

                            <div className="tab-actions">
                                <button type="button" onClick={onCloseAllTabs}>
                                    전체닫기
                                </button>
                            </div>
                        </div>

                        <div className="page-header">
                            <h2 className="page-header-title">{title}</h2>
                            {headerRight && (
                                <div className="page-header-right">{headerRight}</div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="app-layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AppLayout;