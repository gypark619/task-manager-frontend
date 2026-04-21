import {
    STATUS_OPTIONS,
    withEmptyOption
} from "../../constants/optionUtils";

const UserSearch = ({
    search,
    onChangeSearch,
    handleSearch,
    handleReset,
    loading,
    teamOptions = [],
    positionOptions =[]
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
                        <label className="form-label">이름</label>
                        <input
                            className="form-input"
                            type="text"
                            value={search.name}
                            onChange={(e) => onChangeSearch("name", e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="search-item">
                        <label className="form-label">부서</label>
                        <select
                            className="form-select"
                            value={search.teamId}
                            onChange={(e) => onChangeSearch("teamId", e.target.value)}
                        >
                            {withEmptyOption(teamOptions, "전체").map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="search-item">
                        <label className="form-label">직급</label>
                        <select
                            className="form-select"
                            value={search.positionId}
                            onChange={(e) => onChangeSearch("positionId", e.target.value)}
                        >
                            {withEmptyOption(positionOptions, "전체").map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="search-item">
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