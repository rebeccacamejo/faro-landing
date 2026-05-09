"use client";

interface Signup {
  id: string;
  email: string;
  business_name: string | null;
  audience: string;
  referral_code: string;
  referred_by_code: string | null;
  referral_count: number;
  created_at: string;
  locale: string;
}

interface Props {
  signups: Signup[];
  downloadOnly?: boolean;
}

export default function AdminTable({ signups, downloadOnly = false }: Props) {
  function downloadCSV() {
    const headers = [
      "position",
      "email",
      "business",
      "audience",
      "referral_count",
      "referral_code",
      "referred_by",
      "locale",
      "signup_date",
    ];
    const rows = signups.map((s, i) => [
      i + 1,
      `"${s.email}"`,
      `"${s.business_name ?? ""}"`,
      s.audience,
      s.referral_count,
      s.referral_code,
      s.referred_by_code ?? "",
      s.locale,
      `"${new Date(s.created_at).toLocaleString()}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `faro-waitlist-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (downloadOnly) {
    return (
      <button
        onClick={downloadCSV}
        style={{
          padding: "8px 16px",
          background: "#1A2B4A",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Download CSV
      </button>
    );
  }

  const thStyle: React.CSSProperties = {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#666",
    borderBottom: "2px solid #e5e5e5",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: "14px",
    color: "#333",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
  };

  return (
    <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #e5e5e5", background: "#fff" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Business</th>
            <th style={thStyle}>Audience</th>
            <th style={thStyle}>Referrals</th>
            <th style={thStyle}>Referred by</th>
            <th style={thStyle}>Locale</th>
            <th style={thStyle}>Signed up</th>
          </tr>
        </thead>
        <tbody>
          {signups.map((s, i) => (
            <tr key={s.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ ...tdStyle, color: "#999", width: "40px" }}>{i + 1}</td>
              <td style={tdStyle}>{s.email}</td>
              <td style={{ ...tdStyle, color: s.business_name ? "#333" : "#bbb" }}>
                {s.business_name ?? "—"}
              </td>
              <td style={tdStyle}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    fontSize: "12px",
                    background: s.audience === "advisor" ? "#dbeafe" : "#dcfce7",
                    color: s.audience === "advisor" ? "#1e40af" : "#15803d",
                  }}
                >
                  {s.audience === "advisor" ? "Advisor" : "Owner"}
                </span>
              </td>
              <td style={{ ...tdStyle, fontWeight: s.referral_count > 0 ? 700 : 400 }}>
                {s.referral_count}
              </td>
              <td style={{ ...tdStyle, color: s.referred_by_code ? "#333" : "#bbb", fontFamily: "monospace", fontSize: "13px" }}>
                {s.referred_by_code ?? "—"}
              </td>
              <td style={{ ...tdStyle, fontSize: "12px", color: "#666" }}>
                {s.locale.toUpperCase()}
              </td>
              <td style={{ ...tdStyle, fontSize: "12px", color: "#666", whiteSpace: "nowrap" }}>
                {new Date(s.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
