import {
    PRIORITY_OPTIONS,
    withEmptyOption
} from "../../constants/optionUtils";


const TaskTable = ({
    tasks,
    checkedIds,
    selectedId,
    handleCheck,
    handleCheckAll,
    handleSelect,
    sort,
    onChangeSort,
    size,
    onChangeSize,
    handleNew,
    handleDelete,
    disabled
}) => {
    const priorityLabelMap = PRIORITY_OPTIONS.reduce((acc, option) => {
        acc[option.value] = option.label;
        return acc;
    }, {});

    return (
        <div className="table-box section-card">
            <div className="section-header">
                <h3 className="section-title">업무 목록</h3>

                <div className="search-item">
                    <select
                        title="정렬"
                        className="form-select"
                        value={`${sort.field},${sort.direction}`}
                        onChange={(e) => {
                            const [field, direction] = e.target.value.split(",");
                            onChangeSort(field, direction);
                        }}
                    >
                        <option value="taskId,desc">최신순</option>
                        <option value="title,asc">업무명 오름차순</option>
                        <option value="title,desc">업무명 내림차순</option>
                    </select>
                    <select
                        title="건수"
                        className="form-select"
                        value={size}
                        onChange={(e) => {
                            const newSize = Number(e.target.value);
                            onChangeSize(newSize);
                        }}
                    >
                        <option value="10">10건</option>
                        <option value="20">20건</option>
                        <option value="50">50건</option>
                    </select>
                </div>
                <div className="detail-button-group">
                    <button
                        className="button"
                        type="button"
                        onClick={handleNew}
                    >
                        신규
                    </button>
                    <button
                        className="button button-delete"
                        type="button"
                        disabled={disabled}
                        onClick={handleDelete}
                    >
                        삭제
                    </button>
                </div>
            </div>
            
            <div className="table-container">
                <table className="data-table">
                    <colgroup>
                        <col style={{ width: "70px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "400px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "150px" }} />
                        <col/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="text-center">
                                <input
                                    type="checkbox"
                                    checked={
                                        tasks.length > 0 &&
                                        checkedIds.length === tasks.length
                                    }
                                    onChange={handleCheckAll}
                                />
                            </th>
                            <th>업무 ID</th>
                            <th>업무명</th>
                            <th>상태</th>
                            <th>우선순위</th>
                            <th>진행률</th>
                            <th>담당팀</th>
                            <th>담당자</th>
                            <th>기간</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    조회 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                <tr
                                    key={task.taskId}
                                    onClick={() => handleSelect(task)}
                                    className={`data-table-row ${
                                        selectedId === task.taskId ? "selected" : ""
                                    }`}
                                >
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={checkedIds.includes(task.taskId)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleCheck(task.taskId)}
                                        />
                                    </td>
                                    <td className="text-center">{task.taskId}</td>
                                    <td>{task.title}</td>
                                    <td className="text-center">{task.statusName}</td>
                                    <td className="text-center">{priorityLabelMap[task.priority] || ""}</td>
                                    <td className="text-center">{task.progress} %</td>
                                    <td>{task.teamName}</td>
                                    <td className="text-center">{task.assigneeName}</td>
                                    <td className="text-center">{task.startDate} ~ {task.dueDate}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskTable;