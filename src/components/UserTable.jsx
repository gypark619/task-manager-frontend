import React from "react";
import {
    TEAM_OPTIONS,
    POSITION_OPTIONS,
    STATUS_OPTIONS,
    getOptionLabel
} from "../constants/userOptions";

const UserTable = ({
    users,
    checkedIds,
    selectedId,
    handleCheck,
    handleCheckAll,
    handleSelect
}) => {
    return (
        <div className="table-box">
            <h3 className="user-table-title">사용자 목록</h3>

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
                                    key={user.id}
                                    onClick={() => handleSelect(user)}
                                    className={`user-table-row ${
                                        selectedId === user.id ? "selected" : ""
                                    }`}
                                >
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={checkedIds.includes(user.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleCheck(user.id)}
                                        />
                                    </td>
                                    <td className="text-center">{user.id}</td>
                                    <td>{user.employeeNo}</td>
                                    <td>{user.name}</td>
                                    <td>{user.loginId}</td>
                                    <td>{getOptionLabel(TEAM_OPTIONS, user.teamId)}</td>
                                    <td>{getOptionLabel(POSITION_OPTIONS, user.positionId)}</td>
                                    <td>{getOptionLabel(STATUS_OPTIONS, user.status)}</td>
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