import React from "react";
import {
    TEAM_OPTIONS,
    POSITION_OPTIONS,
    STATUS_OPTIONS,
    withEmptyOption
} from "../constants/userOptions";

const UserDetailForm = ({
    detail,
    onChangeDetail,
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
                        value={detail.userId}
                        readOnly
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label">사번</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.employeeNo}
                        onChange={(e) => onChangeDetail("employeeNo", e.target.value)}
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label">로그인ID</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.loginId}
                        onChange={(e) => onChangeDetail("loginId", e.target.value)}
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label">이름</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.name}
                        onChange={(e) => onChangeDetail("name", e.target.value)}
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label">이메일</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.email}
                        onChange={(e) => onChangeDetail("email", e.target.value)}
                    />
                </div>

                <div className="detail-field">
                    <label className="form-label">휴대폰</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.phone}
                        onChange={(e) => onChangeDetail("phone", e.target.value)}
                    />
                </div>
                
                <div className="detail-field">
                    <label className="form-label">업무 전화</label>
                    <input
                        className="form-input"
                        type="text"
                        value={detail.officePhone}
                        onChange={(e) => onChangeDetail("officePhone", e.target.value)}
                    />
                </div>
                
                <div className="detail-field">
                    <label className="form-label">소속 팀</label>
                    <select
                        className="form-select"
                        value={detail.teamId || ""}
                        onChange={(e) => onChangeDetail("teamId", e.target.value)}
                    >
                        {withEmptyOption(TEAM_OPTIONS, "선택").map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="detail-field">
                    <label className="form-label">직급</label>
                    <select
                        className="form-select"
                        value={detail.positionId || ""}
                        onChange={(e) => onChangeDetail("positionId", e.target.value)}
                    >
                        {withEmptyOption(POSITION_OPTIONS, "선택").map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="detail-field">
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
            </div>
        </div>
    );
};

export default UserDetailForm;