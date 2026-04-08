import React from "react";

const UserTable = ({
    users,
    checkedIds,
    handleCheck,
    handleCheckAll,
    handleSelect,
    selectedId
}) => {
    return (
        <div className="section">
            <h3 className="user-table-title">사용자 목록</h3>

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
                        <th>로그인ID</th>
                        <th>이름</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr 
                            key={user.id}
                            onClick={() => handleSelect(user)}
                            className={`user-table-row ${selectedId === user.id ? "selected" : ""}`}
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
                            <td>{user.loginId}</td>
                            <td>{user.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;