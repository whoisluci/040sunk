import { STATE } from "../index.js";
import { PubSub } from "../utils/pubSub.js";

const characters = [
    {
        "id": 1,
        "name":"Janusz Kowalski",
        "age": 70,
        "occupation": "Pensionerad, f.d. civilingenjör på Kockums",
        "adress":"Östra Förstadsgatan 16",
        "hobbies": "Sandkonst och fjäderplockning",
        "dialogue": [
            "Ahoj szczury lądowe! <br> Finns det något mer betryggande än doften av tjära och båtdiesel. Det var så min far doftade efter ett 12 timmars pass på Absalon, kanske lite vodka också men det försöker jag förtränga. Men detta var på tiden efter att han arbetade mellan Trelleborg och Gdansk.", 
            "En dag så beslutade sig mor och far att flytta hit efter att far arbetat så länge på förbindelserna mellan Polen och Sverige. Mor började jobba på margarinfabriken Zenith AB som låg här något kvarter bort. Far bytte enbart arbetsgivare och arbetade på Absalon som gick mellan Malmö och Köpenhamn. Niech ich dusze spoczywają w pokoju.", 
            "Var det något som mor kunde var det att laga god polsk husmanskost, hennes bigos, som vi åt varje söndag var fantastisk. Det var den som fick min bakfulle pappa att orka gå på alla söndagsmässor. Jag är värdelös på att laga mat men som tur är så sparade mor hennes bigosrecept som jag senare gav till Teddy så att jag kunde äta den hos honom istället.",
            "Något som jag däremot är bra på är maskiner, jag har alltid dragits till det marina livet men att arbeta som sjöman, som far, var för dåligt betalt. Så jag studerade istället till civilingenjör på Lunds universitet… vilket var ganska skönt eftersom att Lund inte ligger så långt härifrån. Sen arbetade jag på Kockums i 7 år.",
            "Lägenheten på Östra Förstadsgatan har jag bott i hela mitt liv eftersom att jag bodde hemma under studietiden och mina systrar flyttade till andra städer för studier. När min far dog och mor lades in på hem så tog jag över.",
            "Eftersom att jag är dålig på att laga mat själv så käkar jag ofta här, främst eftersom att de serverar mat som påminner om mammas.",
            "Jag kommer ihåg att min far brukade hänga här på 60-talet och dricka Zywiec och Zubrowka. En dag så kom han hem fly förbannad. Verksamheten skulle göras om till en Pizzeria. Min far kunde inte tro sina öron, han sa till mig “Patrz Janusz. Ci makaroniarze zabiorą nam nie tylko pracę, ale zamienią naszą knajpę w pizzerię”.",
            "Jag har inget problem med pizza, jag käkade här några gånger under mina studier…men sen en dag så var allting som vanligt igen, vilket år kan det ha varit…1900…1991 tror jag det var! <br> Teraz cumujemy przy fregacie!"
          ],
        "pub": 4,
        "avatarPath": "/media/avatars/kowalski.PNG",
        "audioPath": "/media/audio/kowalskiDialogue.wav",
        "animationPath": "/media/animations/kowalski"
    },
    {
        "id": 2,
        "name": "Sebbe Andersson",
        "age": 21,
        "occupation": "Student, pluggar till byggingenjör på Malmö Universitet.",
        "adress": "Rönnblomsgatan 11, Värnhem ",
        "hobbies": "Hänga med kompisar på Family Pub och dricka öl. Gillar att spela flightsimulator.",
        "dialogue": [
            "Tjena, jag heter Sebbe Andersson och är student på Malmö Universitet. Jag och mina kompisar älskar billig öl så jag hade velat visa dig runt på min favorit sunkpub som vi går till nästan varje dag. Jag borde egentligen gå hem och plugga men en till öl sitter aldrig fel.",

            "Förresten visste du att en inflytelserik man vid namn Jeppe Andersson ägde en gård här på torget under 1800-talet. Gården hade ett annat namn för ”skydd” och det ordet är även början på torgets nuvarande namn. Jeppe Andersson är en avlägsen släkting till mig, eller jag tror det i alla fall, vi har ju samma efternamn.",

            "En annan kul grej är att min gammelmormor jobbade på sjukhuset där jag och 492 andra studenter bor nu. Det är en bra byggnad för där finns cykelgarage på varje våning så min cykel kan inte bli stulen längre. Den blev det en gång och då behövde jag köpa en ny. Det gillade inte min plånbok men de på Abrahams Cykel på Höstgatan var så snälla och hjälpte mig.",
            
            "När jag försökte hitta dit dock så gick jag förbi korsningen Vårgatan/Mellangatan. Där finns ett hus som har en kanon och kanonkulor från Skånska kriget på 1670-talet in murades i fasaden vilket var lite häftigt att se, men men, nog om det, vi ska ju ta en till öl på min pub nu. Mitt kompisgäng och jag hängde först på Nobelvägen 52, men nu skojar vi om att vår lokala pub har flyttat med oss för att vi är trogna stammisar. Vi växte nämligen upp nära Nobel, sen fick vi alla studentlägenheter på Rönnen så nu är vi glada att vår favorit sunkpub finns så nära där vi bor igen och har gjort i 15 månader. Vilken pub är min favorit?"
        ],
        "pub": 3,
        "avatarPath": "/media/avatars/sebbe.PNG",
        "audioPath": "/media/audio/sebbeDialogue.wav",
        "animationPath": "/media/animations/sebbe"
    },
    {
        "id": 3,
        "name":"Sandra Karlsson",
        "age": 32,
        "occupation": "Grundskolelärare",
        "adress": "Sorgenfrivägen 37A, Östra Sorgenfri",
        "hobbies": "Spela biljard och hänga på Rex Pizzeria",
        "dialogue": [
            "Hej! Jag heter Sandra och är tredje generationens stammis här. Jag sitter och tänker på allt min familj har gått igenom i denna del av Malmö. Min familj har bott i området ända sedan min gammelmorfar och gammelmormor flyttade hit på 1920-talet.",

            "Min gammelmorfar jobbade hårt på AB Alfred Benzons fabrik som tillverkade oljor, färger och syror, bara ett stenkast härifrån. Det var ett hårt arbete och många, inklusive min gammelmorfar, dog tyvärr av cancer pga. deras hårda liv på fabriken. Min gammelmormor jobbade också på fabriken, men som städare, och därför var det naturligt att även min morfar fick jobb på fabriken och blev kvar i området.",

            "Han arbetade med paketering av kryddor och tillverkning av bl.a. bakpulver på 1930-talet och sedermera fick han ett lite “finare” jobb på kontoret, så han blev aldrig sjuk av sitt arbete. Min mamma har berättat att när min gammelmorfar gick bort så kunde min gammelmormor köpa en lägenhet i en av de nya barnrikes-byggnaderna under 1930-talet.",

            "På den tiden åkte också tåget precis utanför min favoritpub. Dessutom fanns en cykelbana i mitten och lindar i dubbla rader. Det måste ha varit så fint att ta promenader med familjen vid den tiden. Men detta förändrades i slutet av 1950-talet till något som är mer likt det vi ser här utanför idag. ",

            "Det jag gillar mest med min favoritpub är att jag har vuxit upp i samma område som mina förfäder. Min mamma och pappa brukade ta oss dit innan vi åt pizza på min favoritpub varje fredag. Jag minns när jag var tillräckligt stor och kunde spela biljard där för första gången med min storebror! Det var en katastrof! Men min mamma coachade mig och det blev en familjetradition :)",

            "Nu när jag sitter här och tänker på allt det min familj gick igenom under alla dessa år.. Det är helt otroligt… Allt det de genomgick så jag kunde skaffa mig ett bra liv. Det vattnas i ögonen. Jag älskar mitt liv. Mitt jobb som lärare, mina vänner, min fina lägenhet som ligger väldigt nära det barnrikehuset som möjliggjorde våra liv här. Vilken resa! <br> Vill ni komma förbi och säga hej? Jag är säker på att ni redan vet vilken pub som är min favorit!"
        ],
        "pub": 2,
        "avatarPath": "/media/avatars/sandra.PNG",
        "audioPath": "/media/audio/sandraDialogue.wav",
        "animationPath": "/media/animations/sandra"
    },
    {
        "id": 4,
        "name":"Bosse 'Suell' Jönsson",
        "age": 60,
        "occupation": "Socialsekreterare",
        "adress": "",
        "hobbies": "",
        "dialogue": [
            "Volym blev Hängbar som har blivit Scandwich, Källan har blivit Ramen To Bira och hederliga gamla Sapla har blivit Krøl. Det är otroligt vad man saknar, Arnob och Faisal på Sapla, det kändes verkligen som om man blev en del av deras vardag trots att de bara arbetade där…. Men detta stället ska inte någonstans, detta har varit en ölhall under lång tid och ska fortsätta vara det, tycker jag. Det är det enda stället på möllan där man kan sitta i en hederlig pubmiljö och dricka en hederlig pilsner…eller en orgasm som jag tycker så mycket om. Det känns som om Möllan börjat förlora sin själ.",

            "Ramen, vad är det… spaghetti i en fet köttbuljong, IPA - det smakar ju förfärligt. Vad är det för fel på en köttabit och en Norrlands Guld. Jag kan lova er att det var här min farfar satt och ölade med sina arbetskamrater efter ett tufft pass på Ryska Gummifabriken (RGA), som låg på Barkgatan. Och Bara ett stenkast härifrån fanns även Frasses Bar, dit jag och far brukade beställa varsin parisare på lördagarna.",

            "De nya trendiga och instagramvänliga pubarna är ju sett till utsidan ganska fräscha och fina… men det är så fruktansvärt själlöst, elitistiskt och framförallt dyrt. Man betalar ju närmre 100 spänn och får inte mer än 40 cl i glaset. På min tid så var kvarterkrogarna som en samhällsinstitution…krogarna var till för alla, alla var välkomna, det fanns hederlig mat som alla åt och man behövde inte lägga en halv förmögenhet för att bli litta salongis.",

            "När jag sitter på uteserveringen och blickar ut mot “Arbetets ära” så känns det som om det är det enda som är kvar och vittnar om Möllans själ…vet ungdomarna som sitter och sippar på en Vermouth ens vad statyn symboliserar? Jag har vuxit upp här och Möllan har inte alltid verkat som fritidsgård för upplänningar.",

            "Det är hit jag och min man går för att kolla på vårt kära Malmö FF och West Ham United. Det var i London jag och min man åkte på vår första semester, vi blev förälskade i den brittiska pubkulturen och West Ham. Detta stället är ett av få ställen i Malmö där inredningen faktiskt påminner lite om de brittiska pubarnas inredning. <br> Välkomna hit så ska ni få er en läxa om denna pub."
        ],
        "pub": 1,
        "avatarPath": "/media/avatars/bosse.PNG",
        "audioPath": "/media/audio/bosseDialogue.wav",
        "animationPath": "/media/animations/bosse"
    }
];


PubSub.subscribe({
    event: 'renderChars',
    listener: renderCharSelection
});

async function renderCharSelection(parentID){
    console.log(`[CLIENT]: Game has started .`);
    document.querySelector(parentID).innerHTML = ``;

    const headline = document.createElement('h2');
    headline.id = 'headline';
    document.querySelector(parentID).append(headline);
    headline.innerText = 'Välj en karaktär';

    const charsDiv = document.createElement('div');
    charsDiv.id = 'charsDiv';
    document.querySelector(parentID).append(charsDiv);
    
    for (let char of characters) {
        const charDiv = document.createElement('div');
        charDiv.id = char.name;
        charsDiv.append(charDiv);
        
        const charImg = document.createElement('img');
        charImg.src = char.avatarPath;
        charDiv.append(charImg);
        charImg.style.height = '200px';

        charDiv.classList.add('char');

        /* kolla om någon progress finns */
        /* om det finns, kolla vilka som e done */

        charDiv.addEventListener("click", (event) => {
            let chosenChar = event.target.id;
            renderCharDialogue('#wrapper', chosenChar);
        });
    }
}

function renderCharDialogue (parentID, charName) {
    document.querySelector(parentID).innerHTML = ``;

    let chosenChar;

    for (let char of characters) {
        if (charName === char.name) {
            chosenChar = char;
        }
    }
    const dialogue = chosenChar.dialogue;
    const barID = chosenChar.bar;
    const bar = STATE.bars.find((el) => el.id === barID);

    const background = document.createElement('img');
    background.id = 'background';
    background.src = bar.characterBG;

    const charAnimation = document.createElement('img');
    charAnimation.id = 'charAnimation';
    charAnimation.src = chosenChar.avatarPath; /* ändra till animation */

    const textbox = document.createElement('div');
    textbox.id = 'textbox';
    document.querySelector(parentID).append(textbox);

    const text = document.createElement('div');
    text.id = 'dialogue';
    textbox.append(text);

    const audio = document.createElement('audio');
    audio.id = 'voice';
    audio.src = chosenChar.audioPath;

    let currentLine = 0;
    let charIndex = 0;

    const trigger = setTimeout(() => {
        audio.play();
        typeLine(currentLine, charIndex, dialogue);
    });
}

function typeLine(currentLine, charIndex, dialogue) {
    if (currentLine >= dialogue.length) return;

    let line = dialogue[currentLine];
    let lineElement = document.createElement("div");
    textContent.appendChild(lineElement);

    let typingInterval = setInterval(() => {
      if (charIndex < line.length) {
        lineElement.textContent += line.charAt(charIndex);
        charIndex++;
        textContent.parentElement.scrollTop = textContent.scrollHeight;
      } else {
        clearInterval(typingInterval);
        charIndex = 0;
        currentLine++;
        setTimeout(typeLine, 1000);
      }
    }, 45);
}