import React from "react";
import {
    TEAM_OPTIONS,
    POSITION_OPTIONS,
    STATUS_OPTIONS,
    withEmptyOption
} from "../constants/userOptions";

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

                <label className="form-label">부서</label>
                <select
                    className="form-select"
                    value={search.teamId}
                    onChange={(e) => onChangeSearch("teamId", e.target.value)}
                >
                    {withEmptyOption(TEAM_OPTIONS, "전체").map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <label className="form-label">직급</label>
                <select
                    className="form-select"
                    value={search.positionId}
                    onChange={(e) => onChangeSearch("positionId", e.target.value)}
                >
                    {withEmptyOption(POSITION_OPTIONS, "전체").map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <label className="form-label">상태</label>
                <select
                    className="form-select"
                    value={search.status}
                    onChange={(e) => onChangeSearch("status", e.target.value)}
                >
                    {withEmptyOption(STATUS_OPTIONS, "전체").map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

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