const UserSearch = ({
    search,
    onChangeSearch,
    handleSearch,
    handleReset,
    loading
}) => {
    // Enter로 조회
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="search-box">
            <div className="search-row">
                <div className="search-fields">
                    <div className="search-item">
                        <label className="form-label">권한명</label>
                        <input
                            className="form-input"
                            type="text"
                            value={search.roleName}
                            onChange={(e) => onChangeSearch("roleName", e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
                
                <div className="search-actions">
                    <button
                        className="button button-primary"
                        type="button"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        조회
                    </button>

                    <button
                        className="button"
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        초기화
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSearch;