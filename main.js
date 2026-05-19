/* ============================================================
   main.js — Messi World Cup 2022
   FIT2179 Data Visualisation 2
   ============================================================ */

/* ------------------------------------------------------------
   SHARED VEGA-LITE THEME CONFIG
------------------------------------------------------------ */
const sharedConfig = {
  background: "#111318",
  font: "DM Sans",
  title: {
    color: "#f0f6fc", fontSize: 13, font: "Bebas Neue",
    letterSpacing: 1.5, anchor: "start", offset: 8
  },
  axis: {
    gridColor: "#21262d", gridWidth: 1,
    labelColor: "#8b949e", labelFontSize: 11,
    titleColor: "#8b949e", titleFontSize: 11, titlePadding: 10,
    tickColor: "#21262d", domainColor: "#21262d"
  },
  legend: {
    labelColor: "#8b949e", labelFontSize: 11,
    titleColor: "#6e7681", titleFontSize: 10
  },
  view: { stroke: "transparent" }
};

/* ------------------------------------------------------------
   EMBED HELPER
------------------------------------------------------------ */
function embedChart(selector, spec) {
  vegaEmbed(selector, spec, {
    actions: false,
    config: sharedConfig
  }).catch(function(err) {
    console.error("Chart failed [" + selector + "]:", err.message);
    const el = document.querySelector(selector);
    if (el) {
      el.style.cssText = "display:flex;align-items:center;justify-content:center;min-height:180px;";
      el.innerHTML = "<span style='font:11px DM Mono,monospace;color:#f85149;letter-spacing:0.05em;'>Error: " + err.message + "</span>";
    }
  });
}

// embedChart("#chart-map", "js/chart-map.vg.json");

embedChart("#chart-map", {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "FIFA WORLD CUP QATAR 2022 — PARTICIPATING NATIONS",
  "width": "container",
  "height": 500,
  "data": {
    "url": "https://raw.githubusercontent.com/FIT3179/Vega-Lite/main/3_choropleth_map/js/ne_110m_admin_0_countries.topojson",
    "format": {"type": "topojson", "feature": "ne_110m_admin_0_countries"}
  },
  "projection": {"type": "equalEarth"},
  "layer": [
    {
      "transform": [
        {
          "calculate": "'Did not qualify / Participate'",
          "as": "status_label"
        }
      ],
      "mark": {"type": "geoshape", "fill": "#1f242e", "stroke": "#111318"},
      "encoding": {
        "tooltip": [
          {"field": "properties.NAME", "type": "nominal", "title": "Country"},
          {"field": "status_label", "type": "nominal", "title": "Status"}
        ]
      }
    },
    {
      "transform": [
        {
          "calculate": "datum.properties.NAME === 'United States of America' ? 'UNITED STATES' : datum.properties.NAME === 'United Kingdom' ? 'ENGLAND' : datum.properties.NAME === 'South Korea' ? 'KOREA REPUBLIC' : datum.properties.NAME === 'Qatar' ? 'QATAR' : datum.properties.NAME === 'Ecuador' ? 'ECUADOR' : datum.properties.NAME === 'Senegal' ? 'SENEGAL' : datum.properties.NAME === 'Netherlands' ? 'NETHERLANDS' : datum.properties.NAME === 'Iran' ? 'IRAN' : datum.properties.NAME === 'Wales' ? 'WALES' : datum.properties.NAME === 'Argentina' ? 'ARGENTINA' : datum.properties.NAME === 'Saudi Arabia' ? 'SAUDI ARABIA' : datum.properties.NAME === 'Mexico' ? 'MEXICO' : datum.properties.NAME === 'Poland' ? 'POLAND' : datum.properties.NAME === 'Denmark' ? 'DENMARK' : datum.properties.NAME === 'Tunisia' ? 'TUNISIA' : datum.properties.NAME === 'France' ? 'FRANCE' : datum.properties.NAME === 'Australia' ? 'AUSTRALIA' : datum.properties.NAME === 'Morocco' ? 'MOROCCO' : datum.properties.NAME === 'Croatia' ? 'CROATIA' : datum.properties.NAME === 'Germany' ? 'GERMANY' : datum.properties.NAME === 'Japan' ? 'JAPAN' : datum.properties.NAME === 'Spain' ? 'SPAIN' : datum.properties.NAME === 'Costa Rica' ? 'COSTA RICA' : datum.properties.NAME === 'Belgium' ? 'BELGIUM' : datum.properties.NAME === 'Canada' ? 'CANADA' : datum.properties.NAME === 'Switzerland' ? 'SWITZERLAND' : datum.properties.NAME === 'Cameroon' ? 'CAMEROON' : datum.properties.NAME === 'Brazil' ? 'BRAZIL' : datum.properties.NAME === 'Serbia' ? 'SERBIA' : datum.properties.NAME === 'Portugal' ? 'PORTUGAL' : datum.properties.NAME === 'Ghana' ? 'GHANA' : datum.properties.NAME === 'Uruguay' ? 'URUGUAY' : datum.properties.NAME",
          "as": "mapped_country"
        },
        {
          "lookup": "mapped_country",
          "from": {
            "data": {
              "url": "js/Fifa_world_cup_matches.csv",
              "format": {"type": "csv"}
            },
            "key": "team1",
            "fields": ["team1"]
          }
        },
        {
          "filter": "datum.team1 != null"
        },
        {
          "calculate": "'Tournament Participant'",
          "as": "status_label"
        }
      ],
      "mark": {"type": "geoshape", "stroke": "#161b22", "strokeWidth": 1},
      "encoding": {
        "color": {
          "field": "status_label",
          "type": "nominal",
          "scale": {
            "domain": ["Tournament Participant"],
            "range": ["#58a6ff"]
          },
          "legend": {
            "title": "Status",
            "orient": "bottom-left",
            "labelColor": "#8b949e",
            "titleColor": "#e2e6f0"
          }
        },
        "tooltip": [
          {"field": "properties.NAME", "type": "nominal", "title": "Country"},
          {"field": "status_label", "type": "nominal", "title": "Status"}
        ]
      }
    }
  ]
}
);

/* ============================================================
   CHART 2 — Messi Goals & Assists per Match
   Source: js/argentina_matches.csv  (from data.csv)
   Idiom:  Grouped bar — two layers, one per contribution type
   Fix:    No fold transform (can't fold computed fields).
           Two separate bar layers with xOffset instead.
============================================================ */
embedChart("#chart-messi-contributions", "js/chart-messi-contributions.vg.json");

// embedChart("#chart-messi-contributions", {
//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//   "width": "container",
//   "height": 260,
//   "data": {
//     "url": "js/argentina_matches.csv",
//     "format": { "type": "csv" }
//   },
//   "transform": [
//     { "calculate": "toNumber(datum.sort_order)",  "as": "sort_n"    },
//     { "calculate": "toNumber(datum.messi_goals)", "as": "goals_n"   },
//     { "calculate": "toNumber(datum.messi_assists)","as": "assists_n" }
//   ],
//   "layer": [
//     {
//       "mark": {
//         "type": "bar",
//         "xOffset": -10,
//         "cornerRadiusTopLeft": 3,
//         "cornerRadiusTopRight": 3,
//         "color": "#58a6ff"
//       },
//       "encoding": {
//         "x": {
//           "field": "opponent",
//           "type": "nominal",
//           "sort": { "field": "sort_n", "op": "min" },
//           "axis": { "title": null, "labelAngle": -30, "labelFontSize": 11 }
//         },
//         "y": {
//           "field": "goals_n",
//           "type": "quantitative",
//           "axis": { "title": "Count", "tickMinStep": 1, "grid": true },
//           "scale": { "domain": [0, 3] }
//         },
//         "tooltip": [
//           { "field": "opponent", "title": "Opponent" },
//           { "field": "stage",    "title": "Stage" },
//           { "field": "goals_n",  "title": "Goals" }
//         ]
//       }
//     },
//     {
//       "mark": {
//         "type": "bar",
//         "xOffset": 10,
//         "cornerRadiusTopLeft": 3,
//         "cornerRadiusTopRight": 3,
//         "color": "#d4a017"
//       },
//       "encoding": {
//         "x": {
//           "field": "opponent",
//           "type": "nominal",
//           "sort": { "field": "sort_n", "op": "min" }
//         },
//         "y": {
//           "field": "assists_n",
//           "type": "quantitative",
//           "scale": { "domain": [0, 3] }
//         },
//         "tooltip": [
//           { "field": "opponent",  "title": "Opponent" },
//           { "field": "stage",     "title": "Stage" },
//           { "field": "assists_n", "title": "Assists" }
//         ]
//       }
//     }
//   ]
// });


/* ============================================================
   CHART 3 — Messi Actual Goals vs Expected Goals (xG)
   Source: js/argentina_matches.csv  (from data.csv)
   Idiom:  Layered line chart — solid line = goals, dashed = xG
   Fix:    x encoding moved inside each layer (not shared at top)
           to avoid Vega-Lite shared encoding resolution issues.
============================================================ */
embedChart("#chart-messi-xg", "js/chart-messi-xg.vg.json");
// embedChart("#chart-messi-xg", {
//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//   "width": "container",
//   "height": 260,
//   "data": {
//     "url": "js/argentina_matches.csv",
//     "format": { "type": "csv" }
//   },
//   "transform": [
//     { "calculate": "toNumber(datum.sort_order)",  "as": "sort_n"   },
//     { "calculate": "toNumber(datum.messi_goals)", "as": "goals_n"  },
//     { "calculate": "toNumber(datum.messi_xg)",    "as": "xg_n"     }
//   ],
//   "layer": [
//     {
//       "mark": { "type": "line", "strokeDash": [5, 4], "strokeWidth": 2, "color": "#8b949e" },
//       "encoding": {
//         "x": {
//           "field": "opponent", "type": "ordinal",
//           "sort": { "field": "sort_n", "op": "min" },
//           "axis": { "title": null, "labelAngle": -30, "labelFontSize": 11 }
//         },
//         "y": {
//           "field": "xg_n", "type": "quantitative",
//           "axis": { "title": "Value", "tickMinStep": 0.5, "grid": true },
//           "scale": { "domain": [0, 2.5] }
//         }
//       }
//     },
//     {
//       "mark": { "type": "point", "filled": true, "size": 70, "color": "#8b949e" },
//       "encoding": {
//         "x": {
//           "field": "opponent", "type": "ordinal",
//           "sort": { "field": "sort_n", "op": "min" }
//         },
//         "y": { "field": "xg_n", "type": "quantitative" },
//         "tooltip": [
//           { "field": "opponent", "title": "Opponent" },
//           { "field": "stage",    "title": "Stage" },
//           { "field": "xg_n",    "title": "xG (Expected Goals)", "format": ".2f" }
//         ]
//       }
//     },
//     {
//       "mark": { "type": "line", "strokeWidth": 2.5, "color": "#58a6ff" },
//       "encoding": {
//         "x": {
//           "field": "opponent", "type": "ordinal",
//           "sort": { "field": "sort_n", "op": "min" }
//         },
//         "y": { "field": "goals_n", "type": "quantitative" }
//       }
//     },
//     {
//       "mark": { "type": "point", "filled": true, "size": 90, "color": "#58a6ff" },
//       "encoding": {
//         "x": {
//           "field": "opponent", "type": "ordinal",
//           "sort": { "field": "sort_n", "op": "min" }
//         },
//         "y": { "field": "goals_n", "type": "quantitative" },
//         "tooltip": [
//           { "field": "opponent", "title": "Opponent" },
//           { "field": "stage",    "title": "Stage" },
//           { "field": "goals_n",  "title": "Actual Goals" },
//           { "field": "xg_n",     "title": "xG (Expected)", "format": ".2f" }
//         ]
//       }
//     },
//     {
//       "mark": { "type": "text", "dy": -14, "fontSize": 10, "fontWeight": 600, "color": "#58a6ff" },
//       "encoding": {
//         "x": {
//           "field": "opponent", "type": "ordinal",
//           "sort": { "field": "sort_n", "op": "min" }
//         },
//         "y":    { "field": "goals_n", "type": "quantitative" },
//         "text": { "field": "goals_n", "type": "quantitative" }
//       }
//     }
//   ]
// });


