import React from "react";

const UserSearch = ({
    searchName,
    setSearchName,
    searchLoginId,
    setSearchLoginId,
    handleSearch,
    handleReset
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
                <label className="form-label">이름</label>
                <input
                    className="form-input"
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <label className="form-label">로그인ID</label>
                <input
                    className="form-input"
                    type="text"
                    value={searchLoginId}
                    onChange={(e) => setSearchLoginId(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    className="button button-primary"
                    type="button"
                    onClick={handleSearch}
                >
                    조회
                </button>

                <button
                    className="button"
                    type="button"
                    onClick={handleReset}
                >
                    초기화
                </button>
            </div>
        </div>
    );
};

export default UserSearch;