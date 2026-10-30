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
        'Guten Morgen! Komm mit, ich zeig dir meinen Schlitten. Frisch poliert für die große Nacht!',
      ],
      [
        'santa',
        'Oh. Der Code vom Stalltor. Den hab ich … vergessen. Zum Glück hab ich mir eine Eselsbrücke ins Schloss geritzt.',
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
    reply: ['santa', 'Offen! Und hier steht er, mein … Moment. Wo ist er? MEIN SCHLITTEN IST WEG!'],
    clue: 'Der Schlitten verschwand in der Nacht zum 1. Dezember aus dem Rentierstall.',
    strike: [],
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
    reply: ['mrs', 'Mila also. Sie gibt zu, dass sie eingenickt ist. Peinlich, peinlich.'],
    clue: 'Mila hatte von 0 bis 4 Uhr Dienst. Um 2 Uhr ist sie eingenickt und erst um 4 wieder aufgewacht.',
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
      ['elf', 'Seht ihr? Alles ordentlich. Alles … Moment.'],
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
    accept: ['geschirr', 'zuggeschirr'],
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
    clue: 'In der Nacht hat jemand das Zuggeschirr benutzt. Der Schlitten wurde von einem Rentier gezogen.',
    strike: [],
  },
  {
    who: 'twins',
    title: 'Zwei halbe Zettel',
    intro: [
      ['twins', 'Wir haben im Stall was gefunden!'],
      [
        'twins',
        'Und dann haben wir uns gestritten, wer’s behalten darf. Jetzt hat jede ein Stück.',
      ],
    ],
    puzzle: 'Zimt hat das eine Stück, Zucker das andere. Was steht auf dem Zettel?',
    halves: [
      {
        name: 'Zimt',
        html: letterGrid([
          ['G', 'X', 'L', 'M'],
          ['Q', 'I', 'T', 'A'],
          ['Z', 'U', 'E', 'P'],
          ['R', 'O', 'K', 'N'],
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
    accept: ['glitzer'],
    solution: 'GLITZER',
    hints: [
      'Beide Stücke sind gleich groß.',
      'Leg Zuckers Stück gedanklich über Zimts Buchstaben. Was schaut durch die Löcher?',
      'GLITZER',
    ],
    reply: ['twins', 'Glitzer! Wir lieben Glitzer. Aber wir waren’s nicht! Glauben wir.'],
    clue: 'Auf dem Stallboden liegt Glitzer. Wer bastelt nachts mit Glitzer?',
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
      'An der Stallwand hängt ein altes Plakat. Rudolph schielt immer wieder darauf.' +
      MORSE_POSTER,
    widget: { kind: 'morse', signal: '-.- --- -- . -' },
    accept: ['komet'],
    solution: 'KOMET',
    hints: [
      'Achte darauf, wie lange die Nase jeweils leuchtet.',
      'Kurz ist ·, lang ist –. Längere Pausen trennen die Buchstaben.',
      '–·– / ––– / –– / · / – ergibt KOMET.',
    ],
    reply: ['rudolph', 'Ich hab nichts gesagt! Aber … Komet war heute Nacht so unruhig. Nur so.'],
    clue: 'Rudolph sagt, Komet sei in der Tatnacht unruhig gewesen. Komet wollte schon immer vorne fliegen.',
    strike: [],
  },
  {
    who: 'komet',
    title: '2. Advent: Komet ist beleidigt',
    special: true,
    intro: [
      [
        'komet',
        'Ich soll es gewesen sein? Unverschämt! Ich habe die ganze Nacht in meiner Box geschlafen.',
      ],
      ['komet', 'Welche Box? Findet’s doch selbst raus, Herr und Frau Detektiv.'],
    ],
    puzzle:
      'Fünf Rentiere schlafen nebeneinander in den Boxen 1 bis 5.<ul><li>Rudolphs Box liegt an einem Ende der Reihe.</li><li>Blitz schläft in Box 2.</li><li>Tänzer schläft nicht neben Blitz.</li><li>Komet schläft direkt neben Donner.</li><li>Donners Box hat eine höhere Nummer als Komets.</li></ul>In welcher Box schläft Komet?',
    accept: ['3', 'drei', 'box3'],
    solution: '3',
    hints: [
      'Fang mit Blitz und Tänzer an. Wo kann Tänzer überhaupt stehen?',
      'Steht Rudolph in Box 5, passen Komet und Donner nicht mehr nebeneinander.',
      'Rudolph 1, Blitz 2, Komet 3, Donner 4, Tänzer 5.',
    ],
    reply: ['komet', 'Box 3. Direkt am Tor, ja und? Ich hab geschlafen!'],
    clue: 'Komets Box liegt direkt am Stalltor. Er hätte nachts unbemerkt hinausgekonnt.',
    strike: [],
  },
  {
    who: 'grinch',
    title: 'Das Verhör',
    intro: [['grinch', 'Verhör? Mich? Pah. Ich rede nur mit Leuten, die mein Rätsel knacken.']],
    puzzle:
      '„Ich trag ein Kleid aus Nadeln fein, doch näh ich nie, das wär gemein. Im Dezember komm ich rein. Wer mag ich sein?“',
    accept: ['tannenbaum', 'weihnachtsbaum', 'christbaum', 'tanne', 'baum'],
    solution: 'Tannenbaum',
    hints: ['Nadeln, aber kein Nähzeug.', 'Er steht im Dezember im Wohnzimmer.', 'Ein Tannenbaum.'],
    reply: ['grinch', 'Grmpf. Na schön. Aber ich verrat euch nichts. Außer dass ich’s nicht war.'],
    clue: 'Am Stalltor hängen grüne Fusseln. Der Grinch ist grün … und verdächtig.',
    strike: [],
  },
  {
    who: 'snowman',
    title: 'Was hab ich gesehen?',
    intro: [
      [
        'snowman',
        'Ich stand die ganze Nacht vor dem Stall. Ich hab alles gesehen! Ich weiß es noch genau. Also … ungefähr.',
      ],
      ['snowman', 'Ich zeig’s euch, aber schnell. Dann ist es wieder weg.'],
    ],
    puzzle: 'Spiel Flockes Erinnerung ab. Welches Tier hat er <b>zweimal</b> gesehen?',
    widget: {
      kind: 'memory',
      items: [
        'ein Mond',
        'eine Eule',
        'eine Sternschnuppe',
        'ein Hase',
        'eine Laterne',
        'ein Fuchs',
        'Hufspuren nach Norden',
        'eine Eule',
        'Schneeflocken',
      ],
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
      'Genau, die Eule! Und dazwischen Hufspuren nach Norden. Ich wär hinterher, aber … ich hab keine Beine.',
    ],
    clue: 'Flocke sah Hufspuren nach Norden, also ein Rentier. Er selbst kann sich nicht von der Stelle bewegen.',
    strike: ['Schneemann'],
  },
  {
    who: 'ginger',
    title: 'Das Buchstabenblech',
    intro: [
      [
        'ginger',
        'Skandal! Mein Blech mit Buchstabenkeksen stand zum Abkühlen auf dem Fensterbrett. Heute Morgen lag es im Schnee, und fünf Kekse fehlen.',
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
    clue: 'In der Nacht ist ein Schlitten an der Bäckerei vorbeigerauscht. Im Stall steht er also nicht mehr.',
    strike: ['Rentierstall'],
  },
  {
    who: 'penguin',
    title: 'Post vom Südpol',
    intro: [
      [
        'penguin',
        'Hola! Ich bin Pedro vom Südpol. Ich war in der Nacht auch unterwegs! Ich hab’s gleich meiner Mama geschrieben.',
      ],
    ],
    puzzle:
      "Pedro zeigt dir seine Postkarte. Was hat er in der Nacht gemacht?<div class='postcard flip'>Liebe Mama, der Nordpol ist komisch. Ich wollte zum Stall und bin die ganze Nacht nur im Kreis gelaufen. Dein Pedro</div>",
    contains: ['kreis'],
    solution: 'Er ist im Kreis gelaufen',
    hints: [
      'Pedro kommt vom anderen Ende der Welt. Bei ihm ist alles andersrum.',
      'Dreh dein Handy.',
      'Er ist die ganze Nacht im Kreis gelaufen.',
    ],
    reply: ['penguin', 'Die ganze Nacht! Ich hab den Stall kein einziges Mal gesehen.'],
    clue: 'Pedro ist die ganze Nacht im Kreis gelaufen und hat den Stall nie erreicht.',
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
    puzzle: MIRRORED_CLOCK + 'Um wie viel Uhr ist die Uhr stehen geblieben?',
    accept: ['210', '0210', '1410', 'zehnnachzwei'],
    traps: {
      '950': 'Fast. Schau dir die Zahlen auf dem Ziffernblatt genau an.',
      '0950': 'Fast. Schau dir die Zahlen auf dem Ziffernblatt genau an.',
    },
    solution: '2:10 Uhr',
    hints: [
      'Schau dir die Zahlen auf dem Ziffernblatt genau an.',
      'Der Lebkuchenmann hat das Foto durch einen Spiegel gemacht.',
      'Gespiegelt zeigt sie 9:50, wirklich ist es 2:10 Uhr.',
    ],
    reply: [
      'ginger',
      'Zehn nach zwei! Genau da hat der Schlitten die ganze Bäckerei wackeln lassen. Angehalten hat er aber nicht, nur vorbeigerast.',
    ],
    clue: 'Um 2:10 Uhr raste der Schlitten an der Bäckerei vorbei, ohne anzuhalten. Die Spuren führen weiter nach Norden.',
    strike: ['Bäckerei'],
  },
  {
    who: 'elf',
    title: 'Der Schlüssel im Schnee',
    intro: [
      [
        'elf',
        'Der Lebkuchenmann hat vor seiner Tür einen Schlüssel im Schnee gefunden. Der Anhänger ist von mir, ich beschrifte alles. Geheim natürlich.',
      ],
      [
        'elf',
        'Ich war übrigens die ganze Nacht in meiner Werkstatt und hab durchgearbeitet. Da kam niemand mit einem Schlitten vorbei.',
      ],
    ],
    puzzle:
      'Knöpfchen legt einen seiner Anhänger zum Vergleich neben den gefundenen Schlüssel.' +
      KEY_HOOKS +
      'Wofür ist der gefundene Schlüssel?',
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
    clue: 'Vor der Bäckerei lag der Schlittenschlüssel im Schnee. Wer ihn genommen hat, kannte sich im Stall gut aus. In der Werkstatt war niemand.',
    strike: ['Werkstatt'],
  },
  {
    who: 'santa',
    title: '3. Advent: Ein Gedicht',
    special: true,
    intro: [
      ['santa', 'Wenn ich aufgeregt bin, schreibe ich Gedichte. Das beruhigt.'],
      ['mrs', 'Und er versteckt immer ein Wort darin. Jedes Mal.'],
    ],
    puzzle:
      "<div class='poem'>Alle Rentiere schliefen tief im Stroh,<br>bis auf einen, der war gar nicht froh.<br>Still schob er den Riegel auf,<br>in der Nacht nahm alles seinen Lauf.<br>Christbaumkugeln klirrten ganz leis,<br>hinaus ging’s in die Nacht so weiß.<br>Tür wieder zu, ganz sacht, und niemand ist erwacht.</div>Welches Wort hat der Weihnachtsmann versteckt?",
    accept: ['absicht'],
    solution: 'ABSICHT',
    hints: [
      'Das Wort steckt nicht in einer Zeile, sondern in allen zusammen.',
      'Achte auf den Anfang jeder Zeile.',
      'ABSICHT',
    ],
    reply: [
      'santa',
      'Absicht! Da hat jemand mit Absicht die Tür geöffnet und wieder geschlossen. Kein Versehen.',
    ],
    clue: 'Die Stalltür wurde geöffnet und hinterher sacht wieder geschlossen. Das war Absicht, kein Versehen.',
    strike: ['Versehen'],
  },
  {
    who: 'bear',
    title: 'Am Eistor',
    intro: [['bear', 'Halt. Hier kommt niemand durch, der meine Frage nicht beantwortet.']],
    puzzle: '„Je mehr man davon wegnimmt, desto größer wird es. Was ist es?“',
    accept: ['loch'],
    solution: 'Ein Loch',
    hints: ['Es ist eigentlich … nichts.', 'Man kann es graben.', 'Ein Loch.'],
    reply: [
      'bear',
      'Richtig. Du darfst durch. Übrigens: In der Tatnacht war schon mal jemand hier.',
    ],
    clue: 'Berta hat in der Tatnacht jemanden durchs Eistor gelassen. „Vier Beine und sehr höflich“, sagt sie.',
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
      'Welche Zahlenpaare ergeben malgenommen 24?',
      'Probier 2 und 12, 3 und 8, 4 und 6.',
      'Reihe 3, Platz 8.',
    ],
    reply: [
      'grinch',
      'Reihe 3, Platz 8, Kino Polarstern. Fragt die Kassiererin. Ich hab Popcorn für alle gekauft. Rache? Ich? Pff.',
    ],
    clue: 'Der Grinch saß in der Tatnacht im Kino, die Kassiererin erinnert sich. Rache war nicht sein Plan, er hat Popcorn verteilt.',
    strike: ['Grinch', 'Rache'],
  },
  {
    who: 'twins',
    title: 'Der Glitzer-Irrtum',
    intro: [
      ['twins', 'Okay, okay, wir geben’s zu: Der Glitzer ist von uns!'],
      ['twins', 'Aber was wir gemacht haben, verraten wir nur zu zweit.'],
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
      'Lack! Wir haben im Rodelschuppen die Rodel der Elfen glitzerlackiert und sie heimlich in den Stall gestellt, da holen die Elfen sie morgens ab. Eine Überraschung für die Elfen, nicht für den Weihnachtsmann!',
    ],
    clue: 'Die Zwillinge haben nachts im Rodelschuppen am Eistor Rodel glitzerlackiert und sie in den Stall gebracht. Daher der Glitzer. Ihre Überraschung galt den Elfen.',
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
    reply: [
      'snowman',
      'Ein Weg zum Eissee! Die Kufenspuren sind am Eistor vorbei weitergegangen, immer Richtung See.',
    ],
    clue: 'Die Kufenspuren führen am Eistor vorbei weiter zum Eissee.',
    strike: [],
  },
  {
    who: 'penguin',
    title: 'Polarlichter',
    intro: [
      [
        'penguin',
        'Ich hab Fotos gemacht! Von den Lichtern am Himmel. Bei uns gibt’s die nicht in Grün.',
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
      '11321! Und auf dem letzten Foto sieht man den Gipfel. Ganz glatter Schnee. Langweilig!',
    ],
    clue: 'Auf dem Polarlicht-Gipfel liegt unberührter Schnee. Dort war niemand.',
    strike: ['Polarlicht-Gipfel'],
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
      'Komet! Das Gerät stand im Krankenstall. Er hat geflunkert: Er war gar nicht in seiner Box, er lag die ganze Nacht mit Fieber hier. Zugeben wollte er das nicht. Wer vorne fliegen will, darf doch nicht krank sein.',
    ],
    clue: 'Komet hat geflunkert: Er lag die ganze Nacht mit Fieber im Krankenstall, nicht in seiner Box am Tor. Ohne Komet bleibt auch der Neid ohne Täter.',
    strike: ['Komet', 'Neid'],
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
    reply: ['mrs', 'Angst. Wer den Schlitten genommen hat, war nicht böse. Er hatte Angst.'],
    clue: 'Die Nacht erzählt ein Wort: ANGST. Der Täter hatte keine bösen Absichten.',
    strike: [],
  },
  {
    who: 'rudolph',
    title: 'Wintersonnenwende',
    special: true,
    intro: [
      [
        'rudolph',
        'Heute ist die längste Nacht des Jahres. Ich zeig euch den Weg. Ich leuchte, ihr sucht.',
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
    reply: ['rudolph', 'Ihr habt den Weg gefunden. Ich … ich muss euch was sagen. Morgen. Am See.'],
    clue: 'Rudolph führt euch Richtung Eissee und sagt kaum ein Wort.',
    strike: [],
  },
  {
    who: 'bear',
    title: 'Über den Eissee',
    intro: [
      [
        'bear',
        'Der See ist gefroren, aber nicht überall fest. Ich bin schon vorgegangen. Spring, wie ich gesprungen bin, sonst wird’s nass.',
      ],
    ],
    puzzle:
      'Bertas Spuren siehst du auf den ersten drei Schollen. Spring weiter bis zur Mitte des Sees.',
    widget: {
      kind: 'floes',
      grid: [
        [12, 18, 17, 20],
        [15, 13, 14, 16],
        [6, 9, 12, 10],
        [4, 8, 11, 1],
        [3, 5, 2, 7],
      ],
      start: [
        [4, 0],
        [3, 0],
        [2, 0],
      ],
    },
    accept: ['91318'],
    solution: 'Die Abstände wachsen um eins: 3, 4, 6, 9, 13, 18',
    hints: [
      'Schau auf die Zahlen unter Bertas Spuren.',
      '3, 4, 6: Die Abstände werden jedes Mal größer.',
      '+1, +2, +3, +4, +5: also 9, dann 13, dann 18.',
    ],
    reply: ['bear', 'Gut gesprungen. Und schaut mal da, in der Mitte. Was ragt da aus dem Eis?'],
    clue: 'In der Mitte des Eissees ragen Kufen aus dem Eis. Der Schlitten ist eingefroren!',
    strike: [],
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
      '„Ich wollte üben.“ Da hatte jemand große Angst vor etwas, das er bald zum ersten Mal machen muss, und wollte heimlich üben. Mit unserem Schlitten. Wer das wohl war? Morgen ist Heiligabend, da brauchen wir den Schlitten unbedingt wieder!',
    ],
    clue: 'Wer den Schlitten genommen hat, hatte Angst und wollte heimlich üben. Er hat Hufe und ein Tagebuch.',
    strike: [],
  },
  {
    who: 'santa',
    title: 'Heiligabend',
    special: true,
    intro: [
      [
        'santa',
        'Heiligabend! Habt ihr den Fall gelöst? Dann sagt mir doch bitte, wo ich meinen treuen Schlitten finde.',
      ],
    ],
    puzzle: 'Erhebe Anklage. Danach zeig mir, wo genau der Schlitten steckt.',
    widget: { kind: 'final' },
    accept: ['rudolpheisseeangst'],
    solution: 'Rudolph · Eissee · Angst, dann auf die Kufen im Eis tippen',
    hints: [
      'Schau auf deine Tafel im Notizbuch.',
      'Rudolph, Eissee, Angst.',
      'Rechts im Eis ragen zwei Kufenspitzen heraus. Tipp darauf.',
    ],
    reply: [
      'rudolph',
      'Ja, ich war’s. Ich fliege heute zum ersten Mal ganz vorn und hatte solche Angst, es zu vermasseln. Ich wollte heimlich üben … und dann bin ich auf dem See eingebrochen. Es tut mir so leid.',
    ],
    clue: 'Fall gelöst: Rudolph hat den Schlitten aus Angst vor seinem ersten Flug zum Eissee gezogen, um heimlich zu üben.',
    strike: [],
  },
]
