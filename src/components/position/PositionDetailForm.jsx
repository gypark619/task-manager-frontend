const PositionDetailForm = ({
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
                    <label className="form-label detail-col-1">직급 ID</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.positionId}
                        readOnly
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label required detail-col-1">직급명</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.positionName}
                        disabled={disabled}
                        onChange={(e) => onChangeDetail("positionName", e.target.value)}
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label required detail-col-1">직급 레벨</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.positionLevel}
                        disabled={disabled}
                        onChange={(e) => onChangeDetail("positionLevel", e.target.value)}
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label required detail-col-1">사용 여부</label>
                    <select
                        className="form-select"
                        value={detail.useYn || ""}
                        disabled={disabled}
                        onChange={(e) => onChangeDetail("useYn", e.target.value)}
                    >
                        <option value="">선택</option>
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default PositionDetailForm;