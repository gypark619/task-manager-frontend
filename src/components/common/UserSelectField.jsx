const UserSelectField = ({
    employeeNo,
    userName,
    disabled = false,
    onChangeEmployeeNo,
    onChangeUserName,
    onSearch
}) => {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div className="user-select-field">
            <input
                className="form-input user-employee-no-input"
                type="text"
                value={employeeNo || ""}
                disabled={disabled}
                onChange={(e) => onChangeEmployeeNo(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="사번"
            />

            <input
                className="form-input user-name-input"
                type="text"
                value={userName || ""}
                disabled={disabled}
                onChange={(e) => onChangeUserName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="이름"
            />

            <button
                className="button"
                type="button"
                disabled={disabled}
                onClick={onSearch}
            >
                선택
            </button>
        </div>
    );
};

export default UserSelectField;