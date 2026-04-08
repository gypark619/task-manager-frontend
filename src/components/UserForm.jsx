import React from "react";

const UserForm = ({
    employeeNo,
    setEmployeeNo,
    loginId,
    setLoginId,
    password,
    setPassword,
    name,
    setName,
    selectedId,
    handleSubmit,
    handleCancel
}) => {
    return (
        <div className="user-form">
            <h3>{selectedId ? "사용자 수정" : "사용자 등록"}</h3>

            <input
                type="text"
                placeholder="사번 입력"
                value={employeeNo}
                onChange={(e) => setEmployeeNo(e.target.value)}
            />

            <input
                type="text"
                placeholder="로그인 ID 입력"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
            />

            <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                type="text"
                placeholder="이름 입력"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button className="button button-primary" onClick={handleSubmit}>
                {selectedId ? "수정" : "등록"}
            </button>

            {selectedId && (
                <button
                    className="button"
                    type="button"
                    onClick={handleCancel}
                >
                    취소
                </button>
            )}
        </div>
    );
};

export default UserForm;