const RoleTable = ({
    roles,
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
                <h3 className="section-title">권한 목록</h3>

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
                        <option value="roleId,desc">최신순</option>
                        <option value="roleName,asc">권한명 오름차순</option>
                        <option value="roleName,desc">권한명 내림차순</option>
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
                                        roles.length > 0 &&
                                        checkedIds.length === roles.length
                                    }
                                    onChange={handleCheckAll}
                                />
                            </th>
                            <th>권한 ID</th>
                            <th>권한명</th>
                            <th>권한 설명</th>
                        </tr>
                    </thead>

                    <tbody>
                        {roles.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    조회 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            roles.map((role) => (
                                <tr
                                    key={role.roleId}
                                    onClick={() => handleSelect(role)}
                                    className={`data-table-row ${
                                        selectedId === role.roleId ? "selected" : ""
                                    }`}
                                >
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={checkedIds.includes(role.roleId)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleCheck(role.roleId)}
                                        />
                                    </td>
                                    <td className="text-center">{role.roleId}</td>
                                    <td>{role.roleName}</td>
                                    <td>{role.description}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoleTable;