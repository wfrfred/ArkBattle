#!/usr/bin/env python3
"""Build bounded Skill/payment counts without treating native types as project API."""
import argparse
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).parent
ROOT = Path.cwd()


def fingerprint(path):
    raw = path.read_bytes()
    return dict(path=str(path), bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    source = HERE / 'content.json'
    data = json.loads(source.read_text())['result']
    by_skill = {row['skillId']: row for row in data['bindings']}
    participants = []
    for key in data['feverSkillIds']:
        row = by_skill[key]
        components = [c for c in data['components'] if c['script']['cl'] == 'FeverCommonBehaviour'
                      and c['ancestry'][0]['name'] in row['prefabIds']]
        participants.append(dict(**row, behaviourPathIds=[c['pathId'] for c in components],
                                 normalMaxLevel=data['skills'][key]['levels'][-1]))
    reused = [
        'docs/research/evidence/skill-audit-20261117/sustain/native.json',
        'docs/research/evidence/skill-parameter-formulas-20261029/duration-native.json',
        'docs/research/evidence/skill-parameter-formulas-20261029/sp-native.json',
        'docs/research/evidence/skill-modifier-20261029/content.json',
        'docs/research/evidence/skill-audit-20261117/sp/content.json',
    ]
    result = dict(
        scope='Fresh Fever count is complete only for installed [uc]skills.ab. Payment examples are targeted; these counts are not a census of all game Skills.',
        counts=data['counts'], feverParticipants=participants,
        classifications=[
            dict(mechanism='Fever SP exemption', skillIds=data['feverSkillIds'], count=11,
                 changes=['effective numeric launch threshold', 'effective numeric payment'],
                 budgetTypeChangeProven=False, wholeActivationProgramReplacementProven=False,
                 boundary='Other Fever lifetime/control behaviour is not reduced to payment and is covered by the sustain branch.'),
            dict(mechanism='Lumen S2', skillIds=['skchr_lumen_2'], count=1,
                 changes=['charged-result sample', 'explicit current-SP clear'],
                 budgetTypeChangeProven=False, wholeActivationProgramReplacementProven=False,
                 evidence='Bound BuffDuringSkill installs lumen_s_2_enhance_judge: event0 checks available count>=2 before ClearCharacterSp.'),
            dict(mechanism='Viviana S1', skillIds=['skchr_vvana_1'], count=1,
                 changes=['latched charged mode', 'normal base payment or mode-owned SP clear'],
                 budgetTypeChangeProven=False, wholeActivationProgramReplacementProven=False,
                 evidence='Bound SpRatioToggleChecker and unmanaged vvana_s_1[mode]; event33 clears SP and event20 ends that mode.',
                 boundary='A current balance alone does not reconstruct an already-latched mode; downstream alternative attack programs are content, not proof the Activation callback contract must change.'),
            dict(mechanism='Catap2 S1/S2 charge conversion', skillIds=['skchr_catap2_1', 'skchr_catap2_2'], count=2,
                 changes=['first-charge payment', 'remaining-SP sample/clear', 'numeric extension of current duration'],
                 budgetTypeChangeProven=False, wholeActivationProgramReplacementProven=False,
                 evidence='Prior complete Case09§2.7 native and binding: first charge is paid before the trigger reads remaining SP, clears it and extends current Ability duration.'),
        ],
        unresolved=[
            dict(mechanism='SpScaleAfterSkillCast', level='native method/fields, no actual supported-content binding closed in the cited records',
                 count=None, boundary='The existing [uc]skills field scan only found three Swire ModifySpDataAfterSkillCast components; no claim of all-client absence.'),
            dict(mechanism='act2autochess_bond_eff_sunt', level='fixed activity-table selection and community battle-start note; native runtime binding unclosed',
                 count=None, boundary='Not counted as a live configuration-switch example. PRTS says battle-start SP requirement reduction to 70%, floored, possibly zero.'),
        ],
        inference='This branch proves numeric sampling and explicit resource/time operations, not a need for arbitrary complete Definition replacement. It also does not prove intrinsic payment rules obey the Attribute modifier algebra.'
    )
    payload = dict(provenance=dict(script=fingerprint(Path(__file__)), content=fingerprint(source), reused=[fingerprint(ROOT / p) for p in reused]), result=result)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(feverSkillIds=len(participants), selectedPaymentSkillIds=13, otherChargeExamples=2)))


if __name__ == '__main__':
    main()
