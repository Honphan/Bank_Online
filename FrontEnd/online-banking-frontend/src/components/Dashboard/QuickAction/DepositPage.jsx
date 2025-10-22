import React, { useState, useEffect } from "react";
import "../../../assets/styles/Dashboard/TransferPage.css";
import { depositPhone } from "../../../api/DashBoard/QuickActionApi";

const PRESET_AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];

const getSavedPhones = () => {
  try {
    return JSON.parse(localStorage.getItem("savedPhones") || "[]");
  } catch {
    return [];
  }
};

const setSavedPhones = (arr) => {
  localStorage.setItem("savedPhones", JSON.stringify(arr));
};

export default function DepositPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [savedPhones, setSavedPhonesState] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSavedPhonesState(getSavedPhones());
  }, []);

  const handleSelectPhone = (value) => {
    setPhone(value);
    setMessage(null);
  };

  const handleSavePhone = () => {
    if (!phone.match(/^0\d{9}$/)) {
      setMessage({ type: "error", text: "Vui lòng nhập số điện thoại hợp lệ." });
      return;
    }
    let newList = [...new Set([phone, ...savedPhones])].slice(0,5);
    setSavedPhones(newList);
    setSavedPhonesState(newList);
    setMessage({ type: "success", text: "Đã lưu số điện thoại." });
  };

  const handlePresetClick = (value) => {
    setAmount(value);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.match(/^0\d{9}$/)) {
      setMessage({ type: "error", text: "Vui lòng nhập số điện thoại hợp lệ." });
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) < 10000) {
      setMessage({ type: "error", text: "Vui lòng chọn hoặc nhập số tiền lớn hơn 10.000đ." });
      return;
    }
    setLoading(true);
    setMessage(null);
    // Giả lập gọi API
    const data ={
      phoneNumber: phone,
      amount: amount
    }
    const res = await depositPhone(data);
    console.log(res);

    setLoading(false);
    setMessage({ type: "success", text: `Nạp ${amount} thành công cho ` + phone });
    setPhone("");
    setAmount("");
    // thông báo cập nhật số dư
    window.dispatchEvent(new Event("account-summary-reload"));
  };

  return (
    <div className="transfer-container">
      <h3>Nạp tiền điện thoại</h3>
      <form className="transfer-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <label className="form-label">Số điện thoại</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
              placeholder="Nhập số điện thoại 10 số"
              required
              style={{ flex: 1 }}
            />
            <button type="button" className="verify-btn" onClick={handleSavePhone}>
              Lưu SĐT
            </button>
          </div>
          {!!savedPhones.length && (
            <div style={{margin: "8px 0"}}>
              <span style={{ color: "#64748b", fontSize: 13}}>Đã lưu: </span>
              {savedPhones.map((s) => (
                <button type="button" key={s} className="preset-btn" style={{marginRight:4,padding:'6px 12px',fontWeight: 500}} onClick={()=>handleSelectPhone(s)}>{s}</button>
              ))}
            </div>
          )}
        </div>
        <div className="form-section">
          <label className="form-label">Chọn mệnh giá nhanh</label>
          <div style={{ display: "flex", gap: 10, flexWrap: 'wrap' }}>
            {PRESET_AMOUNTS.map((v) => (
              <button
                key={v}
                type="button"
                className="preset-btn"
                style={{padding:'14px 20px',fontWeight:600,fontSize:16}}
                onClick={() => handlePresetClick(v)}
              >
                {v.toLocaleString()}đ
              </button>
            ))}
          </div>
        </div>
        <div className="form-section">
          <label className="form-label">Số tiền muốn nạp</label>
          <input
            className="form-input"
            value={amount}
            onChange={e=>setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Nhập số tiền muốn nạp"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="transfer-btn" disabled={loading}>{loading ? "Đang xử lý..." : "Nạp tiền"}</button>
        </div>
        {message && <div className={`transfer-message ${message.type}`}>{message.text}</div>}
      </form>
    </div>
  );
}


