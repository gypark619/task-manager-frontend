import {
    withEmptyOption
} from "../../constants/optionUtils";

const TaskSearch = ({
    search,
    onChangeSearch,
    handleSearch,
    handleReset,
    loading,
    teamOptions = [],
    handleSearchAssignee
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
                        <label className="form-label">업무명</label>
                        <input
                            className="form-input"
                            type="text"
                            value={search.title}
                            onChange={(e) => onChangeSearch("title", e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="search-item">
                        <label className="form-label">상태</label>
                        <select
                            className="form-select"
                            value={search.statusId}
                            onChange={(e) => onChangeSearch("statusId", e.target.value)}
                        >
                        </select>
                    </div>
                    <div className="search-item">
                        <label className="form-label">담당팀</label>
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
                        <label className="form-label">담당자</label>
                        <input
                            className="form-input"
                            type="text"
                            value={search.assigneeId}
                            onChange={(e) => onChangeSearch("assigneeId", e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearchAssignee();
                                }
                            }}
                            placeholder="사번"
                        />

                        <input
                            className="form-input"
                            type="text"
                            value={search.assigneeName}
                            onChange={(e) => onChangeSearch("assigneeId", e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearchAssignee();
                                }
                            }}
                            placeholder="이름"
                        />
                        <button 
                            className="button"
                            type="button"
                            onClick={handleSearchAssignee}
                        >
                            선택
                        </button>
                    </div>
                    <div className="search-item">
                        <label className="form-label">기간</label>
                        <input
                            className="form-input"
                            type="date"
                            value={search.startDate}
                            onChange={(e) => onChangeSearch("startDate", e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        ~
                        <input
                            className="form-input"
                            type="date"
                            value={search.dueDate}
                            onChange={(e) => onChangeSearch("dueDate", e.target.value)}
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

export default TaskSearch;