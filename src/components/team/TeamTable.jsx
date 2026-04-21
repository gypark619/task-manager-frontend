const TeamTable = ({
    teams,
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
                <h3 className="section-title">부서 목록</h3>

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
                        <option value="teamId,desc">최신순</option>
                        <option value="teamName,asc">부서명 오름차순</option>
                        <option value="teamName,desc">부서명 내림차순</option>
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
                    <colgroup>
                        <col style={{ width: "70px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "200px" }} />
                        <col style={{ width: "200px" }} />
                        <col style={{ width: "800px" }} />
                        <col/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="text-center">
                                <input
                                    type="checkbox"
                                    checked={
                                        teams.length > 0 &&
                                        checkedIds.length === teams.length
                                    }
                                    onChange={handleCheckAll}
                                />
                            </th>
                            <th>부서 ID</th>
                            <th>부서명</th>
                            <th>부서장</th>
                            <th>부서 설명</th>
                            <th>사용 여부</th>
                        </tr>
                    </thead>

                    <tbody>
                        {teams.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    조회 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            teams.map((team) => (
                                <tr
                                    key={team.teamId}
                                    onClick={() => handleSelect(team)}
                                    className={`data-table-row ${
                                        selectedId === team.teamId ? "selected" : ""
                                    }`}
                                >
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={checkedIds.includes(team.teamId)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleCheck(team.teamId)}
                                        />
                                    </td>
                                    <td className="text-center">{team.teamId}</td>
                                    <td>{team.teamName}</td>
                                    <td className="text-center">
                                        {team.teamLeaderName}
                                        {team.teamLeaderEmployeeNo && ` (${team.teamLeaderEmployeeNo})`}
                                    </td>
                                    <td>{team.description}</td>
                                    <td className="text-center">{team.useYn}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamTable;