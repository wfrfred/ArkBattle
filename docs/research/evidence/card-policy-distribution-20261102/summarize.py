#!/usr/bin/env python3
"""Summarize serialized policy configurations, without treating them as playable-card counts."""
import argparse,collections,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('controllers',type=Path);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
x=json.loads(a.controllers.read_text());tokens=[r for r in x['controllers'] if r['name'].startswith('token_')]
assert len({(r['bundle'],r['file'],r['pathId']) for r in x['controllers']})==len(x['controllers'])
summary=dict(date='2026-11-02',countsAre='Serialized controller configurations, not verified playable cards, release status or live overrides.',bundles=len(x['sources']),allPolicyCounts=dict(collections.Counter(r['fields']['_cardPolicy']['value'] for r in x['controllers'])),tokenPolicyCounts=dict(collections.Counter(r['fields']['_cardPolicy']['value'] for r in tokens)),tokenCombinations=[])
keys=['_cardPolicy','_isInfinity','_rechargeOnlyOnce']
for key,count in sorted(collections.Counter(tuple(r['fields'][k]['value'] for k in keys) for r in tokens).items()):
 summary['tokenCombinations'].append(dict(policy=key[0],isInfinity=key[1],rechargeOnlyOnce=key[2],count=count,examples=[r['name'] for r in tokens if tuple(r['fields'][k]['value'] for k in keys)==key][:4]))
a.out.write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print('controllers',len(x['controllers']),'token-prefixed',len(tokens))
