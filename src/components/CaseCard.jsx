import { ArrowUpRight } from "lucide-react";
import RetroIcon from "./RetroIcon";
export default function CaseCard({ data }) {
  return (
    <article className="case-card">
      <div className={`case-art ${data.tone}`}>
        <RetroIcon
          name={
            data.id === "animae"
              ? "community"
              : data.id === "navaja"
                ? "research"
                : "shop"
          }
          size={72}
        />
        <span className="asset-note">{data.title} · imagens em curadoria</span>
      </div>
      <div className="case-content">
        <span className="case-category">{data.type}</span>
        <h3>{data.title}</h3>
        <p>{data.summary}</p>
        <a className="case-link" href={`/cases/${data.id}`}>
          Ler o case <ArrowUpRight size={16} />
        </a>
      </div>
    </article>
  );
}
