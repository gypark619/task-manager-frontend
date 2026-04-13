function PageHeader({ title, rightContent }) {
    return (
        <div className="page-header">
            <h2 className="page-header-title">{title}</h2>
            {rightContent && (
                <div className="page-header-right">
                    {rightContent}
                </div>
            )}
        </div>
    );
}

export default PageHeader;