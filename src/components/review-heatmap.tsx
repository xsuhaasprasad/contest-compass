import { format } from "date-fns";

type HeatmapEntry = {
  date: string;
  count: number;
  level: number;
};

type ReviewHeatmapProps = {
  data: HeatmapEntry[];
};

export function ReviewHeatmap({ data }: ReviewHeatmapProps) {
  return (
    <div className="card">
      <div className="card-title-row">
        <div>
          <h2 className="card-title">Activity heatmap</h2>
          <p className="muted">Your last six weeks of review volume.</p>
        </div>
      </div>
      <div className="heatmap">
        <div className="heatmap-grid">
          {data.map((entry) => (
            <div
              key={entry.date}
              className={`heatmap-cell ${entry.level ? `heat-${entry.level}` : ""}`}
              title={`${format(new Date(entry.date), "MMM d")}: ${entry.count} review${entry.count === 1 ? "" : "s"}`}
            />
          ))}
        </div>
        <div className="badge-row">
          <span className="tiny-pill">0</span>
          <span className="tiny-pill">1-2</span>
          <span className="tiny-pill">3-4</span>
          <span className="tiny-pill">5+</span>
        </div>
      </div>
    </div>
  );
}
