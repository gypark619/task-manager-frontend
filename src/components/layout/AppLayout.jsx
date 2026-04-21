import "./AppLayout.css";
import PageHeader from "./PageHeader";
import Sidebar from "./Sidebar";

function AppLayout({ title, children, headerRight }) {
    return (
        <div className="app-layout">
            <header className="app-layout-header">
                <div className="app-layout-header-inner">
                    <div className="page-header">
                        <h2 className="page-header-title">{title}</h2>
                        {headerRight && (
                            <div className="page-header-right">{headerRight}</div>
                        )}
                    </div>
                </div>
            </header>

            <main className="app-layout-body">
                <Sidebar />
                <div className="app-layout-content">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AppLayout;