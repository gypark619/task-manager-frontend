// ====================
// 공통 옵션
// ====================
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