import {ensure,asText,num,cloneSession,fresh,response} from './core.mjs';
export const id='car-exploded';
export const BRANDS=Object.freeze({
 'Mass-market / mainstream':['Toyota','Honda','Nissan','Hyundai','Kia','Volkswagen','Ford','Chevrolet','Mazda','Subaru','Peugeot','Renault','Suzuki','Mitsubishi','Skoda'],
 'Luxury':['Mercedes-Benz','BMW','Audi','Lexus','Genesis','Volvo','Cadillac','Lincoln','Jaguar','Land Rover'],
 'Sports / performance / exotic':['Porsche','Ferrari','Lamborghini','McLaren','Aston Martin','Maserati','Lotus','Bugatti','Bentley'],
 'Electric-focused':['Tesla','Rivian','Lucid','Polestar','BYD','NIO','XPeng'],
 'Off-road / SUV specialists':['Jeep','GMC','Ram','Isuzu','Ineos','Mahindra']
});
export const ALL=Object.values(BRANDS).flat();
export const MODELS=Object.freeze({
 Toyota:['Corolla','Camry','RAV4','Land Cruiser','GR Supra'],Honda:['Civic','Accord','CR-V','NSX'],
 Nissan:['Altima','Patrol','GT-R','Z'],Hyundai:['Elantra','Sonata','Tucson','Ioniq 5'],
 Kia:['Sportage','Sorento','EV6','Stinger'],Volkswagen:['Golf','Passat','Tiguan','ID.4'],
 Ford:['Mustang','F-150','Bronco','Explorer'],Chevrolet:['Corvette','Camaro','Silverado','Tahoe'],
 Mazda:['MX-5 Miata','Mazda3','CX-5'],Subaru:['WRX','BRZ','Outback','Forester'],
 Peugeot:['208','308','3008'],Renault:['Clio','Megane','Captur'],Suzuki:['Swift','Jimny','Vitara'],
 Mitsubishi:['Pajero','Outlander','Lancer Evolution'],Skoda:['Octavia','Superb','Kodiaq'],
 'Mercedes-Benz':['C-Class','E-Class','G-Class','S-Class','AMG GT'],BMW:['3 Series','5 Series','M3','X5','i4'],
 Audi:['A4','A6','RS6 Avant','Q8','e-tron GT'],Lexus:['IS','ES','RX','LC'],
 Genesis:['G70','G80','GV70','GV80'],Volvo:['XC60','XC90','S60'],
 Cadillac:['Escalade','CT5','Lyriq'],Lincoln:['Navigator','Aviator'],
 Jaguar:['F-Type','XF','F-Pace'], 'Land Rover':['Defender','Discovery','Range Rover'],
 Porsche:['911','Cayenne','Taycan'],Ferrari:['F8 Tributo','296 GTB','Purosangue'],
 Lamborghini:['Huracan','Revuelto','Urus'],McLaren:['720S','Artura','P1'],
 'Aston Martin':['DB12','Vantage','DBX'],Maserati:['MC20','GranTurismo','Grecale'],
 Lotus:['Emira','Evija','Eletre'],Bugatti:['Chiron','Veyron','Tourbillon'],
 Bentley:['Continental GT','Bentayga','Flying Spur'],
 Tesla:['Model 3','Model Y','Model S','Cybertruck'],Rivian:['R1T','R1S'],
 Lucid:['Air','Gravity'],Polestar:['Polestar 2','Polestar 3','Polestar 4'],
 BYD:['Seal','Dolphin','Atto 3'],NIO:['ET5','ES6','ET7'],XPeng:['P7','G6','G9'],
 Jeep:['Wrangler','Grand Cherokee','Gladiator'],GMC:['Sierra','Yukon','Hummer EV'],
 Ram:['1500','2500'],Isuzu:['D-Max','MU-X'],Ineos:['Grenadier','Quartermaster'],
 Mahindra:['Thar','Scorpio','XUV700']
});
export function start(){return response(fresh(id,'BRAND'),'Select a car brand by number or name:\n'+Object.entries(BRANDS).map(([category,brands])=>category+':\n'+brands.map(name=>(ALL.indexOf(name)+1)+'. '+name).join(' | ')).join('\n\n')+'\nWait for your choice; no car prompts yet.');}
export function respond(previous,input){
 const s=cloneSession(previous,id);const value=asText(typeof input==='object'?input.value??input.brand??input.model:input);
 if(s.stage==='BRAND'){
  const brand=/^\d+$/.test(value)?ALL[Number(value)-1]:ALL.find(x=>x.toLowerCase()===value.toLowerCase());
  ensure(brand,'Choose a valid listed brand');s.values.brand=brand;s.stage='MODEL';
  return response(s,'Brand locked: '+brand+'. Choose one model:\n'+MODELS[brand].map((x,i)=>(i+1)+'. '+x).join('\n')+'\nYou may specify an exact year/trim/color if known.');}
 if(s.stage==='MODEL'){
  const models=MODELS[s.values.brand];const model=/^\d+$/.test(value)?models[Number(value)-1]:models.find(x=>x.toLowerCase()===value.toLowerCase());
  ensure(model,'Choose a listed exact model');
  s.values.model=model;s.stage='DETAILS';
  return response(s,'Model locked: '+s.values.brand+' '+model+'. Confirm the year or generation, trim (if relevant), and color. Answer as JSON, e.g. {"year":"2024","trim":"standard","color":"metallic blue"}. If unknown, say unknown; I will not invent a precise trim.');
 }
 ensure(s.stage==='DETAILS','Stage order violation');
 const o=(input&&typeof input==='object')?input:{year:value};
 const year=asText(o.year),trim=asText(o.trim),color=asText(o.color);
 ensure(year,'Year/generation confirmation required ("unknown" is valid)');
 s.values.year=year;s.values.trim=trim||'not specified';s.values.color=color||'unspecified factory paint';s.stage='DONE';s.complete=true;
 const full=s.values.brand+' '+s.values.model+(year.toLowerCase()==='unknown'?'':', model year/generation '+year)+(trim?' '+trim+' trim':'');
 const identity='exact '+full+', '+s.values.color+' exterior, identical body proportions and trim details';
 const prompt1='PROMPT 1 — Hero Image (Full Car)\nPhotoreal automotive advertising image of '+identity+'. Premium 3/4 front low-angle composition, 85mm lens appearance and f/2.8 shallow depth of field, neutral modern studio, large softbox key from front left, thin right-side rim and soft floor reflection. Entire complete vehicle visible, physically coherent wheelbase and lighting, quiet background, ultra-detailed 8K-quality target. No watermarks, logos added by AI, invented labels or text.';
 const prompt2='PROMPT 2 — Exploded View (Image-to-Image)\nUsing the uploaded output of Prompt 1 as the mandatory base reference, preserve EXACT car identity, paint color, body proportions, trim, wheels and 3/4 front perspective. Transform the SAME vehicle into a precise floating engineering exploded view, separating hood, body panels, wheels, tires, interior, seats, chassis, relevant powertrain and drivetrain components along physically sensible central axes. If a component is not visually supported or trim is uncertain, keep it generic rather than inventing precise real-world internals. Clean dark-gray gradient compositing backdrop; premium softbox/rim reflections consistent with the reference, tidy air gaps, no callout text or arrows, ultra-detailed high-resolution quality target.';
 const prompt3='PROMPT 3 — Video Generation (Google Flow, both references)\nUse BOTH user-attached images as mandatory identity/geometry anchors: IMAGE 1 = fully assembled complete '+full+' hero shot; IMAGE 2 = exploded-view transformation of that SAME exact car. Animate image 1 to 2 then back to 1. 0–2s: car drifts into the frame with safe dramatic tire smoke, lens motion blur and precise stop. 2–3s: hold one clean hero beat while the camera performs a gentle 3/4 orbit. 3–5.5s: body panels, wheels and mechanical parts separate smoothly into the image-2 exploded alignment with servo-guided movement, avoid random flying shrapnel. 5.5–8s: reverse in exact order and reassemble to image-1 fully finished vehicle, satisfying lock-in at the last frame. Camera: restrained cinematic 3/4 orbit, no angle jump; maintain continuity of paint and parts. AUDIO: realistic engine rise and tire squeal during drift/stop, subtle tire-air hiss; layered servo whoosh and metal separation ticks during expansion; tiny metallic assembly clicks and low bass snap on completion, venue-consistent room-tone bed, foley-focused and not music-driven. No extra labels/watermarks.';
 return response(s,[prompt1,prompt2,prompt3].join('\n\n---\n\n')+'\n\nChoose another model to return to the model-selection stage, or another brand to restart.',{prompts:[prompt1,prompt2,prompt3]});
}
