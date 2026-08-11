#!/usr/bin/env python3
"""
Generate SECOND / PASS house-style research figures for two new articles.

House palette:
  Paper        #F2EFE7  (background)
  Ink          #11110F  (primary text/stroke)
  Graphite     #5A5953  (secondary text/stroke)
  Rule         #C9C3B7  (gridlines)
  Signal Blue  #2F5BFF  (one important series/threshold/annotation)

Reads CSV data from the research packages and writes SVGs to
public/research/{agent-fanout,warm-capacity}/charts/.
"""
import csv
import os
import math
from html import escape

# ── palette ──────────────────────────────────────────────────────────────
PAPER   = "#F2EFE7"
INK     = "#11110F"
GRAPH   = "#5A5953"
RULE    = "#C9C3B7"
SIGNAL  = "#2F5BFF"
SIGNAL_SOFT = "#2F5BFF"

# ── helpers ──────────────────────────────────────────────────────────────
def esc(s):
    return escape(str(s), quote=True)

class SVG:
    def __init__(self, w, h, bg=PAPER):
        self.w = w; self.h = h
        ff = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        self.parts = [
            f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {w} {h}' "
            f"width='{w}' height='{h}' font-family=\"{ff}\" "
            f"text-rendering='geometricPrecision'>",
            f'<rect width="{w}" height="{h}" fill="{bg}"/>',
        ]
    def add(self, s): self.parts.append(s)
    def out(self):
        self.parts.append('</svg>')
        return '\n'.join(self.parts)

def text(x, y, s, fill=INK, size=13, weight=400, anchor="start", cls=None, style=""):
    c = f' class="{cls}"' if cls else ''
    return (f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" '
            f'font-weight="{weight}" text-anchor="{anchor}"{c} style="{style}">{esc(s)}</text>')

def line(x1,y1,x2,y2,stroke=GRAPH,sw=1,dash=None,opacity=1):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" '
            f'stroke-width="{sw}"{d} opacity="{opacity}"/>')

def rect(x,y,w,h,fill="none",stroke=INK,sw=1,rx=2,opacity=1):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="{sw}" rx="{rx}" ry="{rx}" opacity="{opacity}"/>')

def plot_box(svg, x0, y0, x1, y1):
    """Draw axis box + gridlines using Rule color."""
    svg.add(line(x0,y0,x1,y0,stroke=INK,sw=1.2))
    svg.add(line(x0,y0,x0,y1,stroke=INK,sw=1.2))
    svg.add(line(x1,y0,x1,y1,stroke=INK,sw=1.2))
    svg.add(line(x0,y1,x1,y1,stroke=INK,sw=1.2))

def hgrid(svg, x0, x1, ys, stroke=RULE, sw=0.8):
    for y in ys:
        svg.add(line(x0,y,x1,y,stroke=stroke,sw=sw))

def vgrid(svg, y0, y1, xs, stroke=RULE, sw=0.8):
    for x in xs:
        svg.add(line(x,y0,x,y1,stroke=stroke,sw=sw))

def title_block(svg, w, title, subtitle, y0=30):
    svg.add(text(w/2, y0, title, fill=INK, size=18, weight=700, anchor="middle"))
    if subtitle:
        svg.add(text(w/2, y0+22, subtitle, fill=GRAPH, size=12, weight=400, anchor="middle"))

def legend(svg, items, x, y, size=12):
    """items: list of (label, color, dash)"""
    cy = y
    for label, color, dash in items:
        svg.add(line(x, cy-4, x+22, cy-4, stroke=color, sw=2.2, dash=dash))
        svg.add(text(x+30, cy, label, fill=INK, size=size))
        cy += 20

def read_csv(path):
    with open(path) as f:
        return list(csv.DictReader(f))

# ── paths ────────────────────────────────────────────────────────────────
FANOUT = "/home/z/my-project/upload/pkg-fanout/second-pass-agent-fanout-research"
WARM   = "/home/z/my-project/upload/pkg-warm/second-pass-warm-capacity-dossier"
OUT_A  = "/home/z/second-pass-web/public/research/agent-fanout/charts"
OUT_B  = "/home/z/second-pass-web/public/research/warm-capacity/charts"
os.makedirs(OUT_A, exist_ok=True)
os.makedirs(OUT_B, exist_ok=True)

# ════════════════════════════════════════════════════════════════════════
# ARTICLE A — FIGURE A1: Execution graph (topology diagram)
# ════════════════════════════════════════════════════════════════════════
def fig_a1_execution_graph():
    W, H = 900, 560
    svg = SVG(W, H)
    title_block(svg, W,
        "ONE EXTERNAL REQUEST CAN BECOME MANY INTERNAL OPERATIONS",
        "HOUSE ARCHITECTURE EXAMPLE — not a universal agent graph", y0=34)

    # node positions: user_request -> router -> specialists -> tools -> evaluator -> synthesis
    cx = W/2
    nodes = [
        # (id, label, x, y, w, h, fill, stroke)
        ("user", "USER REQUEST", cx, 95, 200, 38, PAPER, INK),
        ("router", "ROUTER (model call)", cx, 175, 240, 38, PAPER, SIGNAL),
        ("s1", "SPECIALIST 1", cx-280, 280, 150, 36, PAPER, INK),
        ("s2", "SPECIALIST 2", cx-95, 280, 150, 36, PAPER, INK),
        ("s3", "SPECIALIST 3", cx+90, 280, 150, 36, PAPER, INK),
        ("s4", "SPECIALIST 4", cx+275, 280, 150, 36, PAPER, INK),
        ("t1", "web search", cx-280, 365, 140, 30, PAPER, GRAPH),
        ("t2", "file search", cx-95, 365, 140, 30, PAPER, GRAPH),
        ("t3", "external API", cx+90, 365, 140, 30, PAPER, GRAPH),
        ("t4", "code sandbox", cx+275, 365, 140, 30, PAPER, GRAPH),
        ("eval", "EVALUATOR (model call)", cx, 460, 240, 38, PAPER, INK),
        ("synth", "FINAL SYNTHESIS (model call)", cx, 525, 280, 30, PAPER, SIGNAL),
    ]
    pos = {}
    for nid, label, x, y, w, h, fill, stroke in nodes:
        pos[nid] = (x, y, w, h)
        svg.add(rect(x-w/2, y-h/2, w, h, fill=fill, stroke=stroke, sw=1.6, rx=4))
        svg.add(text(x, y+4, label, fill=INK, size=11.5, weight=600, anchor="middle"))

    def arrow(x1,y1,x2,y2,stroke=GRAPH,sw=1.4):
        svg.add(line(x1,y1,x2,y2,stroke=stroke,sw=sw))
        # arrowhead
        ang = math.atan2(y2-y1, x2-x1)
        ah = 6
        ax1 = x2 - ah*math.cos(ang - math.pi/7)
        ay1 = y2 - ah*math.sin(ang - math.pi/7)
        ax2 = x2 - ah*math.cos(ang + math.pi/7)
        ay2 = y2 - ah*math.sin(ang + math.pi/7)
        svg.add(f'<path d="M{x2},{y2} L{ax1:.1f},{ay1:.1f} M{x2},{y2} L{ax2:.1f},{ay2:.1f}" '
                f'stroke="{stroke}" stroke-width="{sw}" fill="none"/>')

    # user -> router
    _, uy, uw, uh = pos["user"]; _, ry, rw, rh = pos["router"]
    arrow(cx, uy+uh/2, cx, ry-rh/2, stroke=INK, sw=1.6)
    # router -> specialists
    for sid in ["s1","s2","s3","s4"]:
        sx, sy, sw, sh = pos[sid]
        arrow(cx, ry+rh/2, sx, sy-sh/2, stroke=SIGNAL, sw=1.5)
    # specialists -> tools
    for sid, tid in [("s1","t1"),("s2","t2"),("s3","t3"),("s4","t4")]:
        sx, sy, sw, sh = pos[sid]
        tx, ty, tw, th = pos[tid]
        arrow(sx, sy+sh/2, tx, ty-th/2, stroke=GRAPH, sw=1.3)
    # specialists -> evaluator (join)
    ex, ey, ew, eh = pos["eval"]
    for sid in ["s1","s2","s3","s4"]:
        sx, sy, sw, sh = pos[sid]
        arrow(sx, sy+sh/2, ex-ew*0.3 + (sx-cx)*0.1, ey-eh/2, stroke=GRAPH, sw=1.3)
    # tools -> evaluator (dashed, optional join path)
    for tid in ["t1","t2","t3","t4"]:
        tx, ty, tw, th = pos[tid]
        arrow(tx, ty+th/2, ex+ew*0.3 + (tx-cx)*0.05, ey-eh/2, stroke=RULE, sw=1.0)
    # evaluator -> synthesis
    sx, sy, sw, sh = pos["synth"]
    arrow(cx, ey+eh/2, cx, sy-sh/2, stroke=INK, sw=1.6)

    # annotation
    svg.add(text(40, 95, "1 request", fill=GRAPH, size=11, weight=600))
    svg.add(text(W-40, 175, "router fans out", fill=SIGNAL, size=10.5, anchor="end"))
    svg.add(text(40, 525, "1 response", fill=GRAPH, size=11, weight=600))

    with open(f"{OUT_A}/chart-01-execution-graph.svg","w") as f:
        f.write(svg.out())
    print("  chart-01-execution-graph.svg")

# ════════════════════════════════════════════════════════════════════════
# ARTICLE A — FIGURE A2: Upstream RPS amplification
# ════════════════════════════════════════════════════════════════════════
def fig_a2_upstream_rps():
    rows = read_csv(f"{FANOUT}/04_FIGURES/figure-04-upstream-rps-data.csv")
    # columns: scenario, external_rps, model_rps, tool_rps
    # scenario names: A_SIMPLE_TOOL_AGENT, B_RESEARCH_AGENT, C_MULTI_AGENT_ENTERPRISE
    smap = {"A_SIMPLE_TOOL_AGENT":"A", "B_RESEARCH_AGENT":"B", "C_MULTI_AGENT_ENTERPRISE":"C"}
    scenarios = {}
    for r in rows:
        s = smap.get(r["scenario"], r["scenario"][0])
        scenarios.setdefault(s, []).append((float(r["external_rps"]),
                                            float(r["model_rps"])))
    W, H = 900, 560
    svg = SVG(W, H)
    title_block(svg, W,
        "EXTERNAL USER RPS AMPLIFIES INTO UPSTREAM MODEL-CALL RPS",
        "HOUSE SCENARIO / DERIVED RESULT — the 1:1 line is a reference, not typical traffic", y0=34)

    # plot area
    x0, y0, x1, y1 = 90, 100, 840, 470
    xmax = 200; ymax = 1600
    def px(x): return x0 + (x/xmax)*(x1-x0)
    def py(y): return y1 - (y/ymax)*(y1-y0)
    plot_box(svg, x0, y0, x1, y1)
    # gridlines
    for gx in [25,50,100,150,200]:
        svg.add(line(px(gx),y0,px(gx),y1,stroke=RULE,sw=0.7))
        svg.add(text(px(gx), y1+18, str(gx), fill=GRAPH, size=11, anchor="middle"))
    for gy in [200,400,600,800,1000,1200,1400,1600]:
        svg.add(line(x0,py(gy),x1,py(gy),stroke=RULE,sw=0.7))
        svg.add(text(x0-10, py(gy)+4, str(gy), fill=GRAPH, size=11, anchor="end"))
    # axis labels
    svg.add(text((x0+x1)/2, y1+44, "External user requests / second", fill=INK, size=13, weight=600, anchor="middle"))
    svg.add(text(28, (y0+y1)/2, "Upstream model calls / second", fill=INK, size=13, weight=600, anchor="middle", style="writing-mode:tb;transform:rotate(180deg);"))
    # 1:1 reference line
    svg.add(line(px(0),py(0),px(200),py(200),stroke=GRAPH,sw=1.3,dash="5,4"))
    svg.add(text(px(150)+8, py(150)-8, "1:1 reference", fill=GRAPH, size=10.5))

    colors = {"A":"#8A8A82", "B":SIGNAL, "C":"#3A3A35"}
    labels = {"A":"A — Simple tool agent (2.10 model calls/req)",
              "B":"B — Research agent (3.25 model calls/req)",
              "C":"C — Multi-agent enterprise (7.60 model calls/req)"}
    for s in ["A","B","C"]:
        pts = scenarios[s]
        d = " ".join(f"L{px(x):.1f},{py(y):.1f}" for x,y in pts)
        svg.add(f'<path d="M{px(pts[0][0]):.1f},{py(pts[0][1]):.1f} {d}" '
                f'fill="none" stroke="{colors[s]}" stroke-width="2.4"/>')
        for x,y in pts:
            svg.add(f'<circle cx="{px(x):.1f}" cy="{py(y):.1f}" r="3.5" fill="{colors[s]}"/>')

    # legend
    ly = 500
    for i,s in enumerate(["A","B","C"]):
        svg.add(line(110, ly+i*22-4, 132, ly+i*22-4, stroke=colors[s], sw=2.4))
        svg.add(text(140, ly+i*22, labels[s], fill=INK, size=11.5))
    # annotation at 100 RPS
    svg.add(line(px(100), y0, px(100), y1, stroke=SIGNAL, sw=1.0, dash="3,3", opacity=0.5))
    svg.add(text(px(100)+4, y0+14, "100 RPS", fill=SIGNAL, size=10.5, weight=600))
    # callouts for 100 RPS values
    svg.add(text(px(100)+8, py(325)-4, "325", fill=SIGNAL, size=11, weight=700))
    svg.add(text(px(100)+8, py(760)-4, "760", fill=colors["C"], size=11, weight=700))
    svg.add(text(px(100)+8, py(210)-4, "210", fill=colors["A"], size=11, weight=700))

    with open(f"{OUT_A}/chart-02-upstream-rps.svg","w") as f:
        f.write(svg.out())
    print("  chart-02-upstream-rps.svg")

# ════════════════════════════════════════════════════════════════════════
# ARTICLE A — FIGURE A3: Work vs critical path
# ════════════════════════════════════════════════════════════════════════
def fig_a3_work_vs_critical_path():
    rows = read_csv(f"{FANOUT}/04_FIGURES/figure-07-work-vs-critical-path-data.csv")
    # columns: parallel_branches, total_branch_work_seconds, expected_critical_path_seconds_exponential_iid, work_to_critical_ratio
    pts = [(int(r["parallel_branches"]), float(r["total_branch_work_seconds"]),
            float(r["expected_critical_path_seconds_exponential_iid"])) for r in rows]
    W, H = 900, 560
    svg = SVG(W, H)
    title_block(svg, W,
        "PARALLELISM AMPLIFIES WORK FASTER THAN CRITICAL-PATH LATENCY",
        "HOUSE TEACHING MODEL — IID exponential branches; real branch-latency distributions differ", y0=34)
    x0,y0,x1,y1 = 90,100,840,470
    xmax=16; ymax=17
    def px(x): return x0 + (x/xmax)*(x1-x0)
    def py(y): return y1 - (y/ymax)*(y1-y0)
    plot_box(svg,x0,y0,x1,y1)
    for gx in [2,4,6,8,10,12,14,16]:
        svg.add(line(px(gx),y0,px(gx),y1,stroke=RULE,sw=0.7))
        svg.add(text(px(gx), y1+18, str(gx), fill=GRAPH, size=11, anchor="middle"))
    for gy in [2,4,6,8,10,12,14,16]:
        svg.add(line(x0,py(gy),x1,py(gy),stroke=RULE,sw=0.7))
        svg.add(text(x0-10, py(gy)+4, f"{gy}s", fill=GRAPH, size=11, anchor="end"))
    svg.add(text((x0+x1)/2, y1+44, "Parallel branches (all required)", fill=INK, size=13, weight=600, anchor="middle"))
    svg.add(text(28, (y0+y1)/2, "Seconds (1 s mean per branch)", fill=INK, size=13, weight=600, anchor="middle", style="writing-mode:tb;transform:rotate(180deg);"))

    # total work — Signal Blue (headline: cost/rate dimension)
    d1 = " ".join(f"L{px(b):.1f},{py(w):.1f}" for b,w,_ in pts)
    svg.add(f'<path d="M{px(pts[0][0]):.1f},{py(pts[0][1]):.1f} {d1}" fill="none" stroke="{SIGNAL}" stroke-width="2.6"/>')
    for b,w,_ in pts:
        svg.add(f'<circle cx="{px(b):.1f}" cy="{py(w):.1f}" r="3.5" fill="{SIGNAL}"/>')
    # expected max — Graphite (latency dimension)
    d2 = " ".join(f"L{px(b):.1f},{py(c):.1f}" for b,_,c in pts)
    svg.add(f'<path d="M{px(pts[0][0]):.1f},{py(pts[0][2]):.1f} {d2}" fill="none" stroke="{GRAPH}" stroke-width="2.4"/>')
    for b,_,c in pts:
        svg.add(f'<circle cx="{px(b):.1f}" cy="{py(c):.1f}" r="3.5" fill="{GRAPH}"/>')

    # annotate n=8
    svg.add(line(px(8),y0,px(8),y1,stroke=RULE,sw=1.0,dash="3,3"))
    # work at 8 = 8s, max at 8 = 2.718s
    svg.add(text(px(8)+6, py(8)+4, "8 s work", fill=SIGNAL, size=11, weight=700))
    svg.add(text(px(8)+6, py(2.718)+16, "2.7 s max latency", fill=GRAPH, size=11, weight=700))

    # legend
    svg.add(line(130, 500-4, 152, 500-4, stroke=SIGNAL, sw=2.6))
    svg.add(text(160, 500, "Total branch work (cost / rate dimension)", fill=INK, size=11.5))
    svg.add(line(130, 522-4, 152, 522-4, stroke=GRAPH, sw=2.4))
    svg.add(text(160, 522, "Expected max latency (critical path)", fill=INK, size=11.5))

    with open(f"{OUT_A}/chart-03-work-vs-critical-path.svg","w") as f:
        f.write(svg.out())
    print("  chart-03-work-vs-critical-path.svg")

# ════════════════════════════════════════════════════════════════════════
# ARTICLE A — FIGURE A4: Cheap-many vs strong-few break-even (REDESIGNED)
# Two decision regions + Signal Blue boundary, no heatmap
# ════════════════════════════════════════════════════════════════════════
def fig_a4_break_even():
    rows = read_csv(f"{FANOUT}/04_FIGURES/figure-05-cheap-vs-expensive-break-even-data.csv")
    # columns: cheap_model_calls, web_search_calls, cheap_path_cost_usd, one_terra_call_cost_usd, cost_ratio
    # build grid: x = cheap_model_calls (1..20), y = web_search_calls (0..10)
    grid = {}
    for r in rows:
        x = int(r["cheap_model_calls"]); y = int(r["web_search_calls"])
        grid[(x,y)] = float(r["cost_ratio"])
    xs = sorted(set(k[0] for k in grid))  # 1..20
    ys = sorted(set(k[1] for k in grid))  # 0..10

    W,H = 900,560
    svg = SVG(W,H)
    title_block(svg, W,
        "CHEAP-MANY BECOMES MORE EXPENSIVE THAN ONE STRONG CALL",
        "HOUSE SCENARIO / DERIVED RESULT — fixed 2k input + 800 output; OpenAI standard short-context pricing", y0=34)
    x0,y0,x1,y1 = 110,100,820,470
    xmax=20; ymax=10
    def px(x): return x0 + (x/xmax)*(x1-x0)
    def py(y): return y1 - (y/ymax)*(y1-y0)

    # Decision regions: fill cells where ratio <= 1 (cheap wins) with Paper tint,
    # cells where ratio > 1 (strong wins) with a light graphite tint
    cellw = (x1-x0)/xmax; cellh = (y1-y0)/ymax
    for (x,y),ratio in grid.items():
        cx = x0 + (x-1)*cellw
        cy = y0 + y*cellh  # y=0 is bottom
        cy_top = y1 - (y+1)*cellh
        if ratio <= 1.0:
            fill = "#E6E1D5"  # slightly darker than Paper for "cheap wins"
        else:
            fill = "#D4CFC2"  # graphite tint for "strong wins"
        svg.add(rect(cx, cy_top, cellw, cellh, fill=fill, stroke="none", sw=0, rx=0))

    # plot box on top
    plot_box(svg,x0,y0,x1,y1)
    # gridlines
    for gx in [5,10,15,20]:
        svg.add(line(px(gx),y0,px(gx),y1,stroke=RULE,sw=0.7))
        svg.add(text(px(gx), y1+18, str(gx), fill=GRAPH, size=11, anchor="middle"))
    svg.add(text(x0-10, y1+4, "0", fill=GRAPH, size=11, anchor="end"))
    for gy in [2,4,6,8,10]:
        svg.add(line(x0,py(gy),x1,py(gy),stroke=RULE,sw=0.7))
        svg.add(text(x0-10, py(gy)+4, str(gy), fill=GRAPH, size=11, anchor="end"))

    svg.add(text((x0+x1)/2, y1+44, "Cheap-model calls (Luna, 2k input + 800 output)", fill=INK, size=13, weight=600, anchor="middle"))
    svg.add(text(32, (y0+y1)/2, "Web-search calls", fill=INK, size=13, weight=600, anchor="middle", style="writing-mode:tb;transform:rotate(180deg);"))

    # Break-even boundary: for each y, find the x where ratio crosses 1
    # ratio increases with x, so find first x where ratio > 1
    boundary = []
    for y in ys:
        for x in xs:
            if grid[(x,y)] > 1.0:
                boundary.append((x-0.5, y))  # boundary between x-1 and x
                break
        else:
            boundary.append((20.5, y))  # never crosses
    # draw boundary as Signal Blue step line
    if boundary:
        bx, by = boundary[0]
        path = f"M{px(bx):.1f},{py(by):.1f}"
        for bx, by in boundary[1:]:
            path += f" L{px(bx):.1f},{py(by):.1f}"
        # extend to top and bottom
        path_full = f"M{px(boundary[0][0]):.1f},{y0} " + path[1:] + f" L{px(boundary[-1][0]):.1f},{y1}"
        svg.add(f'<path d="{path_full}" fill="none" stroke="{SIGNAL}" stroke-width="2.8"/>')

    # region labels
    svg.add(text(px(3), py(8)+4, "CHEAP PATH WINS", fill=INK, size=13, weight=700, anchor="middle"))
    svg.add(text(px(3), py(8)+22, "(ratio < 1)", fill=GRAPH, size=11, anchor="middle"))
    svg.add(text(px(15), py(9)+4, "STRONG PATH WINS", fill=INK, size=13, weight=700, anchor="middle"))
    svg.add(text(px(15), py(9)+22, "(ratio > 1)", fill=GRAPH, size=11, anchor="middle"))

    # annotate key points
    # (5,1): ratio 1.235 — first crossing with a search
    svg.add(f'<circle cx="{px(5):.1f}" cy="{py(1):.1f}" r="5" fill="{INK}"/>')
    svg.add(text(px(5)+10, py(1)-6, "5 Luna + 1 search = $0.0168\n> 1 Terra call $0.0136", fill=INK, size=10.5, weight=600))
    # (10,0): exact break-even
    svg.add(f'<circle cx="{px(10):.1f}" cy="{py(0):.1f}" r="5" fill="{INK}"/>')
    svg.add(text(px(10)+10, py(0)+18, "10 Luna = 1 Terra\n(token-only break-even)", fill=INK, size=10.5, weight=600))

    # legend
    svg.add(rect(130, 500, 16, 12, fill="#E6E1D5", stroke=RULE, sw=0.8, rx=2))
    svg.add(text(154, 510, "cheap path cheaper", fill=INK, size=11))
    svg.add(rect(290, 500, 16, 12, fill="#D4CFC2", stroke=RULE, sw=0.8, rx=2))
    svg.add(text(314, 510, "strong path cheaper", fill=INK, size=11))
    svg.add(line(470, 506, 492, 506, stroke=SIGNAL, sw=2.8))
    svg.add(text(500, 510, "break-even boundary (ratio = 1)", fill=INK, size=11))

    with open(f"{OUT_A}/chart-04-cheap-vs-strong-break-even.svg","w") as f:
        f.write(svg.out())
    print("  chart-04-cheap-vs-strong-break-even.svg")

# ════════════════════════════════════════════════════════════════════════
# ARTICLE B — FIGURE B1: Cold-start timeline
# ════════════════════════════════════════════════════════════════════════
def fig_b1_cold_start():
    rows = read_csv(f"{WARM}/05_FIGURES/data/figure-01-cold-start-timeline.csv")
    # columns: stage, duration_s, classification, source_ids
    stages = [(r["stage"], float(r["duration_s"]), r.get("source_ids","")) for r in rows]
    if not stages:
        stages = [("Detection + autoscaler",5,"S01"),
                  ("GPU/node provisioning",20,"S02"),
                  ("Image pull",10,"S02"),
                  ("Weights download/transfer",25,"S02"),
                  ("Runtime/model initialization",10,"S02"),
                  ("Compile + memory profiling",10,"S07"),
                  ("Health check + routing",10,"S02")]

    W,H = 900,560
    svg = SVG(W,H)
    title_block(svg, W,
        "COLD START IS A CHAIN, NOT ONE DELAY",
        "HOUSE DECOMPOSITION — 90 s teaching total; no stage is a provider measurement", y0=34)
    total = sum(d for _,d,_ in stages)
    x0,y0,x1,y1 = 180,100,840,470
    barh = (y1-y0)/len(stages) * 0.72
    gap = (y1-y0)/len(stages) * 0.28
    xmax = 100
    def px(x): return x0 + (x/xmax)*(x1-x0)
    # x-axis gridlines
    for gx in [0,20,40,60,80,100]:
        svg.add(line(px(gx),y0,px(gx),y1,stroke=RULE,sw=0.7))
        svg.add(text(px(gx), y1+18, f"{gx}s", fill=GRAPH, size=11, anchor="middle"))
    svg.add(text((x0+x1)/2, y1+44, "Elapsed seconds from scale signal to traffic", fill=INK, size=13, weight=600, anchor="middle"))

    cum = 0
    for i,(stage,dur,src) in enumerate(stages):
        by = y0 + i*(barh+gap)
        # bar — Signal Blue for the longest stage (weights), Graphite otherwise
        col = SIGNAL if dur == max(d for _,d,_ in stages) else GRAPH
        svg.add(rect(x0, by, px(dur)-x0, barh, fill=col, stroke="none", sw=0, rx=2, opacity=0.85))
        # duration label
        svg.add(text(px(dur)+8, by+barh/2+4, f"{dur}s", fill=INK, size=12, weight=700))
        # stage label (left)
        svg.add(text(x0-12, by+barh/2+4, stage, fill=INK, size=11.5, weight=600, anchor="end"))
        # cumulative marker
        cum += dur
    # total annotation
    svg.add(text(x1-10, y0-10, f"Total ≈ {total}s", fill=INK, size=14, weight=700, anchor="end"))
    # note
    svg.add(text(x0, y1+72, "Sources: Ray Serve deployment initialization; AWS SageMaker; vLLM/Triton metrics. Stage durations are HOUSE values for accounting visibility.", fill=GRAPH, size=10.5))

    with open(f"{OUT_B}/chart-01-cold-start-timeline.svg","w") as f:
        f.write(svg.out())
    print("  chart-01-cold-start-timeline.svg")

# ════════════════════════════════════════════════════════════════════════
# ARTICLE B — FIGURE B2: Utilization vs p95 queue
# ════════════════════════════════════════════════════════════════════════
def fig_b2_utilization_queue():
    rows = read_csv(f"{WARM}/05_FIGURES/data/figure-02-utilization-vs-queue.csv")
    pts = [(float(r["rho"]), float(r["p95_queue_s"])) for r in rows]
    W,H = 900,560
    svg = SVG(W,H)
    title_block(svg, W,
        "p95 QUEUE WAIT CROSSES THE SLO BUDGET BEFORE 100% UTILIZATION",
        "M/M/10 TEACHING MODEL — the 79.3% crossing is model-specific, not a universal threshold", y0=34)
    x0,y0,x1,y1 = 90,100,840,470
    xmax=1.0; ymax=5.0
    def px(x): return x0 + (x/xmax)*(x1-x0)
    def py(y): return y1 - min(y,ymax)/ymax*(y1-y0)
    plot_box(svg,x0,y0,x1,y1)
    for gx in [0.5,0.6,0.7,0.8,0.9,1.0]:
        svg.add(line(px(gx),y0,px(gx),y1,stroke=RULE,sw=0.7))
        svg.add(text(px(gx), y1+18, f"{int(gx*100)}%", fill=GRAPH, size=11, anchor="middle"))
    for gy in [1,2,3,4,5]:
        svg.add(line(x0,py(gy),x1,py(gy),stroke=RULE,sw=0.7))
        svg.add(text(x0-10, py(gy)+4, f"{gy}s", fill=GRAPH, size=11, anchor="end"))
    svg.add(text((x0+x1)/2, y1+44, "Utilization ρ (M/M/10, μ = 2 req/s/replica)", fill=INK, size=13, weight=600, anchor="middle"))
    svg.add(text(28, (y0+y1)/2, "p95 queue wait", fill=INK, size=13, weight=600, anchor="middle", style="writing-mode:tb;transform:rotate(180deg);"))

    # main curve — Graphite
    d = " ".join(f"L{px(r):.1f},{py(p):.1f}" for r,p in pts if p < ymax*1.5)
    svg.add(f'<path d="M{px(pts[0][0]):.1f},{py(pts[0][1]):.1f} {d}" fill="none" stroke="{GRAPH}" stroke-width="2.4"/>')

    # SLO budget line — Signal Blue (the headline threshold)
    svg.add(line(x0, py(0.5), x1, py(0.5), stroke=SIGNAL, sw=2.0, dash="6,4"))
    svg.add(text(x1-8, py(0.5)-8, "0.5 s p95 SLO budget", fill=SIGNAL, size=11, weight=600, anchor="end"))

    # crossing vertical at 0.7934 — Signal Blue
    svg.add(line(px(0.7934), y0, px(0.7934), py(0.5), stroke=SIGNAL, sw=1.8, dash="4,3"))
    svg.add(text(px(0.7934)+6, y0+16, "crosses near 79.3%", fill=SIGNAL, size=11.5, weight=700))
    svg.add(text(px(0.7934)+6, y0+32, "ρ ≈ 0.7934", fill=SIGNAL, size=10.5))

    # annotation: mechanism
    svg.add(text(px(0.95), py(2.8), "as ρ → 1, tail bends vertical", fill=GRAPH, size=10.5, anchor="end"))

    with open(f"{OUT_B}/chart-02-utilization-vs-queue.svg","w") as f:
        f.write(svg.out())
    print("  chart-02-utilization-vs-queue.svg")

# ════════════════════════════════════════════════════════════════════════
# ARTICLE B — FIGURE B3: Service-time variance headroom
# ════════════════════════════════════════════════════════════════════════
def fig_b3_service_variance():
    rows = read_csv(f"{WARM}/05_FIGURES/data/figure-06-service-variance-headroom.csv")
    # columns: rho, lambda_rps, service_mean_s, service_cv, k, seed, p50, p95, p99, mean
    by_cv = {}
    for r in rows:
        cv = float(r["service_cv"])
        by_cv.setdefault(cv, []).append((float(r["rho"]), float(r["p95"])))
    W,H = 900,560
    svg = SVG(W,H)
    title_block(svg, W,
        "SAME UTILIZATION, DIFFERENT TAIL WHEN SERVICE TIME VARIES",
        "M/G/10 SIMULATION — Poisson arrivals, lognormal service, mean 0.5 s, seed 20260811", y0=34)
    x0,y0,x1,y1 = 90,100,840,470
    xmax=0.9; ymax=1.3
    def px(x): return x0 + (x/xmax)*(x1-x0)
    def py(y): return y1 - (y/ymax)*(y1-y0)
    plot_box(svg,x0,y0,x1,y1)
    for gx in [0.65,0.7,0.75,0.8,0.85,0.9]:
        svg.add(line(px(gx),y0,px(gx),y1,stroke=RULE,sw=0.7))
        svg.add(text(px(gx), y1+18, f"{int(gx*100)}%", fill=GRAPH, size=11, anchor="middle"))
    for gy in [0.2,0.4,0.6,0.8,1.0,1.2]:
        svg.add(line(x0,py(gy),x1,py(gy),stroke=RULE,sw=0.7))
        svg.add(text(x0-10, py(gy)+4, f"{gy}s", fill=GRAPH, size=11, anchor="end"))
    svg.add(text((x0+x1)/2, y1+44, "Utilization ρ (k = 10 replicas)", fill=INK, size=13, weight=600, anchor="middle"))
    svg.add(text(28, (y0+y1)/2, "Simulated p95 queue wait", fill=INK, size=13, weight=600, anchor="middle", style="writing-mode:tb;transform:rotate(180deg);"))

    # CV=1.5 (high variance) — Signal Blue (headline: variance breaks the rule)
    colors = {0.3:GRAPH, 1.0:"#8A8A82", 1.5:SIGNAL}
    labels = {0.3:"CV = 0.3 (low variance)", 1.0:"CV = 1.0", 1.5:"CV = 1.5 (high variance)"}
    for cv in sorted(by_cv.keys()):
        pts = sorted(by_cv[cv])
        d = " ".join(f"L{px(r):.1f},{py(p):.1f}" for r,p in pts)
        svg.add(f'<path d="M{px(pts[0][0]):.1f},{py(pts[0][1]):.1f} {d}" fill="none" stroke="{colors[cv]}" stroke-width="2.4"/>')
        for r,p in pts:
            svg.add(f'<circle cx="{px(r):.1f}" cy="{py(p):.1f}" r="3.5" fill="{colors[cv]}"/>')

    # annotate 80% utilization
    svg.add(line(px(0.8),y0,px(0.8),y1,stroke=RULE,sw=1.0,dash="3,3"))
    svg.add(text(px(0.8)+6, y0+14, "80% utilization", fill=GRAPH, size=10.5, weight=600))
    # callout: at 80%, CV=0.3 → 0.283s; CV=1.5 → 0.723s
    svg.add(text(px(0.8)+6, py(0.283), "0.28 s", fill=GRAPH, size=11, weight=700))
    svg.add(text(px(0.8)+6, py(0.723), "0.72 s", fill=SIGNAL, size=11, weight=700))
    svg.add(text(px(0.8)+60, (py(0.283)+py(0.723))/2, "2.5x tail difference\nat the SAME utilization", fill=INK, size=10.5, weight=600))

    # legend
    ly = 500
    for i,cv in enumerate([0.3,1.0,1.5]):
        svg.add(line(150, ly+i*22-4, 172, ly+i*22-4, stroke=colors[cv], sw=2.4))
        svg.add(text(180, ly+i*22, labels[cv], fill=INK, size=11.5))

    with open(f"{OUT_B}/chart-03-service-variance-headroom.svg","w") as f:
        f.write(svg.out())
    print("  chart-03-service-variance-headroom.svg")

# ════════════════════════════════════════════════════════════════════════
# ARTICLE B — FIGURE B4: Burst vs delayed scale-out
# ════════════════════════════════════════════════════════════════════════
def fig_b4_burst_vs_scale():
    rows = read_csv(f"{WARM}/05_FIGURES/data/figure-03-burst-vs-delayed-scale.csv")
    # columns: time_s, demand_rps, capacity_rps
    pts = [(float(r["time_s"]), float(r["demand_rps"]), float(r["capacity_rps"])) for r in rows]
    W,H = 900,560
    svg = SVG(W,H)
    title_block(svg, W,
        "THE QUEUE ACCUMULATES 200 REQUESTS BEFORE SCALE-OUT ARRIVES",
        "HOUSE SCENARIO / DERIVED RESULT — fluid approximation; 7-replica warm pool, 20 s scale delay", y0=34)
    x0,y0,x1,y1 = 90,100,840,470
    xmax=150; ymax=32
    def px(x): return x0 + (x/xmax)*(x1-x0)
    def py(y): return y1 - (y/ymax)*(y1-y0)
    plot_box(svg,x0,y0,x1,y1)
    for gx in [0,20,40,60,80,100,120,140]:
        svg.add(line(px(gx),y0,px(gx),y1,stroke=RULE,sw=0.7))
        svg.add(text(px(gx), y1+18, str(gx), fill=GRAPH, size=11, anchor="middle"))
    for gy in [5,10,15,20,25,30]:
        svg.add(line(x0,py(gy),x1,py(gy),stroke=RULE,sw=0.7))
        svg.add(text(x0-10, py(gy)+4, str(gy), fill=GRAPH, size=11, anchor="end"))
    svg.add(text((x0+x1)/2, y1+44, "Seconds from burst start", fill=INK, size=13, weight=600, anchor="middle"))
    svg.add(text(28, (y0+y1)/2, "Requests / second", fill=INK, size=13, weight=600, anchor="middle", style="writing-mode:tb;transform:rotate(180deg);"))

    # demand — Signal Blue (the burst)
    dd = " ".join(f"L{px(t):.1f},{py(d):.1f}" for t,d,_ in pts)
    svg.add(f'<path d="M{px(pts[0][0]):.1f},{py(pts[0][1]):.1f} {dd}" fill="none" stroke="{SIGNAL}" stroke-width="2.6"/>')
    # capacity — Graphite
    cd = " ".join(f"L{px(t):.1f},{py(c):.1f}" for t,_,c in pts)
    svg.add(f'<path d="M{px(pts[0][0]):.1f},{py(pts[0][2]):.1f} {cd}" fill="none" stroke="{GRAPH}" stroke-width="2.6"/>')

    # shade the backlog area (between demand and capacity from t=0 to t=20)
    # demand=24, capacity=14 for t in [0,20]
    poly = (f"M{px(0):.1f},{py(14):.1f} L{px(20):.1f},{py(14):.1f} "
            f"L{px(20):.1f},{py(24):.1f} L{px(0):.1f},{py(24):.1f} Z")
    svg.add(f'<path d="{poly}" fill="{SIGNAL}" opacity="0.12"/>')
    svg.add(text(px(10), (py(14)+py(24))/2+4, "200 queued\nrequests", fill=SIGNAL, size=12, weight=700, anchor="middle"))

    # scale-out marker
    svg.add(line(px(20),y0,px(20),y1,stroke=SIGNAL,sw=1.4,dash="4,3"))
    svg.add(text(px(20)+6, y0+14, "scale-out\narrives (t=20s)", fill=SIGNAL, size=10.5, weight=600))

    # legend
    svg.add(line(150, 500-4, 172, 500-4, stroke=SIGNAL, sw=2.6))
    svg.add(text(180, 500, "Demand (24 req/s burst for 120 s)", fill=INK, size=11.5))
    svg.add(line(470, 500-4, 492, 500-4, stroke=GRAPH, sw=2.6))
    svg.add(text(500, 500, "Serving capacity (14 → 30 req/s)", fill=INK, size=11.5))

    with open(f"{OUT_B}/chart-04-burst-vs-delayed-scale.svg","w") as f:
        f.write(svg.out())
    print("  chart-04-burst-vs-delayed-scale.svg")

# ════════════════════════════════════════════════════════════════════════
# ARTICLE B — FIGURE B5: Economic optimum vs hard SLO floor (SIGNATURE)
# ════════════════════════════════════════════════════════════════════════
def fig_b5_economic_vs_slo():
    rows = read_csv(f"{WARM}/05_FIGURES/data/figure-04-warm-cost-vs-undercapacity-loss.csv")
    # columns: scenario,k,warm_capacity_rps,...,warm_cost_per_h,expected_undercapacity_loss_per_h,expected_total_cost_per_h,...
    pts = []
    for r in rows:
        k = int(r["k"])
        wc = float(r["warm_cost_per_h"])
        loss = float(r["expected_undercapacity_loss_per_h"])
        tot = float(r["expected_total_cost_per_h"])
        pts.append((k, wc, loss, tot))
    W,H = 900,580
    svg = SVG(W,H)
    title_block(svg, W,
        "ECONOMIC OPTIMUM (7) ≠ HARD SLO FLOOR (11)",
        "HOUSE SCENARIO / DERIVED RESULT — the two boundaries answer different questions", y0=34)
    x0,y0,x1,y1 = 90,110,840,470
    xmax=17; ymax=82
    def px(x): return x0 + (x/xmax)*(x1-x0)
    def py(y): return y1 - (y/ymax)*(y1-y0)
    plot_box(svg,x0,y0,x1,y1)
    for gx in [7,8,9,10,11,12,13,14,15,16,17]:
        svg.add(line(px(gx),y0,px(gx),y1,stroke=RULE,sw=0.7))
        svg.add(text(px(gx), y1+18, str(gx), fill=GRAPH, size=11, anchor="middle"))
    for gy in [0,10,20,30,40,50,60,70,80]:
        svg.add(line(x0,py(gy),x1,py(gy),stroke=RULE,sw=0.7))
        svg.add(text(x0-10, py(gy)+4, f"${gy}", fill=GRAPH, size=11, anchor="end"))
    svg.add(text((x0+x1)/2, y1+44, "Warm replicas (k)", fill=INK, size=13, weight=600, anchor="middle"))
    svg.add(text(28, (y0+y1)/2, "USD / hour", fill=INK, size=13, weight=600, anchor="middle", style="writing-mode:tb;transform:rotate(180deg);"))

    # warm holding cost — Graphite
    d1 = " ".join(f"L{px(k):.1f},{py(wc):.1f}" for k,wc,_,_ in pts)
    svg.add(f'<path d="M{px(pts[0][0]):.1f},{py(pts[0][1]):.1f} {d1}" fill="none" stroke="{GRAPH}" stroke-width="2.2"/>')
    # undercapacity loss — light graphite
    d2 = " ".join(f"L{px(k):.1f},{py(loss):.1f}" for k,_,loss,_ in pts)
    svg.add(f'<path d="M{px(pts[0][0]):.1f},{py(pts[0][2]):.1f} {d2}" fill="none" stroke="#9C968A" stroke-width="2.2" stroke-dasharray="5,3"/>')
    # total — Signal Blue (headline)
    d3 = " ".join(f"L{px(k):.1f},{py(tot):.1f}" for k,_,_,tot in pts)
    svg.add(f'<path d="M{px(pts[0][0]):.1f},{py(pts[0][3]):.1f} {d3}" fill="none" stroke="{SIGNAL}" stroke-width="2.8"/>')
    for k,_,_,tot in pts:
        svg.add(f'<circle cx="{px(k):.1f}" cy="{py(tot):.1f}" r="3.5" fill="{SIGNAL}"/>')

    # markers at k=7 (economic min) and k=11 (hard SLO floor)
    svg.add(line(px(7),y0,px(7),py(49.73),stroke=SIGNAL,sw=1.6,dash="4,3"))
    svg.add(text(px(7)-8, py(49.73)-10, "k=7\n$49.73/h\neconomic\nminimum", fill=SIGNAL, size=10.5, weight=700, anchor="end"))
    svg.add(f'<circle cx="{px(7):.1f}" cy="{py(49.73):.1f}" r="6" fill="none" stroke="{SIGNAL}" stroke-width="2.2"/>')

    svg.add(line(px(11),y0,px(11),py(56.62),stroke=INK,sw=1.6,dash="4,3"))
    svg.add(text(px(11)+8, py(56.62)-10, "k=11\n$56.62/h\nhard SLO\nfloor", fill=INK, size=10.5, weight=700))
    svg.add(f'<circle cx="{px(11):.1f}" cy="{py(56.62):.1f}" r="6" fill="none" stroke="{INK}" stroke-width="2.2"/>')

    # legend
    svg.add(line(140, 510-4, 162, 510-4, stroke=GRAPH, sw=2.2))
    svg.add(text(170, 510, "Warm holding cost", fill=INK, size=11.5))
    svg.add(line(320, 510-4, 342, 510-4, stroke="#9C968A", sw=2.2, dash="5,3"))
    svg.add(text(350, 510, "Expected undercapacity loss", fill=INK, size=11.5))
    svg.add(line(560, 510-4, 582, 510-4, stroke=SIGNAL, sw=2.8))
    svg.add(text(590, 510, "Expected total cost", fill=INK, size=11.5))

    with open(f"{OUT_B}/chart-05-economic-optimum-vs-hard-slo.svg","w") as f:
        f.write(svg.out())
    print("  chart-05-economic-optimum-vs-hard-slo.svg")

# ════════════════════════════════════════════════════════════════════════
# ARTICLE B — FIGURE B6: Warm floor vs scale delay
# ════════════════════════════════════════════════════════════════════════
def fig_b6_warm_floor_vs_delay():
    rows = read_csv(f"{WARM}/05_FIGURES/data/figure-05-optimal-warm-vs-scale-delay.csv")
    # columns: scale_delay_s, economic_optimal_k, economic_total_cost_per_h, strict_burst_survival_k, hard_slo_floor_k
    pts = [(float(r["scale_delay_s"]), int(r["economic_optimal_k"]),
            int(r["strict_burst_survival_k"])) for r in rows]
    W,H = 900,560
    svg = SVG(W,H)
    title_block(svg, W,
        "LONGER COLD STARTS PUSH THE WARM FLOOR UPWARD",
        "HOUSE SCENARIO — economic optimum is robust to scale delay until the delay gets long enough", y0=34)
    x0,y0,x1,y1 = 90,100,840,470
    xmax=120; ymax=13
    def px(x): return x0 + (x/xmax)*(x1-x0)
    def py(y): return y1 - (y/ymax)*(y1-y0)
    plot_box(svg,x0,y0,x1,y1)
    for gx in [0,20,40,60,80,100,120]:
        svg.add(line(px(gx),y0,px(gx),y1,stroke=RULE,sw=0.7))
        svg.add(text(px(gx), y1+18, str(gx), fill=GRAPH, size=11, anchor="middle"))
    for gy in [7,8,9,10,11,12,13]:
        svg.add(line(x0,py(gy),x1,py(gy),stroke=RULE,sw=0.7))
        svg.add(text(x0-10, py(gy)+4, str(gy), fill=GRAPH, size=11, anchor="end"))
    svg.add(text((x0+x1)/2, y1+44, "Scale-up delay (seconds)", fill=INK, size=13, weight=600, anchor="middle"))
    svg.add(text(28, (y0+y1)/2, "Warm replicas", fill=INK, size=13, weight=600, anchor="middle", style="writing-mode:tb;transform:rotate(180deg);"))

    # economic optimum — Graphite
    econ = sorted(set((d,k) for d,k,_ in pts))
    d1 = f"M{px(econ[0][0]):.1f},{py(econ[0][1]):.1f}"
    for i in range(1,len(econ)):
        # step: horizontal then vertical
        d1 += f" L{px(econ[i][0]):.1f},{py(econ[i-1][1]):.1f} L{px(econ[i][0]):.1f},{py(econ[i][1]):.1f}"
    svg.add(f'<path d="{d1}" fill="none" stroke="{GRAPH}" stroke-width="2.4"/>')
    for d,k in econ:
        svg.add(f'<circle cx="{px(d):.1f}" cy="{py(k):.1f}" r="3.5" fill="{GRAPH}"/>')

    # hard SLO floor — Signal Blue (the binding constraint)
    hard = sorted(set((d,k) for d,_,k in pts))
    d2 = f"M{px(hard[0][0]):.1f},{py(hard[0][1]):.1f}"
    for i in range(1,len(hard)):
        d2 += f" L{px(hard[i][0]):.1f},{py(hard[i-1][1]):.1f} L{px(hard[i][0]):.1f},{py(hard[i][1]):.1f}"
    svg.add(f'<path d="{d2}" fill="none" stroke="{SIGNAL}" stroke-width="2.6"/>')
    for d,k in hard:
        svg.add(f'<circle cx="{px(d):.1f}" cy="{py(k):.1f}" r="3.5" fill="{SIGNAL}"/>')

    # annotate 20s scale delay (the HOUSE case)
    svg.add(line(px(20),y0,px(20),y1,stroke=RULE,sw=1.0,dash="3,3"))
    svg.add(text(px(20)+6, y0+14, "20 s\n(HOUSE case)", fill=INK, size=10.5, weight=600))
    svg.add(text(px(20)+6, py(11)+4, "k=11", fill=SIGNAL, size=11, weight=700))
    svg.add(text(px(20)+6, py(7)+4, "k=7", fill=GRAPH, size=11, weight=700))

    # legend
    svg.add(line(150, 500-4, 172, 500-4, stroke=GRAPH, sw=2.4))
    svg.add(text(180, 500, "Economic optimum", fill=INK, size=11.5))
    svg.add(line(340, 500-4, 362, 500-4, stroke=SIGNAL, sw=2.6))
    svg.add(text(370, 500, "Hard SLO floor (burst-survival inequality)", fill=INK, size=11.5))

    with open(f"{OUT_B}/chart-06-warm-floor-vs-scale-delay.svg","w") as f:
        f.write(svg.out())
    print("  chart-06-warm-floor-vs-scale-delay.svg")

# ── run all ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Generating Article A figures (agent-fanout):")
    fig_a1_execution_graph()
    fig_a2_upstream_rps()
    fig_a3_work_vs_critical_path()
    fig_a4_break_even()
    print("Generating Article B figures (warm-capacity):")
    fig_b1_cold_start()
    fig_b2_utilization_queue()
    fig_b3_service_variance()
    fig_b4_burst_vs_scale()
    fig_b5_economic_vs_slo()
    fig_b6_warm_floor_vs_delay()
    print("All 10 SVGs generated.")
