import React from "react";

const PositionTable = ({
    positions,
    checkedIds,
    selectedId,
    handleCheck,
    handleCheckAll,
    handleSelect,
    sort,
    onChangeSort,
    size,
    onChangeSize
}) => {
    return (
        <div className="table-box section-card">
            <div className="section-header">
                <h3 className="section-title">직급 목록</h3>

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
                        <option value="positionId,desc">최신순</option>
                        <option value="positionName,asc">직급명 오름차순</option>
                        <option value="positionName,desc">직급명 내림차순</option>
                        <option value="positionLevel,asc">직급 레벨 오름차순</option>
                        <option value="positionLevel,desc">직급 레벨 내림차순</option>
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
            </div>
            
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="text-center">
                                <input
                                    type="checkbox"
                                    checked={
                                        positions.length > 0 &&
                                        checkedIds.length === positions.length
                                    }
                                    onChange={handleCheckAll}
                                />
                            </th>
                            <th>직급 ID</th>
                            <th>직급명</th>
                            <th>직급 레벨</th>
                            <th>사용여부</th>
                        </tr>
                    </thead>

                    <tbody>
                        {positions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    조회 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            positions.map((position) => (
                                <tr
                                    key={position.positionId}
                                    onClick={() => handleSelect(position)}
                                    className={`data-table-row ${
                                        selectedId === position.positionId ? "selected" : ""
                                    }`}
                                >
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={checkedIds.includes(position.positionId)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleCheck(position.positionId)}
                                        />
                                    </td>
                                    <td className="text-center">{position.positionId}</td>
                                    <td>{position.positionName}</td>
                                    <td className="text-center">{position.positionLevel}</td>
                                    <td className="text-center">{position.useYn}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PositionTable;