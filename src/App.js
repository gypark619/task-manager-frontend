import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import Main from "./pages/Main";

function App() {
    const [tabs, setTabs] = useState([
        { key: "main", label: "메인", component: <Main /> }
    ]);

    const [activeKey, setActiveKey] = useState("main");

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const openTab = (key, label, component) => {
        setTabs((prev) => {
            const exists = prev.find((t) => t.key === key);
            if (exists) return prev;
            return [...prev, { key, label, component }];
        });

        setActiveKey(key);
    };

    const closeTab = (key) => {
        setTabs((prev) => {
            // 메인은 못 닫게
            if (key === "main") return prev;

            const next = prev.filter((t) => t.key !== key);

            // 닫은 게 현재 active면
            if (key === activeKey) {
                const last = next[next.length - 1];
                setActiveKey(last?.key || "main");
            }

            return next;
        });
    };

    const closeAllTabs = () => {
        setTabs([{ key: "main", label: "메인", component: <Main /> }]);
        setActiveKey("main");
    };

    const handleTabClick = (key) => {
        setActiveKey(key);
    };

    return (
        <AppLayout
            title={tabs.find((t) => t.key === activeKey)?.label || ""}
            tabs={tabs.map((tab) => ({
                key: tab.key,
                label: tab.label,
                active: tab.key === activeKey,
                onClick: () => handleTabClick(tab.key),
                onClose: () => closeTab(tab.key)
            }))}
            onMenuClick={openTab}
            onCloseAllTabs={closeAllTabs}
            activeKey={activeKey}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        >
            {tabs.map((tab) => (
                <div
                    key={tab.key}
                    style={{
                        display: tab.key === activeKey ? "block" : "none"
                    }}
                >
                    {tab.component}
                </div>
            ))}
        </AppLayout>
    );
}

export default App;