import React from "react";

const UserDetailForm = ({
    detailId,
    detailEmployeeNo,
    detailLoginId,
    detailPassword,
    detailName,
    setDetailEmployeeNo,
    setDetailLoginId,
    setDetailPassword,
    setDetailName,
    handleAdd,
    handleSave,
    handleDelete
}) => {
    return (
        <div className="detail-box">
            <div className="detail-header">
                <h3>상세 정보</h3>

                <div className="detail-button-group">
                    <button
                        className="button"
                        type="button"
                        onClick={handleAdd}
                    >
                        추가
                    </button>

                    <button
                        className="button button-primary"
                        type="button"
                        onClick={handleSave}
                    >
                        저장
                    </button>

                    <button
                        className="button button-delete"
                        type="button"
                        onClick={handleDelete}
                    >
                        삭제
                    </button>
                </div>
            </div>

            <div className="detail-grid">
                <div className="detail-field">
                    <label className="form-label">ID</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detailId}
                        readOnly
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label">사번</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detailEmployeeNo}
                        onChange={(e) => setDetailEmployeeNo(e.target.value)}
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label">로그인ID</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detailLoginId}
                        onChange={(e) => setDetailLoginId(e.target.value)}
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label">비밀번호</label>
                    <input
                        className="form-input"
                        type="password"
                        value={detailPassword}
                        onChange={(e) => setDetailPassword(e.target.value)}
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label">이름</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detailName}
                        onChange={(e) => setDetailName(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserDetailForm;