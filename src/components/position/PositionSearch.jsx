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
                        <label className="form-label">직급명</label>
                        <input
                            className="form-input"
                            type="text"
                            value={search.positionName}
                            onChange={(e) => onChangeSearch("positionName", e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="search-item">
                        <label className="form-label">사용여부</label>
                        <select
                            className="form-select"
                            value={search.useYn}
                            onChange={(e) => onChangeSearch("useYn", e.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                        </select>
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