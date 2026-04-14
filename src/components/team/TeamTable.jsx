import React from "react";

const TeamTable = ({
    teams,
    checkedIds,
    selectedId,
    handleCheck,
    handleCheckAll,
    handleSelect
}) => {
    return (
        <div className="table-box section-card">
            <div className="section-header">
                <h3 className="section-title">부서 목록</h3>
            </div>
            
            <div className="table-container">
                <table className="user-table">
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
                            <th className="text-center">부서 ID</th>
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
                                    className={`user-table-row ${
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
                                    <td className="text-center">{team.teamLeaderId}</td>
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