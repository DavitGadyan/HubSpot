import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { getAuditView } from "@/lib/audit/service";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: Promise<{ id: string }> }) {
  const audit = await getAuditView((await params).id);
  const score = audit?.scores?.overall ?? 0;
  const color = score >= 75 ? "#3ccf91" : score >= 50 ? "#f5b84a" : "#ff5d5d";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b0b0e", color: "#eeeef2", padding: 80, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ fontSize: 28, color: "#ff7a45", letterSpacing: 4 }}>HUBSPOT AI READINESS</div>
          <div style={{ fontSize: 64, lineHeight: 1.1, maxWidth: 700 }}>{audit?.report?.headline ?? "AI readiness report"}</div>
          <div style={{ fontSize: 26, color: "#9b9ba8" }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 300, height: 300, borderRadius: 300, border: `18px solid ${color}`, alignSelf: "center", fontSize: 120 }}>
          {score}
        </div>
      </div>
    ),
    size,
  );
}
