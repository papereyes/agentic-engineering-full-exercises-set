# Graph Provenance

## Toolchain and corpus

- Graphify package: `graphifyy 0.9.53`
- Graphify package-metadata SHA-256: `3f3b7f9b0c11968f69311708d7c0a1f3cee188f8c5e502184f61d1d0b21d31a0`
- Graphify executable SHA-256: `2fef1b700d2ab8dd44a82cf2502f8c004daeffef7e2d4973a255dd85d8cc5fc4`
- rtk version: `0.43.0`
- Corpus root: `/tmp/agentic-exercise-03-03-after/03 Context Engineering/exercise-03-graphify-billing-knowledge-graph`
- Source commit: `52090edddf032d026ece16ef90feb627bf8e67ac`
- Source tree: `606c9f3487a4c6c6f4815cb40d86af676f05b5c6`

The Graphify installation metadata and executable have filesystem timestamps of `2026-09-02T10:53:58Z`, before the graph build at `2026-09-02T11:05:16Z`. `built_at_commit` identifies the corpus input snapshot; it is not presented as a Graphify build identifier.

## Creation command

The Graphify pipeline used its pinned interpreter after structural and semantic extraction were merged. The exact graph creation command was:

```text
rtk /home/papereyes/.local/share/uv/tools/graphifyy/bin/python -c "import json; from pathlib import Path; from graphify.build import build_from_json; from graphify.cluster import cluster,score_all; from graphify.analyze import god_nodes,surprising_connections,suggest_questions; from graphify.report import generate; from graphify.export import to_json; x=json.loads(Path('graphify-out/.graphify_extract.json').read_text()); d=json.loads(Path('graphify-out/.graphify_detect.json').read_text()); G=build_from_json(x,root='.',directed=False); assert G.number_of_nodes()>0; communities=cluster(G); cohesion=score_all(G,communities); tokens={'input':x.get('input_tokens',0),'output':x.get('output_tokens',0)}; gods=god_nodes(G); surprises=surprising_connections(G,communities); labels={cid:'Community '+str(cid) for cid in communities}; questions=suggest_questions(G,communities,labels); assert to_json(G,communities,'graphify-out/graph.json'); report=generate(G,communities,cohesion,labels,gods,surprises,d,tokens,'.',suggested_questions=questions); Path('graphify-out/GRAPH_REPORT.md').write_text(report,encoding='utf-8'); Path('graphify-out/.graphify_analysis.json').write_text(json.dumps({'communities':{str(k):v for k,v in communities.items()},'cohesion':{str(k):v for k,v in cohesion.items()},'gods':gods,'surprises':surprises,'questions':questions},indent=2,ensure_ascii=False),encoding='utf-8'); print(f'Graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities')"
```

Output:

```text
Graph: 168 nodes, 220 edges, 14 communities
Exit code: 0
```

The labeled HTML artifact was then created with:

```text
rtk graphify export html --graph graphify-out/graph.json --labels graphify-out/.graphify_labels.json
graph.html written - open in any browser, no server needed
Exit code: 0
```

The treatment-session refresh command was:

```text
rtk graphify reflect --if-stale
Lessons already up to date -> graphify-out/reflections/LESSONS.md (skipped; omit --if-stale to force)
Exit code: 0
```

The build command, output, and exit code are retained in Codex session `01a05b7a-3177-7d42-ac74-949c6c938ed4`; its JSONL SHA-256 is `c9ef9277dbcdde8d9547a3dd4f52072c9435ce8733638fa81a11b7db3576576f`.
