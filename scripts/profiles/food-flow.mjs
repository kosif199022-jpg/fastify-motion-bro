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

// Additional physically distinct assembly sequences for the full menu.
Object.assign(ACTIONS,{
 'fried chicken':[['placing seasoned raw chicken into a food-safe preparation tray','light tray contact'],['coating each piece in seasoned flour','dry flour patter and light coating brushes'],['placing coated pieces carefully into hot oil with proper splash safety','authentic rising frying sizzle and delicate popping'],['lifting safely cooked pieces with tongs to drain','oil drip and metal tong clicks'],['placing golden crisp chicken on a plate','crisp breading taps and plate contact']],
 'hot dog':[['placing the warm bun in a tray','soft bread contact'],['placing a cooked hot dog sausage into the bun','gentle sausage-to-bread thud'],['adding mustard in one zigzag pass','fine bottle squeeze and soft sauce contact'],['sprinkling diced onion','small crisp onion taps'],['finishing with a careful presentation turn','paper tray crinkle']],
 'sandwich / sub':[['laying open sliced sub bread','soft crust brushing counter'],['spreading the chosen condiment on both halves','wet spread and knife scrape'],['layering sliced prepared filling','soft stacked ingredient contact'],['adding tomato and lettuce','crisp lettuce rustle and tomato slice taps'],['folding and presenting the assembled sandwich','bread compression and wrapper rustle']],
 'nachos':[['laying crisp corn chips in a shallow dish','dry tortilla-chip clatter'],['spooning warmed beans onto the chips','soft bean spoon scrape'],['drizzling cheese sauce','thick molten cheese pour'],['adding diced salsa and jalapeno','crisp vegetable patter'],['finishing with a tiny garnish','soft leafy rustling']],
 'noodles / ramen':[['placing cooked noodles inside a deep ceramic bowl','soft strands against ceramic'],['arranging prepared vegetables and toppings','light topping placement taps'],['pouring hot broth carefully around noodles','gentle liquid stream and ceramic resonance'],['placing a final garnish over the surface','wet leaf touch and subtle surface ripple'],['moving the finished ramen bowl into serving position','ceramic slide and gentle broth sway']],
 'sushi roll':[['spreading seasoned rice across a nori sheet','sticky rice pressing and faint seaweed crackle'],['arranging prepared safe fillings evenly','gentle crisp cut vegetable taps'],['rolling the nori and rice using a bamboo mat','dry mat rustle and soft rice compression'],['slicing the completed roll cleanly','sharp blade cut and quiet board contacts'],['arranging each slice on a plate','light ceramic taps']],
 'ice cream sundae':[['setting a chilled serving bowl','clean ceramic clink'],['placing one scoop of frozen ice cream','scoop scraping frozen surface'],['adding a second scoop in the bowl','soft frozen scoop contact'],['pouring a thin dessert sauce','smooth viscous drizzle'],['placing a small crunchy topping','fine crumble patter']],
 'chocolate cake / cupcake':[['placing the baked cooled cake on a plate','soft sponge against ceramic'],['smoothing frosting with an offset spatula','creamy blade scrape'],['adding a thin chocolate ribbon','viscous slow chocolate drizzle'],['sprinkling a small decorative topping','tiny sprinkle taps'],['presenting one clean cut or cupcake closeup','light plate contact']],
 'iced coffee / latte':[['setting a clear glass on the preparation surface','hollow glass tap'],['dropping chilled ice into the glass','hard ice-on-glass clatter'],['pouring coffee over the ice','dark liquid stream with rising splashing pitch'],['adding cold milk in a steady ribbon','lighter liquid swirls and quiet pour'],['gently turning the glass to show the layered drink','subtle ice clink']],
 'smoothie':[['placing a chilled glass on the counter','gentle thick glass clink'],['pouring a freshly blended fruit smoothie','heavy smooth viscous liquid stream'],['tapping the glass once to settle the contents','brief glass tap'],['adding a small fruit garnish','soft fruit-on-glass tap'],['presenting the completed drink with a reusable straw','light straw glass click']]
});

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
 if(!data){
  const alias=Object.keys(ACTIONS).find(key=>normalized.includes(key)||key.includes(normalized));
  if(alias)data=ACTIONS[alias];
  else{
   const drink=/juice|coffee|tea|drink|smoothie|shake|latte|water|soda|milk/i.test(food);
   const sweet=/cake|pie|cookie|ice cream|dessert|candy|chocolate|pastry/i.test(food);
   data=drink?
    [['presenting a clean suitable serving glass for '+food,'glass meeting counter'],['adding the first suitable ingredient of '+food,'light ingredient contact'],['pouring the prepared '+food+' at an appropriate viscosity','authentic liquid stream and glass splash'],['adding a complementary garnish','light garnish patter'],['rotating the completed drink toward the lens','soft glass movement']]:
    sweet?
    [['placing the prepared base of '+food+' on a serving plate','soft prepared base touching ceramic'],['layering one appropriate component of '+food,'texture-matched gentle ingredient contact'],['adding a visually distinct finishing layer','soft frosting or garnish spreading'],['showing a close macro detail of the finished dessert','quiet plate adjustment'],['positioning the finished dessert to serve','ceramic tap']]:
    [['placing a prepared main base of '+food+' on the work surface','material-appropriate board contact'],['adding one prepared primary ingredient','specific ingredient tap/scrape'],['assembling the next distinct component of '+food,'natural physical ingredient handling'],['applying a finishing sauce or seasoning only if appropriate','subtle sauce or seasoning sounds'],['plating the completed '+food,'ceramic contact and utensil set-down']];
  }
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
