import React from "react";

const UserTable = ({
    users,
    checkedIds,
    selectedId,
    handleCheck,
    handleCheckAll,
    handleSelect
}) => {
    return (
        <div className="table-box section-card">
            <div className="section-header">
                <h3 className="section-title">사용자 목록</h3>
            </div>
            
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th className="text-center">
                                <input
                                    type="checkbox"
                                    checked={
                                        users.length > 0 &&
                                        checkedIds.length === users.length
                                    }
                                    onChange={handleCheckAll}
                                />
                            </th>
                            <th className="text-center">ID</th>
                            <th>사번</th>
                            <th>이름</th>
                            <th>로그인ID</th>
                            <th>부서</th>
                            <th>직급</th>
                            <th>상태</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    조회 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user.userId}
                                    onClick={() => handleSelect(user)}
                                    className={`user-table-row ${
                                        selectedId === user.userId ? "selected" : ""
                                    }`}
                                >
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={checkedIds.includes(user.userId)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleCheck(user.userId)}
                                        />
                                    </td>
                                    <td className="text-center">{user.userId}</td>
                                    <td className="text-center">{user.employeeNo}</td>
                                    <td className="text-center">{user.name}</td>
                                    <td>{user.loginId}</td>
                                    <td>{user.teamName}</td>
                                    <td className="text-center">{user.positionName}</td>
                                    <td className="text-center">{user.statusName}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;