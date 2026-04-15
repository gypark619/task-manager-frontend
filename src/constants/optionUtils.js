// ====================
// 공통 옵션
// ====================
export const POSITION_OPTIONS = [
    { value: "1", label: "사원" },
    { value: "2", label: "대리" },
    { value: "3", label: "과장" },
    { value: "4", label: "부장" }
];

export const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "재직" },
    { value: "SUSPENDED", label: "휴직" },
    { value: "INACTIVE", label: "퇴직" }
];

// ====================
// 전체/선택 값 추가
// ====================
export const withEmptyOption = (options = [], label) => [
    { value: "", label },
    ...options
];

export const getOptionLabel = (options, value) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const found = options.find(
        (option) => option.value === String(value)
    );

    return found ? found.label : "";
};