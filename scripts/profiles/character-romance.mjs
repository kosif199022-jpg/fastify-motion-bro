import {ensure,asText,cloneSession,fresh,response} from './core.mjs';
export const id='character-romance';
const GIRL='[CHARACTER A LOCK] Original family-friendly stylized 3D girl, young adult, warm brown skin, shoulder-length curly dark hair with a pale-blue ribbon, emerald-green jacket and cream boots, warm expressive eyes, rounded premium animated-feature proportions. Same face shape, outfit, hair and color in EVERY frame.';
const DOLL='[CHARACTER B LOCK] Original colorful doll-like living figure, friendly smooth porcelain-like face, lilac bob hair, coral and turquoise patchwork clothing, bright amber button-style decorations (not eyes), teal boots, expressive eye shapes, waist-high relative to Character A. Same face, outfit, height ratio and color every frame.';
const setting='[WORLD LOCK] Original fairytale urban park at late golden hour, warm pastel skies, soft cinematic bounce lighting, round trees, cobblestone path, lush but uncluttered storybook 3D atmosphere, no borrowed movie/franchise character designs, no existing branded toys.';
export function start(){return response(fresh(id,'SETUP'),'Tell me the optional emotion/setting of the two-character love story (or reply DEFAULT). The two ORIGINAL characters and storybook world will be locked across every scene. We will output image prompts, not generate images unless requested.');}
export function respond(previous,input){
 const s=cloneSession(previous,id);ensure(s.stage==='SETUP','Setup must be completed first');
 const direction=asText(typeof input==='string'?input:input?.direction)||'A rainy day becomes a brave promise';
 const beats=[
 ['Meeting','A catches a falling paper crane while B watches with surprise.'],
 ['Trust','A quietly repairs B’s torn little umbrella during unexpected rain.'],
 ['Distance','A suddenly has to leave and gives B the paper crane.'],
 ['Return','B follows the floating crane back through the park at sunset.'],
 ['Promise','They find one another at the original bench, sharing a wordless promise.']
 ];
 const images=beats.flatMap(([name,action],i)=>[0,1].map(j=>({
 scene:i+1,frame:j+1,prompt:GIRL+'\n'+DOLL+'\n'+setting+'\nScene '+(i+1)+' '+name+' — '+action+' Emotion: '+direction+'. '+(j===0?'Establishing wide 35mm view with both characters and layered depth, balanced silhouettes, story continuity.':'Intimate 85mm emotional close-up of both characters responding through hands, posture and eyes; preserve exact identities.')+' Premium family animation-style 3D lighting, filmic atmospheric depth, 9:16 clean framing, visually rich physically consistent textures; never replace either character.'
 })));
 const narration=[
 'One day, a tiny paper crane brought two strangers into the same story.',
 'When the rain began, kindness became a language they both understood.',
 'Then the road between them seemed much longer than either expected.',
 'But the smallest promise can find its way across the biggest distance.',
 'They met again where everything began, and chose not to let go.'
 ];
 ensure(images.length===10,'Must have at least two image prompts for five scenes');
 const output='CHARACTER DESIGN:\n'+GIRL+'\n\n'+DOLL+'\n\n'+setting+'\n\nLove story: '+direction+'\n'+beats.map(([name,action],i)=>'SCENE '+(i+1)+' — '+name+'\nBeat: '+action+'\nImage prompt A:\n'+images[i*2].prompt+'\nImage prompt B:\n'+images[i*2+1].prompt+'\nSuggested voice-over:\n'+narration[i]).join('\n\n---\n\n')+'\n\nContinuity: 5 scenes × 2 reference image prompts, all with identical A/B/world locks. Image creation and image-to-video rendering need separate explicit tool calls.';
 s.stage='DONE';s.complete=true;s.values={direction,characters:[GIRL,DOLL],setting,images,narration,scenes:beats.length};return response(s,output,{imagePrompts:images,narration});
}