/* ============================================================
   CHART 10 — Top Scorers Interactive Horizontal Bar
   Source: js/top_scorers.csv  (from player_stats.csv)
   Idiom:  Layered horizontal bar + slider param interaction
============================================================ */
embedChart("#chart-top-scorers", {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 360,
  "data": {
    "url": "js/top_scorers.csv",
    "format": { "type": "csv" }
  },
  "params": [
    {
      "name": "min_minutes",
      "value": 0,
      "bind": {
        "input": "range", "min": 0, "max": 600, "step": 50,
        "name": "Min. Minutes Played: "
      }
    }
  ],
  "transform": [
    { "calculate": "toNumber(datum.goals)",   "as": "goals_n"   },
    { "calculate": "toNumber(datum.assists)",  "as": "assists_n"  },
    { "calculate": "toNumber(datum.xg)",       "as": "xg_n"       },
    { "calculate": "toNumber(datum.minutes)",  "as": "minutes_n"  },
    { "filter": "datum.minutes_n >= min_minutes" },
    { "calculate": "datum.goals_n + datum.assists_n", "as": "total_n" }
  ],
  "layer": [
    {
      "mark": { "type": "bar", "cornerRadiusTopRight": 3, "cornerRadiusBottomRight": 3 },
      "encoding": {
        "y": {
          "field": "player", "type": "nominal",
          "sort": { "field": "goals_n", "op": "max", "order": "descending" },
          "axis": { "title": null, "labelFontSize": 11 }
        },
        "x": {
          "field": "goals_n", "type": "quantitative",
          "axis": { "title": "Goals (blue)  +  Assists (gold)", "tickMinStep": 1 }
        },
        "color": {
          "condition": { "test": "datum.player === 'Lionel Messi'", "value": "#58a6ff" },
          "value": "#1f3a5f"
        },
        "tooltip": [
          { "field": "player",    "title": "Player"   },
          { "field": "team",      "title": "Team"     },
          { "field": "goals_n",   "title": "Goals"    },
          { "field": "assists_n", "title": "Assists"  },
          { "field": "xg_n",      "title": "xG",      "format": ".1f" },
          { "field": "minutes_n", "title": "Minutes"  }
        ]
      }
    },
    {
      "mark": { "type": "bar", "cornerRadiusTopRight": 3, "cornerRadiusBottomRight": 3, "opacity": 0.75 },
      "encoding": {
        "y": {
          "field": "player", "type": "nominal",
          "sort": { "field": "goals_n", "op": "max", "order": "descending" }
        },
        "x":  { "field": "total_n",  "type": "quantitative" },
        "x2": { "field": "goals_n",  "type": "quantitative" },
        "color": { "value": "#d4a017" }
      }
    },
    {
      "transform": [{ "filter": "datum.player === 'Lionel Messi'" }],
      "mark": { "type": "text", "align": "left", "dx": 6, "fontSize": 10, "fontWeight": 700 },
      "encoding": {
        "y": {
          "field": "player", "type": "nominal",
          "sort": { "field": "goals_n", "op": "max", "order": "descending" }
        },
        "x":    { "field": "goals_n", "type": "quantitative" },
        "text": { "value": "🐐 Golden Ball Winner" },
        "color": { "value": "#58a6ff" }
      }
    }
  ]
});

/* ============================================================
   CHARTS 1, 4, 5, 6, 7, 8, 9 — Not built yet
   Uncomment each line as you add the chart spec
============================================================ */
// embedChart("#chart-map",         ...);
// embedChart("#chart-bubble",      ...);
// embedChart("#chart-goals",       ...);
// embedChart("#chart-possession",  ...);
// embedChart("#chart-shots",       ...);
// embedChart("#chart-groups",      ...);
// embedChart("#chart-team-xg",     ...);