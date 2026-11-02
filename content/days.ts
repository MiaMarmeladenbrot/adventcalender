import {
  auroraRow,
  BLUE,
  cookieTray,
  GREEN,
  KEY_HOOKS,
  letterGrid,
  MIRRORED_CLOCK,
  MORSE_POSTER,
  shelves,
  timeCards,
  VIOLET,
} from './fragments'
import type { Day } from './types'

export const DAYS: Day[] = [
  {
    who: 'santa',
    title: 'Der Stall',
    intro: [
      [
        'santa',
        'Guten Morgen! Komm mit, ich zeig dir unseren Schlitten. Er ist schon frisch geputzt für die große Nacht!',
      ],
      [
        'santa',
        'Oh. Der Code vom Stalltor. Den hab ich vergessen … Zum Glück hab ich mir eine Eselsbrücke ins Schloss geritzt.',
      ],
    ],
    puzzle:
      "In das Zahlenschloss am Stalltor ist geritzt:<div class='big mono'>1 · 2 · 4 · 7 · 11 · ?</div>Welche Zahl öffnet das Schloss?",
    accept: ['16', 'sechzehn'],
    solution: '16',
    hints: [
      'Schau nicht auf die Zahlen, sondern auf die Abstände dazwischen.',
      'Die Abstände sind 1, 2, 3, 4 …',
      '11 + 5 = 16',
    ],
    reply: [
      'santa',
      'Hereinspaziert! Und hier steht er, der wunderschöne … Moment. Wo ist er? MEIN SCHLITTEN IST WEG!',
    ],
    clue: 'Der Schlitten verschwand in der Nacht zum 1. Dezember aus dem Rentierstall.',
    strike: ['Rentierstall'],
  },
  {
    who: 'mrs',
    title: 'Der Schichtplan',
    intro: [
      [
        'mrs',
        'Drei Elfen hatten in der Nacht Stalldienst: Fipps, Mila und Bo. Jede Schicht dauerte vier Stunden.',
      ],
    ],
    puzzle:
      'Schichten: <b>20–24 Uhr</b>, <b>0–4 Uhr</b>, <b>4–8 Uhr</b>.<ul><li>Fipps hatte nicht die erste Schicht.</li><li>Mila arbeitete direkt nach Bo.</li><li>Bo hatte nicht die letzte Schicht.</li></ul>Wer hatte Dienst von 0 bis 4 Uhr?',
    accept: ['mila'],
    solution: 'Mila',
    hints: [
      'Mila kommt direkt nach Bo. Welche zwei Paare von Schichten sind dafür möglich?',
      'Hätte Bo 0–4 Uhr, müsste Fipps die erste Schicht haben. Das geht nicht.',
      'Bo 20–24, Mila 0–4, Fipps 4–8.',
    ],
    reply: [
      'mrs',
      'Mila also. Sie gibt zu, dass sie eingenickt ist. Das kann ja jedem mal passieren.',
    ],
    clue: 'Mila hatte von 0 bis 4 Uhr Dienst. Um 2 Uhr ist sie eingenickt und erst um 4 wieder aufgewacht. In dieser Zeit muss der Schlitten verschwunden sein.',
    strike: [],
  },
  {
    who: 'elf',
    title: 'Alles an seinem Platz',
    intro: [
      [
        'elf',
        'In meiner Sattelkammer war niemand. Ausgeschlossen! Bei mir hat alles seinen festen Platz. Wenn jemand hier war, würde ich das sofort merken.',
      ],
      ['elf', 'Seht ihr? Alles ordentlich. Obwohl …'],
    ],
    puzzle:
      'Knöpfchens Regal in der Sattelkammer:' +
      shelves([
        [4, ['Zaum', 'Sack', 'Fell']],
        [5, ['Decke', 'Zügel', 'Leine']],
        [6, ['Glocke', 'Sattel', 'Geschirr', 'Bürste']],
        [7, ['Halfter', 'Laterne', 'Kandare']],
      ]) +
      'Was steht nicht an seinem Platz?',
    accept: ['geschirr'],
    solution: 'Das Geschirr',
    hints: [
      'Die Fächer sind nummeriert. Was könnte die Zahl bedeuten?',
      'Zähl die Buchstaben.',
      'Das Geschirr hat 8 Buchstaben. Für 8 gibt es gar kein Fach.',
    ],
    reply: [
      'elf',
      'Das Zuggeschirr! Das liegt nie im Regal, es hängt am Haken neben dem Schlitten. Jemand hat es heute Nacht benutzt und hastig zurückgelegt.',
    ],
    clue: 'In der Nacht hat jemand das Zuggeschirr benutzt, um den Schlitten zu ziehen.',
    strike: [],
  },
  {
    who: 'twins',
    title: 'Der zerrissene Anhänger',
    intro: [
      [
        'twins',
        'Wir haben im Stall was gefunden! Einen Geschenkanhänger, der glitzert wie verrückt.',
      ],
      [
        'twins',
        'Und dann haben wir uns gestritten, wer ihn behalten darf. Jetzt hat jede ein Stück.',
      ],
    ],
    puzzle: 'Zimt hat das eine Stück, Zucker das andere. Was steht auf dem Anhänger?',
    halves: [
      {
        name: 'Zimt',
        html: letterGrid([
          ['F', 'X', 'Ü', 'M'],
          ['Q', 'R', 'E', 'T'],
          ['U', 'I', 'C', 'P'],
          ['H', 'O', 'K', 'N'],
        ]),
      },
      {
        name: 'Zucker',
        html: letterGrid([
          ['○', '■', '○', '■'],
          ['■', '○', '○', '■'],
          ['○', '■', '○', '■'],
          ['○', '■', '■', '■'],
        ]),
      },
    ],
    accept: ['fuereuch'],
    solution: 'FÜR EUCH',
    hints: [
      'Beide Stücke sind gleich groß.',
      'Leg Zuckers Stück gedanklich über Zimts Buchstaben. Was schaut durch die Löcher?',
      'FÜR EUCH',
    ],
    reply: [
      'twins',
      'Für euch! Wer verschenkt denn hier nachts was, und an wen? Wird da eine Überraschung geplant?',
    ],
    clue: 'Auf dem Stallboden lag ein glitzernder Geschenkanhänger: „Für euch“. Wer hat hier nachts eine Überraschung hinterlassen?',
    strike: [],
  },
  {
    who: 'rudolph',
    title: 'Die blinkende Nase',
    intro: [
      ['rudolph', 'Psst. Ich darf nichts sagen. Wirklich nicht.'],
      ['rudolph', 'Aber … meine Nase macht manchmal, was sie will.'],
    ],
    puzzle:
      'An der Stallwand hängt ein altes Plakat, auf das Rudolph immer wieder schielt.' +
      MORSE_POSTER,
    widget: { kind: 'morse', signal: '-.- --- -- . -' },
    accept: ['komet'],
    solution: 'KOMET',
    hints: [
      'Achte darauf, wie lange die Nase jeweils leuchtet.',
      'Kurz ist ·, lang ist –. Längere Pausen trennen die Buchstaben.',
      '–·– / ––– / –– / · / – ergibt KOMET.',
    ],
    reply: [
      'rudolph',
      'Ich hab nichts gesagt! Aber jetzt, wo du es ansprichst: Komet war heute Nacht sehr unruhig.',
    ],
    clue: 'Komet war in der Tatnacht sehr unruhig, er wollte ja schon immer ganz vorn am Schlitten fliegen.',
    strike: [],
  },
  {
    who: 'komet',
    title: '2. Advent: Komet ist beleidigt',
    special: true,
    intro: [
      [
        'komet',
        'Ich soll es gewesen sein? Unverschämt! Nur weil ausgerechnet Rudolph dieses Jahr vorn fliegen darf? Der war doch noch nie vorn!',
      ],
      [
        'komet',
        'Nein, ich habe die ganze Nacht in meiner Box geschlafen. Welche Box? Na, das könnt ihr Schlaumeier doch selber rausfinden.',
      ],
    ],
    puzzle:
      'Fünf Rentiere schlafen nebeneinander in den Boxen 1 bis 5.<ul><li>Rudolphs Box liegt an einem Ende der Reihe.</li><li>Blitz schläft in Box 2.</li><li>Tänzer schläft nicht neben Blitz.</li><li>Komet schläft direkt neben Donner.</li><li>Donners Box hat eine höhere Nummer als Komets.</li></ul>In welcher Box schläft Komet?',
    accept: ['3', 'drei', 'box3'],
    solution: '3',
    hints: [
      'Fang mit Blitz und Tänzer an. Wo kann Tänzers Box überhaupt nur sein?',
      'Steht Rudolph in Box 5, passen Komet und Donner nicht mehr nebeneinander.',
      'Rudolph 1, Blitz 2, Komet 3, Donner 4, Tänzer 5.',
    ],
    reply: [
      'komet',
      'Ja, Box 3 ist meine Box. Die liegt direkt am Tor, na und? Ich hab geschlafen!',
    ],
    clue: 'Komets Box liegt direkt am Stalltor. Er hätte nachts unbemerkt hinausgekonnt. Und er ärgert sich, dass dieses Jahr Rudolph vorn fliegen darf.',
    strike: [],
  },
  {
    who: 'grinch',
    title: 'Das Verhör',
    intro: [
      [
        'grinch',
        'Was guckt ihr so? Ich lungere hier doch nur ganz zufällig vor der Bäckerei herum. Ihr wollt mich verhören? Pah.',
      ],
      ['grinch', 'Ich rede nur mit Leuten, die mein Rätsel knacken.'],
    ],
    puzzle:
      '<p>„Ich trag mein Kleid das ganze Jahr,<br>nur einmal schmückt man mir das Haar.<br>' +
      'Erst holt man mich ins warme Haus,<br>dann wirft man mich zum Fenster raus.“</p>' +
      '<p>Wer bin ich?</p>',
    accept: ['tannenbaum', 'weihnachtsbaum', 'christbaum', 'tanne', 'baum'],
    solution: 'Tannenbaum',
    hints: [
      'Das Kleid ist grün und piekt.',
      'Geschmückt wird es einmal im Jahr, im Dezember.',
      'Ein Tannenbaum.',
    ],
    reply: [
      'grinch',
      'Grmpf. Richtig, der Tannenbaum. Und wisst ihr, was das Schönste an ihm ist? Der Januar, wenn er rausfliegt. Dieses Jahr kommt ohne Schlitten ja vermutlich erst gar keiner rein. Hehe.',
    ],
    clue: 'Der Grinch freut sich, weil ohne Schlitten kein Weihnachten. Will er sich rächen?',
    strike: [],
  },
  {
    who: 'snowman',
    title: 'Was hab ich gesehen?',
    intro: [
      [
        'snowman',
        'Ich stand die ganze Nacht vor der Bäckerei. Ich hab alles gesehen! Ich weiß es noch genau. Also … ungefähr jedenfalls.',
      ],
      ['snowman', 'Ich zeig’s euch, aber schnell. Sonst ist meine Erinnerung wieder weg.'],
    ],
    puzzle: 'Spiel Flockes Erinnerung ab. Welches Tier hat er <b>zweimal</b> gesehen?',
    widget: {
      kind: 'memory',
      items: ['moon', 'owl', 'star', 'hare', 'lantern', 'fox', 'hooves', 'owl', 'snow'],
    },
    accept: ['eule', 'eulen'],
    solution: 'Die Eule',
    hints: [
      'Du darfst die Erinnerung nochmal abspielen. Flocke merkt das nicht.',
      'Es war ein Vogel.',
      'Die Eule.',
    ],
    reply: [
      'snowman',
      'Genau, die Eule! Und dazwischen habe ich Hufspuren nach Norden gesehen. Ich wär hinterher, aber das ist schwierig ohne Beine.',
    ],
    clue: 'Flocke sah Hufspuren nach Norden Da er sich selbst nicht bewegen kann, können wir ihn von der Verdächtigenliste streichen.',
    strike: ['Schneemann'],
  },
  {
    who: 'ginger',
    title: 'Das Buchstabenblech',
    intro: [
      [
        'ginger',
        'Skandal! Mein Blech mit Buchstabenkeksen stand zum Abkühlen auf dem Fensterbrett. Heute Morgen lag es im Schnee, und fünf Kekse fehlten.',
      ],
      [
        'ginger',
        'Von jedem Buchstaben hatte ich genau einen gebacken. Das ist ein Zeichen, ich spür’s in meinen Krümeln!',
      ],
    ],
    puzzle:
      'Das Blech, so wie es im Schnee lag:' +
      cookieTray([
        'M',
        'Q',
        '',
        'A',
        'T',
        'Z',
        'D',
        'H',
        '',
        'X',
        'B',
        'R',
        'W',
        'O',
        '',
        'J',
        'G',
        'Y',
        'C',
        '',
        'S',
        'L',
        'V',
        'I',
        '',
        'P',
      ]) +
      'Was sagen dir die fehlenden Kekse?',
    accept: ['kufen', 'kufe'],
    solution: 'KUFEN',
    hints: [
      'Von A bis Z war jeder Buchstabe genau einmal auf dem Blech.',
      'Es fehlen E, F, K, N und U.',
      'Umgestellt ergibt das KUFEN.',
    ],
    reply: [
      'ginger',
      'Kufen! Da ist heute Nacht ein Schlitten an meinem Fenster vorbeigerauscht und hat das Blech runtergefegt!',
    ],
    clue: 'In der Nacht ist der Schlitten an der Bäckerei vorbeigekommen.',
    strike: [],
  },
  {
    who: 'penguin',
    title: 'Post für den Südpol',
    intro: [
      [
        'penguin',
        'Huhu, ich bin Pedro vom Südpol. Hier ist es schön, aber ich vermisse meine Familie sehr. Ich hab ihr heute früh eine Postkarte geschrieben.',
      ],
    ],
    puzzle:
      "Pedro zeigt dir seine Postkarte. Wo war er in der Nacht?<div class='postcard flip'>Liebe Mama,<br>immer noch ist es eiskalt hier, aber die Elfen sind nett.<br>Gestern hab ich zum ersten Mal Nordlichter gesehen, fast so schön wie unsere Südlichter.<br>Heute Nacht hatte ich so wenig Lust zu schlafen, da hab ich einfach gebaut.<br>Jetzt wohne ich wie die Leute hier oben!<br>Dein Pedro</div>",
    contains: ['iglu', 'iglo'],
    solution: 'Iglu',
    hints: [
      'Bei Pedro ist alles andersrum.',
      'Das Wort versteckt sich zwischen zwei anderen Wörtern.',
      '„wen<b>ig Lu</b>st“: Iglu.',
    ],
    reply: [
      'penguin',
      'Die ganze Nacht hab ich geschuftet! So wohnt man doch am Nordpol, oder? Wenn ich schon nicht nach Hause kann, bau ich mir eben hier eins.',
    ],
    clue: 'Pedro hat Heimweh. Mit dem Schlitten wäre er schnell zu Hause. Aber er hat die ganze Nacht an seinem Iglu gebaut und war nicht mal in der Nähe des Stalls.',
    strike: ['Pinguin Pedro'],
  },
  {
    who: 'ginger',
    title: 'Die Küchenuhr',
    intro: [
      [
        'ginger',
        'Noch ein Skandal! Meine Küchenuhr ist heute Nacht vom Haken gefallen und stehen geblieben.',
      ],
      [
        'ginger',
        'Ich hab sofort ein Foto gemacht, bevor jemand sie anfasst. Leider nur durch den Spiegel über dem Ofen.',
      ],
    ],
    puzzle: MIRRORED_CLOCK + 'Wann ist die Uhr stehen geblieben?',
    accept: ['210', '0210', '1410', 'zehnnachzwei', 'zweiuhrzehn'],
    traps: {
      '950': 'Fast. Schau dir die Zahlen auf dem Ziffernblatt genau an.',
      '0950': 'Fast. Schau dir die Zahlen auf dem Ziffernblatt genau an.',
    },
    solution: '2:10 Uhr',
    hints: [
      'Schau dir die Zahlen auf dem Ziffernblatt genau an.',
      'Der Lebkuchenmann hat das Foto durch einen Spiegel gemacht.',
      'Gespiegelt zeigt sie 9:50, in Wirklichkeit ist es 2:10 Uhr.',
    ],
    reply: [
      'ginger',
      'Zehn nach zwei! Da ist meine Uhr vom Haken gefallen, so doll hat alles gewackelt. Und angehalten hat der Schlitten nicht: Die Spuren gehen einfach weiter, Richtung Norden.',
    ],
    clue: 'Um 2:10 Uhr fuhr der Schlitten an der Bäckerei vorbei, ohne anzuhalten. Die Spuren führen weiter nach Norden.',
    strike: ['Bäckerei'],
  },
  {
    who: 'elf',
    title: 'Der Schlüssel im Schnee',
    intro: [
      [
        'elf',
        'Der Lebkuchenmann hat vor seiner Tür einen Schlüssel im Schnee gefunden mit einem Anhänger von mir, ich beschrifte alles. Geheim natürlich.',
      ],
      [
        'elf',
        'Ich war übrigens die ganze Nacht in meiner Werkstatt und hab durchgearbeitet. Da kam niemand mit einem Schlitten vorbei.',
      ],
    ],
    puzzle:
      'Knöpfchen legt einen seiner Anhänger zum Vergleich neben den gefundenen Schlüssel.' +
      KEY_HOOKS +
      'Was öffnet der gefundene Schlüssel?',
    accept: ['schlitten', 'schlittenschluessel'],
    solution: 'SCHLITTEN',
    hints: [
      'Den Anhänger am Hammer kannst du eigentlich schon lesen.',
      'Aus H wurde K. Wie weit liegen die beiden im Alphabet auseinander?',
      'Jeder Buchstabe 3 zurück: SCHLITTEN.',
    ],
    reply: [
      'elf',
      'Der Schlittenschlüssel! Der hängt sonst im Stall, und nur wer dort wohnt, weiß, an welchem Haken.',
    ],
    clue: 'Vor der Bäckerei lag der Schlittenschlüssel im Schnee. Wer ihn genommen hat, kannte sich im Stall gut aus. In der Werkstatt war hingegen niemand außer Knöpfchen.',
    strike: ['Werkstatt'],
  },
  {
    who: 'santa',
    title: '3. Advent: Ein Gedicht',
    special: true,
    intro: [
      ['santa', 'Wenn ich aufgeregt bin, schreibe ich Gedichte. Das beruhigt mich.'],
      ['mrs', 'Und er versteckt immer ein Wort darin. Jedes Mal.'],
    ],
    puzzle:
      "<div class='poem'>Auf Zehenspitzen, Schritt für Schritt,<br>bedacht und leise, jeder Tritt.<br>Sanft schob sich der Riegel auf,<br>im Dunkeln nahm es seinen Lauf.<br>Christbaumkugeln klirrten leis,<br>hinaus ging’s in die Nacht so weiß.<br>Tür wieder zu, ganz sacht, und niemand ist erwacht.</div>Welches Wort hat der Weihnachtsmann versteckt?",
    accept: ['absicht'],
    solution: 'ABSICHT',
    hints: [
      'Das Wort steckt nicht in einer Zeile, sondern in allen zusammen.',
      'Achte auf den Anfang jeder Zeile.',
      'ABSICHT',
    ],
    reply: [
      'santa',
      'Absicht! Da hat jemand mit Absicht die Tür geöffnet und wieder geschlossen. Das war kein Versehen.',
    ],
    clue: 'Die Stalltür wurde geöffnet und hinterher sacht wieder geschlossen. Das war Absicht, kein Versehen.',
    strike: ['Versehen'],
  },
  {
    who: 'bear',
    title: 'Am Eistor',
    intro: [['bear', 'Halt. Hier kommt niemand durch, der meine Frage nicht beantwortet.']],
    puzzle: '„Je mehr man davon wegnimmt, desto größer wird es. Was ist es?“',
    accept: ['loch', 'ein loch'],
    solution: 'Ein Loch',
    hints: ['Es ist eigentlich … nichts.', 'Man kann es graben.', 'Ein Loch.'],
    reply: [
      'bear',
      'Richtig. Du darfst durch. Übrigens: In der Tatnacht war schon mal jemand hier. Vier Beine und sehr höflich. Die Antwort wusste er sofort. Mehr hab ich nicht gesehen, es war stockdunkel.',
    ],
    clue: 'Berta hat in der Tatnacht jemanden durchs Eistor gelassen, „vier Beine und sehr höflich“.',
    strike: [],
  },
  {
    who: 'grinch',
    title: 'Das Alibi',
    intro: [
      [
        'grinch',
        'Na gut, na gut. Ich hab ein Alibi. Ich war im Kino. Reihe und Platz verrat ich euch aber nur so:',
      ],
    ],
    puzzle:
      "<div class='big mono' style='letter-spacing:.04em;line-height:1.8'>Reihe × Platz = 24<br>Platz − Reihe = 5</div>Auf welchem Platz saß der Grinch?",
    accept: ['8', 'acht', 'platz8'],
    solution: 'Platz 8',
    hints: [
      'Welche Zahlenpaare ergeben multipliziert 24?',
      'Probier 2 und 12, 3 und 8, 4 und 6.',
      'Reihe 3, Platz 8.',
    ],
    reply: [
      'grinch',
      'Reihe 3, Platz 8, Kino Polarstern. Fragt die Kassiererin. Ich hab Popcorn für alle gekauft. Rache? Ich? Wofür denn?',
    ],
    clue: 'Der Grinch saß in der Tatnacht im Kino, die Kassiererin erinnert sich. Rache war nicht sein Plan, im Gegenteil: er hat Popcorn verteilt.',
    strike: ['Grinch', 'Rache'],
  },
  {
    who: 'twins',
    title: 'Der Glitzer-Irrtum',
    intro: [
      ['twins', 'Wir müssen etwas beichten: Der Glitzer ist von uns.'],
      ['twins', 'Aber was wir damit gemacht haben, verraten wir nur zu zweit.'],
    ],
    puzzle: 'Zimt hat ein Raster, Zucker eine Notiz. Was haben die beiden in der Nacht gemacht?',
    halves: [
      {
        name: 'Zimt',
        html: letterGrid(
          [
            ['R', 'E', 'K', 'M'],
            ['A', 'S', 'T', 'L'],
            ['U', 'C', 'O', 'I'],
            ['N', 'F', 'H', 'P'],
          ],
          true,
        ),
      },
      { name: 'Zucker', html: "<div class='big mono'>B4 · B1 · C2 · A3</div>" },
    ],
    contains: ['lack'],
    solution: 'LACK (lackiert)',
    hints: ['Zuckers Notiz sind Koordinaten.', 'B4 heißt Zeile B, Spalte 4.', 'L, A, C, K: LACK'],
    reply: [
      'twins',
      'Wir haben im Schuppen die Rodel der Elfen glitzerlackiert und sie heimlich in den Stall gestellt, mit einem Anhänger: „Für euch“. Eine Schlitten-Überraschung für die Elfen, nicht für den Weihnachtsmann!',
    ],
    clue: 'Die Zwillinge haben nachts im Schuppen am Eistor Rodel glitzerlackiert und sie mit dem Anhänger „Für euch“ in den Stall gestellt. Daher der Glitzer.',
    strike: ['Zimt & Zucker', 'Überraschung'],
  },
  {
    who: 'snowman',
    title: 'Flocke erinnert sich',
    intro: [
      ['snowman', 'Mir ist noch was eingefallen! Aber es ist irgendwie … verkehrt rausgekommen.'],
    ],
    puzzle: "<div class='big mono'>EES SIEMU ZGE WNIE</div>Was wollte Flocke sagen?",
    contains: ['eissee'],
    solution: 'EIN WEG ZUM EISSEE',
    hints: [
      'Die Leerzeichen stimmen nicht.',
      'Lies alles von hinten nach vorn.',
      'EIN WEG ZUM EISSEE',
    ],
    reply: ['snowman', 'Die Kufenspuren führten am Eistor vorbei immer Richtung See.'],
    clue: 'Die Kufenspuren führen am Eistor vorbei weiter zum Eissee.',
    strike: [],
  },
  {
    who: 'penguin',
    title: 'Polarlichter',
    intro: [
      [
        'penguin',
        'Ich hab Fotos für meine Familie gemacht! Von den Lichtern am Himmel, damit sie die mit denen zu Hause vergleichen können.',
      ],
    ],
    puzzle:
      'Pedro hat jedes Foto mit einer Zahl beschriftet. Nur beim letzten hat er’s vergessen.' +
      auroraRow([GREEN, BLUE, GREEN], '121') +
      auroraRow([VIOLET, GREEN], '31') +
      auroraRow([GREEN, GREEN, VIOLET, BLUE, GREEN], '?'),
    accept: ['11321'],
    solution: '11321',
    hints: [
      'Vergleiche die ersten beiden Fotos.',
      'Grün ist 1.',
      'Grün 1, Blau 2, Violett 3: 11321.',
    ],
    reply: [
      'penguin',
      '11321! Und schaut mal, auf dem letzten Foto: Mitten auf dem Eissee ist ein dunkler Fleck. Was ist das denn?',
    ],
    clue: 'Auf Pedros letztem Foto ist mitten auf dem Eissee ein dunkler Fleck.',
    strike: [],
  },
  {
    who: 'elf',
    title: 'Die Glöckchen',
    intro: [
      [
        'elf',
        'Mein Nachtwächter-Gerät hat in der Tatnacht ein Glöckchen aufgenommen. Jedes Rentier trägt eins, und jedes klingt anders.',
      ],
    ],
    puzzle: 'Hör dir die Aufnahme an. Wem gehört das Glöckchen?',
    widget: {
      kind: 'bells',
      bells: [
        { name: 'Blitz', notes: [660, 880, 660] },
        { name: 'Donner', notes: [330, 330, 262] },
        { name: 'Komet', notes: [523, 659, 784] },
        { name: 'Tänzer', notes: [784, 659, 523] },
      ],
      recording: [523, 659, 784],
    },
    accept: ['komet', 'kometen'],
    solution: 'Komet',
    hints: [
      'Hör dir jedes Glöckchen einzeln an.',
      'Tänzers Glöckchen klingt ähnlich, nur andersherum.',
      'Komet',
    ],
    reply: [
      'elf',
      'Aber Komet hat doch gesagt, dass er die ganze Nacht in seiner Box war. Mein Gerät stand aber gar nicht im Stall.',
    ],
    clue: 'Komet hat geflunkert: Sein Glöckchen hat in der Tatnacht geklingelt, aber nicht in seiner Box.',
    strike: [],
  },
  {
    who: 'mrs',
    title: '4. Advent: Die Nacht',
    special: true,
    intro: [
      [
        'mrs',
        'Ich habe alle Aussagen zur Tatnacht auf Karten geschrieben. Jede trägt einen Buchstaben. Leider sind sie mir runtergefallen.',
      ],
    ],
    puzzle:
      timeCards([
        ['S', 'Berta: „Es war halb drei, als ich jemanden durchs Eistor gelassen habe.“'],
        ['G', 'Die Küchenuhr der Bäckerei fiel um zehn nach zwei vom Haken.'],
        ['T', 'Flocke: „Eine Viertelstunde vor drei waren die Hufspuren schon da.“'],
        ['A', 'Mila: „Punkt zwei bin ich eingenickt.“'],
        ['N', 'Die Stalltür ging fünf Minuten nach Milas Einnicken auf.'],
      ]) + 'Was erzählt die Nacht?',
    accept: ['angst'],
    solution: 'ANGST',
    hints: [
      'Jede Karte beschreibt einen Moment der Tatnacht.',
      'Bring die Karten in die zeitliche Reihenfolge.',
      '2:00 A, 2:05 N, 2:10 G, 2:30 S, 2:45 T: ANGST',
    ],
    reply: ['mrs', 'Wer den Schlitten genommen hat, meinte es nicht böse. Er hatte Angst.'],
    clue: 'Der Täter hatte keine bösen Absichten, sondern Angst. Neid können wir also auch ausschließen.',
    strike: ['Neid'],
  },
  {
    who: 'rudolph',
    title: 'Wintersonnenwende',
    special: true,
    intro: [
      [
        'rudolph',
        'Heute ist die längste Nacht des Jahres. Aber keine Sorge, ich zeig euch den Weg. Ich leuchte, ihr sucht.',
      ],
    ],
    puzzle: 'Irgendwo in der Dunkelheit stehen vier Ziffern. Lies sie von links nach rechts.',
    widget: {
      kind: 'torch',
      digits: [
        { digit: '2', left: 10, top: 20 },
        { digit: '1', left: 34, top: 58 },
        { digit: '1', left: 58, top: 24 },
        { digit: '2', left: 84, top: 46 },
      ],
    },
    accept: ['2112'],
    solution: '2112',
    hints: [
      'Ganz links und ganz rechts steht dieselbe Ziffer.',
      'Es ist ein Datum.',
      '2112, also der 21.12.',
    ],
    reply: ['rudolph', 'Ihr habt den Weg gefunden, in der Ferne glitzert schon der Eissee.'],
    clue: 'Rudolph führt uns Richtung Eissee und sagt kaum ein Wort.',
    strike: [],
  },
  {
    who: 'bear',
    title: 'Über den Eissee',
    intro: [
      [
        'bear',
        'Der See ist gefroren, aber nicht überall fest. Pass bloß auf. Ich bin schon vorgegangen, am besten spring, wie ich gesprungen bin, sonst wird’s nass und kalt.',
      ],
    ],
    puzzle:
      'Bertas Spuren siehst du auf den ersten drei Schollen. Spring weiter bis zur Mitte des Sees.',
    widget: {
      kind: 'floes',
      grid: [
        [41, 35, 39, 36],
        [29, 38, 31, 37],
        [22, 17, 24, 30],
        [8, 13, 18, 23],
        [6, 9, 12, 16],
        [4, 11, 7, 14],
        [3, 5, 2, 15],
      ],
      start: [
        [6, 0],
        [5, 0],
        [4, 0],
      ],
    },
    accept: ['91318243139'],
    solution: 'Die Abstände wachsen um eins: 3, 4, 6, 9, 13, 18, 24, 31, 39',
    hints: [
      'Schau auf die Zahlen unter Bertas Spuren. Wie groß sind die Sprünge dazwischen?',
      '3, 4, 6: erst +1, dann +2. Jeder Sprung ist um eins größer als der davor.',
      '9, 13, 18, 24, 31, 39.',
    ],
    reply: ['bear', 'Gut gesprungen. Und schaut mal da, in der Mitte. Was ragt da aus dem Eis?'],
    clue: 'In der Mitte des Eissees ragen Kufen aus dem Eis. Der Schlitten ist eingefroren!',
    strike: ['Polarlicht-Gipfel'],
  },
  {
    who: 'mrs',
    title: 'Das Tagebuch',
    intro: [
      [
        'mrs',
        'Jemand hat mir heute Morgen ein Tagebuch vor die Tür gelegt. Mit Hufabdrücken auf dem Umschlag. Die letzte Seite ist seltsam.',
      ],
    ],
    puzzle:
      "<div class='big mono'>9-3-8 · 23-15-12-12-20-5 · 21-5-2-5-14</div>Was steht auf der letzten Seite?",
    contains: ['ueben'],
    solution: 'ICH WOLLTE UEBEN',
    hints: ['Jede Zahl steht für einen Buchstaben.', '9 ist I, 3 ist C.', 'ICH WOLLTE UEBEN'],
    reply: [
      'mrs',
      'Mhh, jemand wollte heimlich üben? Mit unserem Schlitten? Wer das wohl war? Morgen ist Heiligabend, da brauchen wir den Schlitten unbedingt wieder!',
    ],
    clue: 'Wer den Schlitten genommen hat, hatte Angst und wollte heimlich üben.',
    strike: [],
  },
  {
    who: 'santa',
    title: 'Heiligabend',
    special: true,
    intro: [
      [
        'santa',
        'Heiligabend! Habt ihr den Fall gelöst? Dann sagt mir doch bitte, wo ich meinen treuen Schlitten finden kann.',
      ],
    ],
    puzzle: 'Erhebe Anklage und zeig mir, wo der Schlitten steckt.',
    widget: { kind: 'final' },
    accept: ['rudolpheisseeangst'],
    traps: {
      kometeisseeangst:
        'Komet will zwar den Schlitten anführen, aber er darf es nicht. Wer muss bald zum ersten Mal ganz vorn fliegen?',
    },
    solution: 'Rudolph · Eissee · Angst. Tippe auf die Kufen im Eis.',
    hints: [
      'Schau auf deine Tafel im Notizbuch. Bei „Wer“ sind noch zwei übrig.',
      'Wer muss dieses Jahr zum ersten Mal ganz vorn fliegen? Komet hat es dir an Tag 6 verraten.',
      'Rudolph, Eissee, Angst. Danach tipp rechts im Eis auf die zwei Kufenspitzen.',
    ],
    reply: [
      'rudolph',
      'Ja, ich war’s. Ich fliege heute zum ersten Mal ganz vorn und hatte solche Angst, es zu vermasseln. Ich wollte heimlich üben - und dann bin ich auf dem See eingebrochen. Komet hat übrigens nichts damit zu tun: Der lag mit Fieber im Krankenstall und wollte nicht, dass jemand das weiß. Es tut mir so leid.',
    ],
    clue: 'Fall gelöst: Rudolph hat den Schlitten aus Angst vor seinem ersten Flug zum Eissee gezogen, um heimlich zu üben.',
    strike: [],
  },
]
