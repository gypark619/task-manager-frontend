import {
    STATUS_OPTIONS,
    withEmptyOption
} from "../../constants/optionUtils";

const UserDetailForm = ({
    detail,
    onChangeDetail,
    handleAdd,
    handleSave,
    handleDelete,
    teamOptions = [],
    positionOptions = [],
    roleOptions = [],
    selectedRoleIds = [],
    handleRoleCheck,
    emailDomainType = "direct",
    emailDomainOptions = [],
    onChangeEmailId,
    onChangeEmailDomain,
    onChangeEmailDomainType
}) => {
    const isDirectInput = emailDomainType === "direct";
    
    return (
        <div className="detail-box section-card">
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

            <div className="detail-grid detail-col-1">
                <div className="detail-field">
                    <label className="form-label">ID</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.userId}
                        readOnly
                    />
                </div>

                <div className="detail-field detail-col-1">
                    <label className="form-label required">사번</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.employeeNo}
                        onChange={(e) => onChangeDetail("employeeNo", e.target.value)}
                    />
                </div>

                <div className="detail-field detail-col-1">
                    <label className="form-label required">로그인ID</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.loginId}
                        onChange={(e) => onChangeDetail("loginId", e.target.value)}
                    />
                </div>

                <div className="detail-field detail-col-1">
                    <label className="form-label required">이름</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.name}
                        onChange={(e) => onChangeDetail("name", e.target.value)}
                    />
                </div>

                <div className="detail-field detail-col-2">
                    <label className="form-label">이메일</label>

                    <div className="detail-field-inline email-field">
                        <input
                            className="form-input email-id-input"
                            type="text"
                            value={detail.emailId}
                            onKeyDown={(e) => {
                                if (e.key === "@") e.preventDefault();
                            }}
                            onChange={(e) =>
                                onChangeEmailId(e.target.value.replace(/@/g, ""))
                            }
                            placeholder="아이디"
                        />

                        <span className="email-at">@</span>

                        <input
                            className="form-input email-domain-input"
                            type="text"
                            value={detail.emailDomain}
                            onKeyDown={(e) => {
                                if (e.key === "@") e.preventDefault();
                            }}
                            onChange={(e) =>
                                onChangeEmailDomain(e.target.value.replace(/@/g, ""))
                            }
                            placeholder="주소"
                            disabled={!isDirectInput}
                        />

                        <select
                            className="form-select email-domain-select"
                            value={emailDomainType}
                            onChange={(e) => onChangeEmailDomainType(e.target.value)}
                        >
                            {emailDomainOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="detail-field detail-col-1">
                    <label className="form-label">휴대폰</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.phone}
                        onChange={(e) => onChangeDetail("phone", e.target.value)}
                    />
                </div>
                
                <div className="detail-field detail-col-1">
                    <label className="form-label">업무 전화</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.officePhone}
                        onChange={(e) => onChangeDetail("officePhone", e.target.value)}
                    />
                </div>
                
                <div className="detail-field detail-col-1">
                    <label className="form-label">소속 팀</label>
                    <select
                        className="form-select"
                        value={detail.teamId || ""}
                        onChange={(e) => onChangeDetail("teamId", e.target.value)}
                    >
                        {withEmptyOption(teamOptions, "선택").map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="detail-field detail-col-1">
                    <label className="form-label">직급</label>
                    <select
                        className="form-select"
                        value={detail.positionId || ""}
                        onChange={(e) => onChangeDetail("positionId", e.target.value)}
                    >
                        {withEmptyOption(positionOptions, "선택").map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="detail-field detail-col-1">
                    <label className="form-label">사용자 상태</label>
                    <select
                        className="form-select"
                        value={detail.status || ""}
                        onChange={(e) => onChangeDetail("status", e.target.value)}
                    >
                        {withEmptyOption(STATUS_OPTIONS, "선택").map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="detail-field detail-col-1">
                    <label className="form-label">사용자 권한</label>
                    <div className="checkbox-group">
                        {roleOptions.map((role) => (
                            <label key={role.value} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={selectedRoleIds.includes(role.value)}
                                    onChange={(e) => handleRoleCheck(role.value, e.target.checked)}
                                    />
                                {role.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailForm;