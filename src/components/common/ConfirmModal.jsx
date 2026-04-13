const ConfirmModal = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <p>{message}</p>
        <div style={buttonWrapStyle}>
          <button onClick={onCancel}>취소</button>
          <button onClick={onConfirm}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "300px",
};

const buttonWrapStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "15px",
};