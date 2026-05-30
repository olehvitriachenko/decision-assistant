import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#434F9E",
          borderRadius: 7,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round">
            <path strokeWidth="2" d="M16 9v3.5M16 19.5V23M9 16h3.5M19.5 16H23" />
            <path
              strokeWidth="1.5"
              d="M12 12l2 2M18 18l2 2M20 12l-2 2M12 20l2-2"
            />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
