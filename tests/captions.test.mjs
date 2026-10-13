import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSrt,parseTimestamp,cueAt,validateCaptionDuration} from '../scripts/captions-core.mjs';
const src='1\r\n00:00:00,000 --> 00:00:02,000\r\nأهلاً بك في الفيلم\r\n\r\n2\r\n00:00:02,250 --> 00:00:04,000\r\nMotion احترافي\r\n';
test('SRT preserves original Arabic wording and precise millisecond timing',()=>{
 const cues=parseSrt(src);
 assert.equal(cues.length,2);
 assert.equal(cues[0].text,'أهلاً بك في الفيلم');
 assert.equal(cues[1].start,2.25);
 assert.equal(cueAt(cues,1.5)?.id,'caption-0001');
 assert.equal(cueAt(cues,2.1),null);
 assert.equal(cueAt(cues,2.3)?.text,'Motion احترافي');
});
test('reject invalid timestamps and overlapping cues',()=>{
 assert.throws(()=>parseTimestamp('00:80:12,000'),/range/);
 assert.throws(()=>parseSrt('1\n00:00:02,000 --> 00:00:01,000\nمرحبا'),/Nonpositive/);
 assert.throws(()=>parseSrt('1\n00:00:00,000 --> 00:00:02,000\nأ\n\n2\n00:00:01,000 --> 00:00:03,000\nب'),/overlap/);
});
test('reject captions longer than storyboard with exact duration check',()=>{
 const cues=parseSrt(src);
 assert.equal(validateCaptionDuration(cues,4),true);
 assert.throws(()=>validateCaptionDuration(cues,3.5),/beyond/);
});
