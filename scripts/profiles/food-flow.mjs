import {ensure,asText,num,cloneSession,fresh,response} from './core.mjs';
export const id='food-flow';
export const FOOD_MENU=['Pizza','Burger','French Fries','Fried Chicken','Hot Dog','Tacos','Sandwich / Sub','Nachos','Noodles / Ramen','Sushi Roll','Donuts','Ice Cream Sundae','Chocolate Cake / Cupcake','Candy','Milkshake','Fresh Juice','Soda / Fizzy Drink','Iced Coffee / Latte','Smoothie','Something else — any food, candy, fruit, dessert, drink or dish'];
const ACTIONS={
 'pizza':[['stretching the dough base in a metal tray','soft dough stretch and tray taps'],['spreading tomato sauce using a spoon','wet spoon scraping against dough'],['sprinkling shredded cheese in an even layer','fine cheese patter landing on sauce'],['layering sliced vegetables and selected toppings','soft vegetable taps and tray contact'],['placing a final basil leaf and presenting the finished slice','light leaf rustle and ceramic plate contact']],
 'burger':[['placing the bun base on the clean prep surface','soft bread contact against a plate'],['applying sauce to the bun','thick sauce squelch and light spoon scrape'],['adding a fully cooked patty','warm patty landing with muted soft thud'],['adding cheese and fresh vegetables','crisp lettuce rustle and cheese peel'],['pressing the top bun into place','soft squish of bread and fillings']],
 'donuts':[['placing an unglazed donut on a rack','soft pastry contact'],['pouring smooth glaze over the donut','sticky glaze stream and gentle tray splatter'],['scattering colorful sprinkles','tiny hard sugar patter'],['adding a final chocolate drizzle','viscous chocolate pour'],['lifting the finished donut onto a plate','delicate pastry handling']],
 'fresh juice':[['setting a clear glass on the counter','clean hollow glass clink'],['dropping two ice cubes into the glass','distinct hard ice-on-glass clatter'],['pouring freshly squeezed juice','clear liquid stream and splashes with rising pitch'],['adding fruit garnish','light citrus peel rustle and glass tap'],['swirling the finished juice once','liquid swirl and muted glass movement']],
 'soda / fizzy drink':[['placing a chilled glass','soft glass thud'],['dropping ice cubes','sharp ice clinks'],['opening a soda can','metal tab snap and carbonation hiss'],['pouring carbonated soda','rising fizzy splash and bubbles'],['garnishing the drink','small garnish drop and residual fizz']],
 'milkshake':[['placing a cold glass on the counter','glass clink'],['pouring a thick chilled milkshake','slow heavy creamy pour'],['adding whipped cream','soft airy dispenser puff'],['sprinkling decorative crumbs','crisp powder patter'],['placing a straw and rotating the finished glass','gentle straw tap and viscous swirl']],
 'tacos':[['placing the tortilla on a board','soft tortilla slap'],['spooning prepared filling into the shell','moist spoon scrape'],['adding diced vegetables','small crisp vegetable taps'],['drizzling salsa evenly','short liquid trickle'],['finishing with fresh herbs','fresh leaf rustling']],
 'candy':[['placing a wrapped piece of candy','plastic wrapper tap'],['unwrapping the candy','crinkling cellophane and foil'],['revealing the candy center','soft wrapper tear'],['arranging three pieces side by side','small hard candy clicks'],['tilting finished candy toward camera','gentle candy contact']],
 'fries':[['laying out raw potatoes','firm potatoes meeting board'],['cutting a potato into even sticks','sharp knife through crisp potato and chopping board taps'],['lightly shaking seasoning over safely cooked fries','fine seasoning patter'],['stacking hot fries in a serving cone','light crispy contacts and paper crinkle'],['adding final salt and parsley','tiny flakes falling onto hot surface']]
};
const chef='Same adult chef with medium-brown hands, rolled ivory chef sleeves, charcoal apron without logos and a slim plain silver wristband; face outside frame until the final tasting shot. The same chef appears in ALL clips.';
const set='Same intimate contemporary kitchen: pale warm stone countertop, matte ceramic serving plate, defocused oak cabinets and copper lamp behind, golden soft overhead practical light with left softbox and gentle countertop shadows.';
const camera='Same 45-degree three-quarter medium food close-up, 50mm lens look, shallow depth of field, fixed tripod with only tiny motivated macro pushes.';
const pace='Snappy precise quick cuts within a shot, seamless action matching; no spoken words, no voiceover, no music.';
const SFX_EAT={
 pizza:'a gentle crisp crust crackle followed by a soft cheesy tear and satisfied silent exhale',
 burger:'a soft bread compression, moist filling bite and quiet pleased breath',
 'french fries':'an audible delicate crispy crunch and light chewing',
 donut:'a soft sweet bread tear and barely audible cream contact',
 'fresh juice':'a clear refreshing juice sip, light swallow and pleased exhale',
 'soda / fizzy drink':'fizzy liquid sip with faint bubbles',
 milkshake:'a thick creamy straw slurp and contented exhale',
 candy:'a precise little hard candy crunch or soft chew matching the chosen candy texture',
 smoothie:'a thick blended fruit sip and quiet appreciative exhale',
 'iced coffee / latte':'soft ice clink and cold coffee sip'
};
function pickStages(food,n){
 const normalized=food.toLowerCase();
 let data=ACTIONS[normalized];
 if(!data){const drink=/juice|coffee|tea|drink|smoothie|shake|latte|water|soda/i.test(food);
  const sweet=/cake|pie|cookie|ice cream|dessert|candy|chocolate/i.test(food);
  data=drink?ACTIONS['fresh juice']:sweet?ACTIONS.donuts:ACTIONS.burger;
 }
 const assembly=Math.max(0,n-1),out=[];
 if(assembly===0)return out;
 if(assembly<=data.length){
  for(let i=0;i<assembly;i++){
   const from=Math.floor(i*data.length/assembly),to=Math.floor((i+1)*data.length/assembly);
   const chunk=data.slice(from,Math.max(from+1,to));
   out.push({action:chunk.map(x=>x[0]).join(' then '),sound:chunk.map(x=>x[1]).join(' followed by ')});
  }
 }else{
  for(let i=0;i<assembly;i++){
   if(i<data.length)out.push({action:data[i][0],sound:data[i][1]});
   else{
    const details=['highlighting the finished glossy texture at extreme close-up','showing a slow steam or chilled-condensation macro insert','rotating the finished plate for presentation','adding one final tiny garnish'];
    const sounds=['subtle ceramic movement and food texture contact','gentle real steam hiss or condensation trickle','ceramic scraping against counter','light garnish patter'];
    const idx=(i-data.length)%details.length;out.push({action:details[idx],sound:sounds[idx]});
   }
  }
 }return out;
}
export function start(){return response(fresh(id,'FOOD'),'Select any food, sweet or drink:\n'+FOOD_MENU.map((x,i)=>(i+1)+'. '+x).join('\n')+'\nOr type a custom dish. Last clip will be eating/tasting.');}
export function respond(previous,input){
 const s=cloneSession(previous,id),v=asText(typeof input==='object'?input.value??input.food??input.count:input);
 if(s.stage==='FOOD'){
  let food=/^\d+$/.test(v)?FOOD_MENU[Number(v)-1]:v;ensure(food&&food.length>=2,'Select a food or custom dish');
  ensure(food!==FOOD_MENU.at(-1),'For the custom option, type your actual food name');
  s.values.food=food;s.stage='COUNT';return response(s,'Selected: '+food+'. How many 10-second clips? Enter any integer of 1 or more. Recommended 3–6; final clip is always the eating/tasting shot.');
 }
 ensure(s.stage==='COUNT','Stage order violation');
 const n=num(v,1,200,'clip count'),food=s.values.food;
 const stages=pickStages(food,n);
 const clips=Array.from({length:n},(_,i)=>{
  const last=i===n-1,action=last?'The same chef tastes a normal-size bite or sip of the completed '+food+', smiles with understated satisfaction and naturally returns the food to the plate or glass.':stages[i].action;
  const sound=last?(SFX_EAT[food.toLowerCase()]||(/juice|drink|coffee|smoothie|latte|shake/i.test(food)?'a texture-appropriate natural sip, soft swallow and quiet pleased exhale':'a realistic food-specific bite, short chew and appreciative exhale')):stages[i].sound;
  const prompt='Prompt '+(i+1)+'/'+n+' — '+(last?'Final tasting':action)+'\n10-second food video, '+food+'. '+chef+' '+set+' '+camera+' '+pace+' SINGLE ACTION of this clip only: '+action+' Specific synchronised foley: '+sound+'. '+(last?'The tasting moment is the closing shot.':'Finish this precise step and hold the state as the opening reference for the next clip.')+' No captions, invented labels or logos. Do not change the chef, camera angle, kitchen design or lighting between clips.';
  return {clip:i+1,action,sound,isEating:last,durationSeconds:10,prompt};
 });
 const output=clips.map(x=>x.prompt).join('\n\n---\n\n')+'\n\nGenerate each prompt separately in Google Flow/Veo, save each resulting 10-second clip, then join '+n+' clips in order. Total planned duration: '+n*10+'s; none has been rendered.';
 s.values={food,count:n,styleLock:{chef,set,camera,pace},clips};s.stage='DONE';s.complete=true;return response(s,output,{prompts:clips,styleLock:s.values.styleLock});
}
