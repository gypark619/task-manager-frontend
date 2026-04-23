const RoleDetailForm = ({
    detail,
    onChangeDetail,
    handleAdd,
    handleSave,
    handleDelete,
    disabled
}) => {
    return (
        <div className={`detail-box section-card ${disabled ? "disabled" : ""}`}>
            <div className="section-header">
                <h3 className="section-title">상세 정보</h3>

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
                        disabled={disabled}
                        onClick={handleSave}
                    >
                        저장
                    </button>

                    <button
                        className="button button-delete"
                        type="button"
                        disabled={disabled}
                        onClick={handleDelete}
                    >
                        삭제
                    </button>
                </div>
            </div>

            <div className="detail-grid">
                <div className="detail-field">
                    <label className="form-label detail-col-1">권한 ID</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.roleId}
                        readOnly
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label required detail-col-1">권한명</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.roleName}
                        disabled={disabled}
                        onChange={(e) => onChangeDetail("roleName", e.target.value)}
                    />
                </div>

                <div className="detail-field detail-col-2">
                    <label className="form-label">권한 설명</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.description}
                        disabled={disabled}
                        onChange={(e) => onChangeDetail("description", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default RoleDetailForm;