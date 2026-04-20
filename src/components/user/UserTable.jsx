const UserTable = ({
    users,
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
                <h3 className="section-title">사용자 목록</h3>

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
                        <option value="userId,desc">최신순</option>
                        <option value="name,asc">이름 오름차순</option>
                        <option value="name,desc">이름 내림차순</option>
                        <option value="employeeNo,asc">사번 오름차순</option>
                        <option value="employeeNo,desc">사번 내림차순</option>
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
                                        users.length > 0 &&
                                        checkedIds.length === users.length
                                    }
                                    onChange={handleCheckAll}
                                />
                            </th>
                            <th>ID</th>
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
                                    className={`data-table-row ${
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