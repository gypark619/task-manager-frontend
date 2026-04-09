import React from "react";

const UserSearch = ({
    search,
    onChangeSearch,
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
                    value={search.name}
                    onChange={(e) => onChangeSearch("name", e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <label className="form-label">로그인ID</label>
                <input
                    className="form-input"
                    type="text"
                    value={search.loginId}
                    onChange={(e) => onChangeSearch("loginId", e.target.value)}
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