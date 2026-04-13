import "./AppLayout.css";
import PageHeader from "./PageHeader";

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
                <div className="app-layout-body-inner">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AppLayout;