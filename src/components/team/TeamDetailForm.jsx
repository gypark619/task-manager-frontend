const TeamDetailForm = ({
    detail,
    onChangeDetail,
    handleAdd,
    handleSave,
    handleDelete,
    handleSearchLeader,
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
                <div className="detail-field detail-col-1">
                    <label className="form-label">부서 ID</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.teamId}
                        readOnly
                    />
                </div>

                <div className="detail-field detail-col-1">
                    <label className="form-label required">부서명</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.teamName}
                        disabled={disabled}
                        onChange={(e) => onChangeDetail("teamName", e.target.value)}
                    />
                </div>

                <div className="detail-field detail-col-2">
                    <label className="form-label">부서장</label>
                    <input
                        className="form-input"
                        value={detail.teamLeaderEmployeeNo || ""}
                        disabled={disabled}
                        onChange={(e) => onChangeDetail("teamLeaderEmployeeNo", e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearchLeader();
                            }
                        }}
                        placeholder="사번"
                    />

                    <input
                        className="form-input"
                        value={detail.teamLeaderName || ""}
                        disabled={disabled}
                        onChange={(e) => onChangeDetail("teamLeaderName", e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearchLeader();
                            }
                        }}
                        placeholder="이름"
                    />
                    <button 
                        className="button"
                        type="button"
                        disabled={disabled}
                        onClick={handleSearchLeader}
                    >
                        선택
                    </button>
                </div>

                <div className="detail-field detail-col-1">
                    <label className="form-label required">사용 여부</label>
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

                <div className="detail-field detail-col-3">
                    <label className="form-label">부서 설명</label>
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

export default TeamDetailForm;