// Timeline data for the five people. Built from the final LR timelines (November 2026).
// Each timeline mixes act headings ({type:'act'}) and cards ({type:'card'}).
// kind 'charge' cards carry an LR score; kind 'context' cards have no meter.
window.PEOPLE = {
  "houchard": {
    "slug": "houchard",
    "name": "Jean-Nicolas Houchard",
    "role": "General",
    "portrait": "assets/houchard.jpg",
    "bio": "Born in Forbach, in Lorraine, Houchard joined the cavalry at sixteen and rose from the ranks, unusual for an officer of his day. In 1793 he took command of the Army of the North and won the Battle of Hondschoote against an Anglo-German army under the Duke of York. Weeks later he was arrested for failing to pursue the enemy, tried by the Revolutionary Tribunal and guillotined.",
    "fun_fact": "He spoke French with a heavy German accent, being of German descent from Forbach in Lorraine. Wounded in Corsica years earlier, he carried a saber scar across his cheek. At his trial he reportedly answered the charge of cowardice by showing his battle wounds.",
    "bio_source": {
      "label": "Wikipedia: Jean Nicolas Houchard",
      "url": "https://en.wikipedia.org/wiki/Jean_Nicolas_Houchard"
    },
    "outcome": "Executed 17 November 1793",
    "timeline": [
      {
        "type": "act",
        "title": "Act I · The general",
        "sub": "1792 – August 1793. A capable officer, praised in the reports, first blamed at another man's trial."
      },
      {
        "type": "card",
        "date": "1792-12-11",
        "date_text": "11 December 1792",
        "label": "Context (praise)",
        "kind": "context",
        "passage_fr": "Houchart a arrêté 12.0CO hommes pendant toute la journée avec 2,000 hommes feulement ; il a fait des piifonniers , et n'a pas perdu un fcul homme.",
        "passage_en": "Houchard held off 12,000 men throughout the entire day with only 2,000 men; he took prisoners and did not lose a single man.",
        "source": "Le Moniteur universel, issue of 11 December 1792."
      },
      {
        "type": "card",
        "date": "1793-08-06",
        "date_text": "6 August 1793",
        "label": "Context (early suspicion)",
        "kind": "context",
        "passage_fr": "Leur entrevue avec Berthelmy, rrfavori” du général Houchard : ils se défient et de Rerthelmy et de Houchard.",
        "passage_en": "Their interview with Berthelmy, 'favorite' of General Houchard: they mistrust both Berthelmy and Houchard.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 5, view 508."
      },
      {
        "type": "card",
        "date": "1793-08-23",
        "date_text": "23 August 1793",
        "label": "Reported accusation",
        "kind": "charge",
        "passage_fr": "Sur le reproche de n'avoir pas garni Cronfiadt ni Manheim , par où les ennemis ont débouché pour cerner nos places fion- ticres , il prétend toujours que c'est la faute d» général Houchard.",
        "passage_en": "Regarding the reproach of not having garrisoned Kronstadt or Mannheim, through which the enemy emerged to surround our frontier strongholds, he still claims that it is the fault of General Houchard.",
        "source": "Le Moniteur universel, issue of 23 August 1793.",
        "charge_fr": "responsabilité imputée par Custine au général Houchard pour le défaut de garnison à Cronstadt et Mannheim",
        "charge_en": "Blamed by Custine for leaving Cronstadt and Mannheim without a garrison",
        "p_execution": 0.251
      },
      {
        "type": "act",
        "title": "Act II · Hondschoote",
        "sub": "8 September 1793. Houchard beats the British and Hanoverians at Hondschoote and relieves Dunkirk. Within days the victory is turned against him."
      },
      {
        "type": "card",
        "date": "1793-09-13",
        "date_text": "13 September 1793",
        "label": "Context (praise)",
        "kind": "context",
        "passage_fr": "La celé.lté que l'ennemi a mis dans fon dccam- pemtnt , nous prouve la terrent que les operations du général Bouchard lui Ont du infpirer.",
        "passage_en": "The speed that the enemy put into their decampment proves to us the terror that General Houchard's operations must have inspired in them.",
        "source": "Le Moniteur universel, issue of 13 September 1793."
      },
      {
        "type": "card",
        "date": "1793-09-26",
        "date_text": "26 September 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "Nous venons d'apprendre comment, après la victoire remportée par nos braves soldats à Hondschoote, messieurs Houchard, Berthelmy et Vernon se gorgeaient de bon vin, de bonne chair, laissant fuir l'ennemi, abandonnant nos soldats et les succès de la victoire.",
        "passage_en": "We have just learned how, after the victory won by our brave soldiers at Hondschoote, Messrs. Houchard, Berthelmy, and Vernon gorged themselves on good wine and fine food, letting the enemy escape, abandoning our soldiers and the fruits of victory.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 7, view 89.",
        "charge_fr": "ivrognerie, abandon de ses soldats et abandon des succès de la victoire en laissant fuir l'ennemi après Hondschoote",
        "charge_en": "Drunkenness, abandoning his soldiers, and throwing away the victory by letting the enemy escape after Hondschoote",
        "p_execution": 0.58
      },
      {
        "type": "card",
        "date": "1793-09-27",
        "date_text": "27 September 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "C'cft ainfi que Houchard a été forcé par fes trompes à être victorieux.",
        "passage_en": "It is thus that Houchard was forced by his troops to be victorious.",
        "source": "Le Moniteur universel, issue of 27 September 1793.",
        "charge_fr": "avoir été forcé par ses troupes à être victorieux",
        "charge_en": "Having been forced by his own troops to win",
        "p_execution": 0.611
      },
      {
        "type": "act",
        "title": "Act III · Arrest",
        "sub": "24–29 September 1793. Arrested by the representatives on mission; letters found in his papers turn incompetence into treason."
      },
      {
        "type": "card",
        "date": "1793-09-26",
        "date_text": "26 September 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "Houchird t(l non-fenlcmeni deiiitné , mais il eft en état d atréflation ; Houcîiard a trahi la Nation Fian- çai e ; fous le prt iexie d'un 11 lor phr , Il a 1 c ?ot< é Venner, i , et Dnnkei qhe eft plus que jim ai» meu îcé'. j Si Fou ne fe fût déterminé A rruouvelier piompie» ment i'état-m jot de l'armée du Nord, cette lion- tiere était perdue ; mai* heoreufement tout eft réparé , et fans doute Houchatd payera de (a tète ia là, hc traliifon.",
        "passage_en": "Houchard is not only dismissed, but he is under arrest; Houchard betrayed the French Nation; under the pretext of... he helped the enemy... and undoubtedly Houchard will pay with his head for his cowardly treason.",
        "source": "Le Moniteur universel, issue of 26 September 1793.",
        "charge_fr": "trahison envers la Nation française pour avoir favorisé l'ennemi et mis Dunkerque en danger",
        "charge_en": "Treason against the French nation, for favouring the enemy and endangering Dunkirk",
        "p_execution": 0.82
      },
      {
        "type": "card",
        "date": "1793-09-26",
        "date_text": "26 September 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "Cette lenteur étrange , qui eau fa notre pêne , n'cil-elle pas un des crimes bien mauifcftcs du générai HvUvh tù ?",
        "passage_en": "Is not this strange slowness, which caused our loss, one of the very manifest crimes of General Houchard?",
        "source": "Le Moniteur universel, issue of 26 September 1793.",
        "charge_fr": "crime manifeste commis par la lenteur étrange du général Houchard",
        "charge_en": "A manifest crime: General Houchard's strange slowness",
        "p_execution": 0.536
      },
      {
        "type": "card",
        "date": "1793-09-26",
        "date_text": "26 September 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "Nous vous envoyons ci-joint copie de lettres que l'on a trouvées dans les papiers du général Houchard; c'est une correspondance entre lui et les princes étrangers, tels que le prince héréditaire de Hohenlohe, le colonel commandant l'avant-garde de l'armée prussienne, l'aide de camp de Brunswick.",
        "passage_en": "We send you attached a copy of letters found in General Houchard's papers; it is a correspondence between him and foreign princes, such as the Hereditary Prince of Hohenlohe, the colonel commanding the vanguard of the Prussian army, and Brunswick's aide-de-camp.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 7, view 88.",
        "charge_fr": "correspondance avec des princes étrangers et des commandants ennemis",
        "charge_en": "Correspondence with foreign princes and enemy commanders",
        "p_execution": 0.83
      },
      {
        "type": "card",
        "date": "1793-09-26",
        "date_text": "26 September 1793",
        "label": "Reported accusation",
        "kind": "charge",
        "passage_fr": "[Hentz, Peyssard et Duquesnoy annoncent également à la Convention la découverte de la correspondance de Houchard avec les princes étrangers.",
        "passage_en": "Hentz, Peyssard, and Duquesnoy also announce to the Convention the discovery of Houchard's correspondence with foreign princes.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 7, view 90.",
        "charge_fr": "découverte de la correspondance de Houchard avec des princes étrangers",
        "charge_en": "Discovery of Houchard's correspondence with foreign princes",
        "p_execution": 0.798
      },
      {
        "type": "card",
        "date": "1793-09-29",
        "date_text": "29 September 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "la trame dont Houchard émit le complice et peut-être le chef, vient enfin d être déjouée.",
        "passage_en": "The plot of which Houchard was the accomplice and perhaps the leader has finally just been foiled.",
        "source": "Le Moniteur universel, issue of 29 September 1793.",
        "charge_fr": "complicité ou direction d'une trame déloyale",
        "charge_en": "Complicity in, or leadership of, a disloyal plot",
        "p_execution": 0.465
      },
      {
        "type": "act",
        "title": "Act IV · The plea and the Tribunal",
        "sub": "November 1793. Houchard asks to be tried quickly and is sent to the Revolutionary Tribunal."
      },
      {
        "type": "card",
        "date": "1793-11-16",
        "date_text": "16 November 1793",
        "label": "Context (his plea)",
        "kind": "context",
        "passage_fr": "Houchatd écrit à la Convention pour la prier de hâter fon jugement, et de lui donner les moyens de faire éclater fou innocence par le témoignage de fes fteres d'armes.",
        "passage_en": "Houchard writes to the Convention to request it to expedite his judgment, and to give him the means to demonstrate his innocence through the testimony of his brothers-in-arms.",
        "source": "Le Moniteur universel, issue of 16 November 1793."
      },
      {
        "type": "card",
        "date": "1793-11-16",
        "date_text": "16 November 1793",
        "label": "Context (decree)",
        "kind": "context",
        "passage_fr": "Houchard eft traduit pu tribunal révolutionnaire , les témoins feront r u t e n d u s , ils tiiiOnt la vérité.",
        "passage_en": "Houchard is referred to the Revolutionary Tribunal; the witnesses will be heard, they will tell the truth.",
        "source": "Le Moniteur universel, issue of 16 November 1793."
      }
    ]
  },
  "kellermann": {
    "slug": "kellermann",
    "name": "François Christophe Kellermann",
    "role": "General",
    "portrait": "assets/kellermann.jpg",
    "bio": "Born in Strasbourg in 1735, Kellermann spent his life in the army. On 20 September 1792 his artillery held the line at Valmy and stopped the Prussian advance. In 1793 he commanded the Army of the Alps, and after the treason of General Dumouriez and the revolt of Lyon his loyalty came under suspicion. The Convention dismissed and arrested him. He survived the Terror, and Napoleon later made him a Marshal of France.",
    "fun_fact": "He asked for his heart to be buried on the battlefield at Valmy, and it lies there today.",
    "bio_source": {
      "label": "Wikipedia: François Christophe de Kellermann",
      "url": "https://en.wikipedia.org/wiki/Fran%C3%A7ois_Christophe_de_Kellermann"
    },
    "outcome": "Acquitted 8 November 1794",
    "timeline": [
      {
        "type": "act",
        "title": "Act I · Suspicion (spring 1793)",
        "sub": "After Dumouriez goes over to the Austrians in April 1793, every general is suspect. Kellermann's mail is seized, read, and found clean, but the suspicion stays."
      },
      {
        "type": "card",
        "date": "1793-04-11",
        "date_text": "11 April 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "Il en résulte que Kellermann ne veut plus être environné que de troupes de ligne, qu'il désire surtout commander beaucoup de régiments suisses et qu'enfin, si l'on ne veut lui composer son armée de cette manière, il demande à la cantonner pour l'exercer, en abandonnant à l'ennemi quelques-unes de nos places frontières qu'il prétend pouvoir reprendre quand il lui plaira, se réservant de lui donner, s'il le faut, une superbe bataille sur notre terri- [[view 221]] toire et de mettre à profit l'estime des Prussiens qu'il a militairement acquise dans les dernières campagnes pour traiter définitivement de la paix avec eux.",
        "passage_en": "It follows that Kellermann no longer wants anything around him but line troops, that above all he wants to command many Swiss regiments, and that, if his army is not made up this way, he asks to put it in cantonments to train it, abandoning to the enemy some of our frontier strongholds, which he claims he can retake whenever he pleases, keeping the option, if need be, of giving the enemy a superb battle on our territory, and of using the esteem the Prussians have for him, which he won as a soldier in the last campaigns, to negotiate a definitive peace with them.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 3, view 220–221.",
        "charge_fr": "projet de traiter de la paix avec les Prussiens et d'abandonner à l'ennemi des places frontières",
        "charge_en": "Planning to negotiate peace with the Prussians and to abandon frontier strongholds to the enemy",
        "p_execution": 0.765
      },
      {
        "type": "card",
        "date": "1793-04-14",
        "date_text": "14 April 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "Consternés de la trahison de l'infâme Dumouriez, suspectant tous les généraux, trouvant que Kellermann n'avait point désapprouvé la conduite de ce traître d'une manière assez démonstrative, nous résolûmes d'éclaircir par tous les moyens possibles un soupçon avec lequel nous ne pouvions plus exister.",
        "passage_en": "Dismayed by the treason of the infamous Dumouriez, suspecting all generals, and finding that Kellermann had not disapproved of that traitor's conduct demonstratively enough, we resolved to clear up, by every possible means, a suspicion we could no longer live with.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 3, view 276.",
        "charge_fr": "insuffisance d'opposition à la trahison de Dumouriez",
        "charge_en": "Not opposing Dumouriez's treason strongly enough",
        "p_execution": 0.504
      },
      {
        "type": "card",
        "date": "1793-04-14",
        "date_text": "14 April 1793",
        "label": "Context (procedure)",
        "kind": "context",
        "passage_fr": "C'est nous qui avons fait arrêter et examiner par Basire, Legendre et Rovère les dépêches de Kellermann lors du passage de son courrier à Lyon.",
        "passage_en": "It was we who had Basire, Legendre and Rovère stop and examine Kellermann's dispatches when his courier passed through Lyon.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 3, view 276."
      },
      {
        "type": "card",
        "date": "1793-04-14",
        "date_text": "14 April 1793",
        "label": "Context (expectation)",
        "kind": "context",
        "passage_fr": "D'après la dénonciation de Basire, Legendre et Rovère, qui sont à Lyon M, nous croyons connaître assez la Convention nationale peur prévoir que Kellermann est en ce moment décrété d'accusation ou au moins mandé à la barre.",
        "passage_en": "Given the denunciation by Basire, Legendre and Rovère, who are at Lyon, we believe we know the National Convention well enough to foresee that Kellermann has by now been decreed under accusation, or at least summoned to the bar.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 3, view 276."
      },
      {
        "type": "card",
        "date": "1793-04-14",
        "date_text": "14 April 1793",
        "label": "Context (defence)",
        "kind": "context",
        "passage_fr": "Le général a répondu avec calme à nos reproches et nous a pressé lui-même de vérifier sa correspondance et tous ses papiers. […] Il n'y a pas une seule lettre qui n'ait passé sous nos yeux et nous avons eu la satisfaction de nous convaincre que, dans les relations les plus intimes et les plus secrètes, dans ses pensées et ses intérêts, il n'y a pas une seule [[view 275]] ligne, qui, loin d'inculper Kellermann, ne soit faite au contraire pour l'honorer. Nous avons vu avec le même plaisir qu'il n'a point de rapports avec Dumouriez, ni avec les Egalité; […] ces idées soumises à la Convention ou déposées au sein d'un membre du pouvoir exécutif n'étaient qu'une opinion militaire plus ou moins réfléchie et nullement un système de perfidie.",
        "passage_en": "The general answered our reproaches calmly and himself urged us to check his correspondence and all his papers. […] There is not a single letter that has not passed before our eyes, and we have had the satisfaction of convincing ourselves that, in his most intimate and secret dealings, in his thoughts and in his interests, there is not a single line that, far from incriminating Kellermann, is not on the contrary to his honour. We were equally pleased to see that he has no dealings with Dumouriez, nor with the Égalités; […] these ideas, submitted to the Convention or confided to a member of the executive, were only a military opinion, more or less considered, and in no way a scheme of treachery.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 3, view 274–275."
      },
      {
        "type": "card",
        "date": "1793-04-19",
        "date_text": "19 April 1793",
        "label": "Context (suspicion)",
        "kind": "context",
        "passage_fr": "En applaudissant aux mesures que vous avez prises, nous ne devons !';:s négliger de vous dire que la plus exacte surveillance est nécessaire à l'égard de Kellermann, dont la conduite paraît équivoque.",
        "passage_en": "While applauding the measures you have taken, we must not neglect to tell you that the closest watch must be kept on Kellermann, whose conduct seems equivocal.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 3, view 349."
      },
      {
        "type": "act",
        "title": "Act II · Lyon and the Alps (August–October 1793)",
        "sub": "Lyon rises against the Convention; Kellermann besieges it, then leaves to drive back the Piedmontese. The representatives accuse him of collusion and negligence, and he is dismissed and arrested."
      },
      {
        "type": "card",
        "date": "1793-08-21",
        "date_text": "21 August 1793",
        "label": "Reported accusation",
        "kind": "charge",
        "passage_fr": "[rr Rovère, Poullier, Gasparin, Saliceti et Escudier donnent avis que des relations entre Lyon et Marseille, qui ont été interceptées, paraissent renouer entre les Lyonnais et Kellermann et son état-major une intelligence bien coupable; que Marseille continue à emprisonner et égorger les bons patriotes; que Toulon reçoit des parlementaires ennemis sous prétexte de traiter de l'échange des prisonniers et qu'on y a brûlé l'acte constitutionnel par la main du bourreau; […] – Arch. nat., AFn, 18b. Analyse. ]",
        "passage_en": "[Rovère, Poullier, Gasparin, Saliceti and Escudier report that intercepted correspondence between Lyon and Marseille seems to show the people of Lyon renewing a most culpable understanding with Kellermann and his staff; that Marseille goes on imprisoning and murdering good patriots; that Toulon is receiving enemy envoys on the pretext of discussing a prisoner exchange, and that the constitution was burned there by the executioner; […] — National Archives, AF II 18b. Summary.]",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 6, view 74.",
        "charge_fr": "intelligence bien coupable entre les Lyonnais révoltés et Kellermann et son état-major, révélée par des correspondances interceptées entre Lyon et Marseille",
        "charge_en": "A most culpable understanding between the rebels of Lyon and Kellermann and his staff, revealed by intercepted letters between Lyon and Marseille",
        "p_execution": 0.563
      },
      {
        "type": "card",
        "date": "1793-09-08",
        "date_text": "8 September 1793",
        "label": "Criticism",
        "kind": "charge",
        "passage_fr": "Nous sommes inquiets sur la partie gauche, puisque Kellermann a dégarni le poste important d'Entrevaux, qui conservait notre retraite et nous empêchait d'être cernés.",
        "passage_en": "We are anxious about the left flank, since Kellermann stripped the important post of Entrevaux, which secured our line of retreat and kept us from being surrounded.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 6, view 390.",
        "charge_fr": "avoir dégarni le poste important d'Entrevaux, exposant l'armée à être cernée",
        "charge_en": "Stripping the important post of Entrevaux, exposing the army to encirclement",
        "p_execution": 0.35
      },
      {
        "type": "card",
        "date": "1793-09-08",
        "date_text": "8 September 1793",
        "label": "Criticism",
        "kind": "charge",
        "passage_fr": "Kellermann a ouvert le passage aux Piémontais, tandis qu'il crie qu'il perd un temps précieux sous les murs de Lyon, comme si les Lyonnais n'étaient pas Piémontais, Autri- chiens, etc.",
        "passage_en": "Kellermann opened the way to the Piedmontese, while he cries out that he is wasting precious time under the walls of Lyon, as if the people of Lyon were not Piedmontese, Austrians, and so on.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 6, view 390.",
        "charge_fr": "ouverture du passage aux Piémontais tout en prétextant une perte de temps sous les murs de Lyon",
        "charge_en": "Opening the way to the Piedmontese while complaining of time lost under the walls of Lyon",
        "p_execution": 0.409
      },
      {
        "type": "card",
        "date": "1793-09-18",
        "date_text": "18 September 1793",
        "label": "Context (rumour)",
        "kind": "context",
        "passage_fr": "On leur dit que Kellermann a été destitué : ils n'en ont pas reçu la nouvelle officielle, pas plus que le décret qui leur adjoint Châteauneuf-Randon.",
        "passage_en": "They are told that Kellermann has been dismissed; they have not received official word of it, any more than the decree adding Châteauneuf-Randon to their number.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 6, view 580."
      },
      {
        "type": "card",
        "date": "1793-10-02",
        "date_text": "2 October 1793",
        "label": "Context (dismissal)",
        "kind": "context",
        "passage_fr": "[Dubois-Crancé et Gauthier ont reçu l'arrêté du Conseil exécutif destituant Kellermann, rrqui n'a pas la confiance nécessaire pour remplir utilement ses fonctions,,; mais, comme le ministre lui demande en même temps l'état de ses services pour lui obtenir une récompense, ils voient là une contradiction; car, d'après le décret de la Convention, il doit être mis en prison comme suspect.",
        "passage_en": "[Dubois-Crancé and Gauthier have received the Executive Council's order dismissing Kellermann, “who does not have the confidence needed to carry out his duties usefully”; but since the minister is at the same time asking him for his service record to obtain a reward for him, they see a contradiction: for, under the Convention's decree, he is to be put in prison as a suspect.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 7, view 214."
      },
      {
        "type": "card",
        "date": "1793-10-12",
        "date_text": "12 October 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "La Convention nationale a destitué Kellermann depuis quelque temps; le décret lui a été notifié, et il a continué de commander.",
        "passage_en": "The National Convention dismissed Kellermann some time ago; the decree was served on him, and he went on commanding.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 7, view 416.",
        "charge_fr": "poursuite de l'exercice du commandement après notification de son décret de destitution par la Convention nationale",
        "charge_en": "Continuing to command after the Convention's decree dismissing him had been served on him",
        "p_execution": 0.771
      },
      {
        "type": "card",
        "date": "1793-10-12",
        "date_text": "12 October 1793",
        "label": "Context (public opinion)",
        "kind": "context",
        "passage_fr": "La voix publique accuse Kellermann depuis plusieurs années ; la Convention pense comme le peuple.",
        "passage_en": "Public opinion has been accusing Kellermann for years; the Convention thinks as the people do.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 7, view 416."
      },
      {
        "type": "card",
        "date": "1793-10-15",
        "date_text": "15 October 1793",
        "label": "Arrest order",
        "kind": "charge",
        "passage_fr": "Le Comité de salut public, considérant que depuis longtemps le général Kellermann est prévenu d'avoir trahi la République, que sa [FOOTNOTE] Celle pièce manque. destitution, prononcée par la Convention nationale, a été fondée sur les motifs les plus graves, et n'a pu être contrariée par aucune autorité sans un grand danger pour la République, arrête que Kellermann sera mis sur-le-champ en état d'arrestation et amené à Paris ROBESPIERRE, HÉRAULT, BILLAUD-VARENNE, B. BARÈRE M.",
        "passage_en": "The Committee of Public Safety, considering that General Kellermann has long been suspected of having betrayed the Republic, and that his dismissal, pronounced by the National Convention, was founded on the gravest motives and could not be opposed by any authority without great danger to the Republic, orders that Kellermann be arrested at once and brought to Paris. Robespierre, Hérault, Billaud-Varenne, B. Barère.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 7, view 392.",
        "charge_fr": "trahison envers la République dont il est prévenu depuis longtemps, fondée sur les motifs les plus graves, ayant motivé sa destitution par la Convention et son arrestation par le Comité de salut public",
        "charge_en": "Treason against the Republic, long suspected, on the gravest grounds, which led to his dismissal by the Convention and his arrest by the Committee of Public Safety",
        "p_execution": 0.735
      },
      {
        "type": "act",
        "title": "Act III · Prison (October 1793 – July 1794)",
        "sub": "Brought to Paris and locked in the Abbaye. His name keeps coming up: at the Girondins' trial, in demands for a quick trial, and in a list of traitors."
      },
      {
        "type": "card",
        "date": "1793-10-27",
        "date_text": "27 October 1793",
        "label": "Context (the Girondins' trial)",
        "kind": "context",
        "passage_fr": "Savez-vous , citoyen témoin, fi Relier- : «nan, lorfqu'i! eft venu a Paris, était porteur de dé- ' pèches pour Genfonné, de l.r part de Dumourtcr t  …  Genfonné. Je déclare n'en avoir reçu que deux des mains de Kellerman.",
        "passage_en": "Do you know, citizen witness, whether Kellermann, when he came to Paris, was carrying dispatches for Gensonné from Dumouriez? … Gensonné: I declare that I received only two from Kellermann's hands.",
        "source": "Le Moniteur universel, issue of 27 October 1793."
      },
      {
        "type": "card",
        "date": "1793-11-03",
        "date_text": "3 November 1793",
        "label": "Context (prison)",
        "kind": "context",
        "passage_fr": "Le ci-drvant\" généra! Kellermann vient d être con- d: ii dans les priions de l'A'bb iyc.",
        "passage_en": "The former general Kellermann has just been taken to the Abbaye prison.",
        "source": "Le Moniteur universel, issue of 3 November 1793."
      },
      {
        "type": "card",
        "date": "1793-12-07",
        "date_text": "7 December 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "L'esprit a changé, et, par là, il a vengé l'honneur national outrag4 dans le siège de Lyon, qui n'aurait jamais dû commencer et où certainement douze bataillons composés de 7,000 hommes pouvaient bien entrer de vive force. Partout le peuple de ces départements calomniés ne demande pas justice de ses calomniateurs, qui veulent affaiblir ces nations courageuses. Son opinion, faite à cet égard, le venge assez, mais il demande que le général Kellermànn soit promptement jugé de ce délit national, que personne, sans se déclarer complice, ne peut vouloir défendre.",
        "passage_en": "Spirits have changed, and in this way they have avenged the national honour outraged in the siege of Lyon, which should never have begun, and where twelve battalions of 7,000 men could certainly have forced their way in. Everywhere the people of these slandered departments do not ask for justice against their slanderers, who want to weaken these brave peoples. Their opinion on the matter avenges them enough, but they demand that General Kellermann be tried promptly for this national crime, which no one can wish to defend without declaring himself an accomplice.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 9, view 264.",
        "charge_fr": "conduite du siège de Lyon, outrage à l'honneur national, la ville pouvant être prise de vive force par douze bataillons",
        "charge_en": "His conduct of the siege of Lyon, an outrage to national honour, when twelve battalions could have taken the city by force",
        "p_execution": 0.506
      },
      {
        "type": "card",
        "date": "1794-03-28",
        "date_text": "28 March 1794",
        "label": "Criticism",
        "kind": "charge",
        "passage_fr": "rrJ ai reconnu à chaque pas, dans ces lieux, les funestes vestiges des perfidies des Girondins et de la trahison qui a livré dans la dernière campagne cette partie des frontières aux lâches Piémontais ; j'ai vu dans les habitants des hommes faits pour être libres, mais encore cicatrisés du joug de l'esclavage, des hommes naturellement bons, mais que des préjugés antiques dominent encore, des hommes qui, sans l'extrême voisinage de l'ennemi et sans les trahisons des Kellermanu, des Doyen, des Dubourg et des Saint-Rémi, qui les ont perfidement livrés au tyran sarde, seraient aujourd'hui à la hauteur de la Révolution.",
        "passage_en": "At every step in these places I recognised the fatal traces of the Girondins' perfidies and of the treason that handed this part of the frontier to the cowardly Piedmontese in the last campaign; I saw in the inhabitants men made to be free, but still scarred by the yoke of slavery, naturally good men still ruled by ancient prejudice, men who, but for the nearness of the enemy and the treasons of Kellermann, Doyen, Dubourg and Saint-Rémi, who treacherously delivered them to the Sardinian tyrant, would today be at the height of the Revolution.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 12, view 270.",
        "charge_fr": "trahison et livraison perfide d'habitants et de territoires au tyran sarde",
        "charge_en": "Treason, and treacherously delivering inhabitants and territory to the Sardinian tyrant",
        "p_execution": 0.901
      },
      {
        "type": "act",
        "title": "Act IV · After Thermidor (November 1794)",
        "sub": "Robespierre falls in July 1794. Kellermann's case finally comes up, in a very different climate."
      },
      {
        "type": "card",
        "date": "1794-11-12",
        "date_text": "12 November 1794",
        "label": "Context (his case)",
        "kind": "context",
        "passage_fr": "34. Le Comité de salut public autorise le général Kellermann à rester à Paris jusqu'à la fin de son affaire.",
        "passage_en": "34. The Committee of Public Safety authorises General Kellermann to remain in Paris until his case is concluded.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 18, view 131."
      }
    ]
  },
  "danton": {
    "slug": "danton",
    "name": "Georges Danton",
    "role": "Lawyer and deputy of the Convention",
    "portrait": "assets/danton.jpg",
    "bio": "Born in Arcis-sur-Aube in 1759, Danton trained as a lawyer and became one of the Revolution's great orators. He helped bring down the monarchy in August 1792, served as Minister of Justice, and sat on the first Committee of Public Safety. By 1794 he was calling for an end to the Terror, which his enemies took as weakness. He was arrested on 30 March 1794, tried with Camille Desmoulins and others, and guillotined on 5 April.",
    "fun_fact": "Before his execution he is said to have told the executioner to show his head to the people, because it was worth seeing.",
    "bio_source": {
      "label": "Wikipedia: Georges Danton",
      "url": "https://en.wikipedia.org/wiki/Georges_Danton"
    },
    "outcome": "Executed 5 April 1794",
    "timeline": [
      {
        "type": "act",
        "title": "Act I · Dumouriez's friend (spring 1793)",
        "sub": "Danton returns from his mission in Belgium as Dumouriez, the general he worked with, goes over to the Austrians. The Girondins turn Dumouriez's treason against him."
      },
      {
        "type": "card",
        "date": "1793-03-28",
        "date_text": "Late March 1793",
        "seal_day": "…",
        "label": "Context (the other side)",
        "kind": "context",
        "passage_fr": "Je ne dirai qu'un mot, Je vous dirai que Roland écrivait à Dumontier, ( et c'eft ce gêner.il qui nous a montré la lettre , à Lacroix et à moi ) si II faut vous liguer avec nous pour écrafcr ce parti de Paris , et furtowt ce Danton.",
        "passage_en": "I will say only one word: Roland wrote to Dumouriez (and it was the general himself who showed the letter to Lacroix and me): “You must league with us to crush this Paris party, and above all this Danton.”",
        "source": "Le Moniteur universel, issue of 28 March 1793."
      },
      {
        "type": "card",
        "date": "1793-04-01",
        "date_text": "1 April 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "j'obferve à l'AHemblée que Danton a dit au Comité que Dumourier avait perdu la tête eu politique , mais qu'il conferv.it tous fes talens militaires : alors Robefpienc demanda que la conduite de Dumourier lût examinée -, Danton s'y oppofa , et dit qu'il ne fallait prendre aucune mefure contre lui avant que la retraite de la Belgique fût eutiere- ment eflectuée.",
        "passage_en": "I point out to the Assembly that Danton told the Committee that Dumouriez had lost his head in politics but kept all his military talents; Robespierre then asked that Dumouriez's conduct be examined; Danton opposed it, and said no measure should be taken against him until the retreat from Belgium was complete.",
        "source": "Le Moniteur universel, issue of 3 April 1793.",
        "charge_fr": "opposition à ce que la conduite de Dumouriez soit examinée sur la demande de Robespierre",
        "charge_en": "Opposing Robespierre's demand that Dumouriez's conduct be examined",
        "p_execution": 0.553
      },
      {
        "type": "card",
        "date": "1793-04-01",
        "date_text": "1 April 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "11 11'y avait pas de marche plus sure pour amener Darnourier à fes fins , que de ravaler la Convention , et de taire valoir Dumourier ; c'e/1 ce qu'a fait Danton.",
        "passage_en": "There was no surer way to bring Dumouriez to his ends than to belittle the Convention and build up Dumouriez; that is what Danton did.",
        "source": "Le Moniteur universel, issue of 3 April 1793.",
        "charge_fr": "exécution du plan de Dumouriez par le ravalement de la Convention et la valorisation de Dumouriez",
        "charge_en": "Carrying out Dumouriez's plan by belittling the Convention and building up Dumouriez",
        "p_execution": 0.705
      },
      {
        "type": "card",
        "date": "1793-04-01",
        "date_text": "1 April 1793",
        "label": "Reported accusation",
        "kind": "charge",
        "passage_fr": "Je fomme Carnbon, fans pcrfonnalités , fans s'ccatter de la propofuion qui vient d'ètie décrétée , de s'expliquer fur un fait d'argent , fur ioo mille écus qu'on annonce avoir cte remis à Danton et A Lacroix , et de dire la conduite que la Commifiion a tenue relativement A la réunion.. . .",
        "passage_en": "I call on Cambon, without personal attacks and without straying from the proposal just decreed, to explain a money matter: the hundred thousand écus said to have been handed to Danton and Lacroix, and to say how the Commission conducted itself regarding the annexation…",
        "source": "Le Moniteur universel, issue of 3 April 1793.",
        "charge_fr": "remise alléguée de 100 000 écus à Danton et Lacroix",
        "charge_en": "The alleged payment of 100,000 écus to Danton and Lacroix",
        "p_execution": 0.454
      },
      {
        "type": "card",
        "date": "1793-04-01",
        "date_text": "1 April 1793",
        "label": "Context (his reply)",
        "kind": "context",
        "passage_fr": "J'ai prouvé qu'il était lâche et ab- furde de dire que moi, Danton,j'ai reçu cent mille écu pour travailler la Belgique.",
        "passage_en": "I have proved that it was cowardly and absurd to say that I, Danton, received a hundred thousand écus to work on Belgium.",
        "source": "Le Moniteur universel, issue of 3 April 1793."
      },
      {
        "type": "act",
        "title": "Act II · Under suspicion (summer – winter 1793)",
        "sub": "Rumours follow him: café talk, a story that he has fled abroad, and talk of a Dantonist faction. In December, Robespierre defends him at the Jacobins."
      },
      {
        "type": "card",
        "date": "1793-09-25",
        "date_text": "25 September 1793",
        "label": "Context (editor's note)",
        "kind": "context",
        "passage_fr": "Bien que Danton n'eût pas pris part à cette discussion, il parut aux contemporains que, ce jour-là, les Dantonistes, parmi lesquels ils rangeaient Thuriot, avaient voulu renverser Robespierre et le Comité de salut public.",
        "passage_en": "Although Danton had taken no part in the debate, it seemed to contemporaries that on that day the Dantonists, among whom they counted Thuriot, had tried to overthrow Robespierre and the Committee of Public Safety.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 7, view 71."
      },
      {
        "type": "card",
        "date": "1793-12-03",
        "date_text": "3 December 1793",
        "label": "Context (the rumours)",
        "kind": "context",
        "passage_fr": "Danton ! tu es accule d'avoir émigre ; Ou a dit que tu avais J'affc en Sv.iife, que ta m ,1ad e éiail feinte pour cacher aa peuple ta luiie ; on a dit que ton ambition était d'ctic regent fous Louis XVIIi qu'a une époque detei minée tout a été préparé poui le proclamer ; que tu t lui» le chef de lt conluua- tiou ; que ni Pitt , ni Cobohig, ni l'Angbetcric, ui l'Aotiiche , ni la P.ulle, u'ctairnt pas uos véiit blés ennemis, mais que c'ciait oi feul ; que la Montagne était tompolée de tes complice» […]",
        "passage_en": "Danton! You are accused of having emigrated; it has been said that you passed into Switzerland, that your illness was feigned to hide your flight from the people; it has been said that your ambition was to be regent under Louis XVII, that at a set time everything was ready to proclaim him; that you were the head of the conspiracy; that neither Pitt, nor Coburg, nor England, nor Austria, nor Prussia were our true enemies, but you alone; that the Mountain was made up of your accomplices […]",
        "source": "Le Moniteur universel, issue of 6 December 1793."
      },
      {
        "type": "card",
        "date": "1793-12-03",
        "date_text": "3 December 1793",
        "label": "Context (Robespierre defends him)",
        "kind": "context",
        "passage_fr": "Il cft évident que Danton a été calomnié : mais je déclare que je vois là un des fil» les plus im- pOitatis de la trame ourdie contic ion? i. » patriotes. […] P-ifonne ne fe piéftnte pour parler cotiti e D n ton ; il faut eu conelme que pcrlooué n'a ne» à alléguer cbutic' lui.",
        "passage_en": "It is clear that Danton has been slandered; but I declare that I see in this one of the most important threads of the plot woven against all patriots. […] No one comes forward to speak against Danton; we must conclude that no one has anything to allege against him.",
        "source": "Le Moniteur universel, issue of 6 December 1793."
      },
      {
        "type": "act",
        "title": "Act III · Arrest (31 March 1794)",
        "sub": "Arrested in the night of 30–31 March. Legendre defends him; Robespierre answers; Saint-Just reads the report that sends him to the Tribunal."
      },
      {
        "type": "card",
        "date": "1794-03-31",
        "date_text": "31 March 1794",
        "label": "Context (arrest)",
        "kind": "context",
        "passage_fr": "je le répété , je crois Danton aufli pur que moi : il efl dans les fers depuis -cette Huit -, on a craint fans doute que fcs région tes ne détruififfent les aeeufations dirigées contre ui.",
        "passage_en": "I repeat it: I believe Danton to be as pure as I am. He has been in irons since last night; no doubt they feared his answers would destroy the accusations against him.",
        "source": "Le Moniteur universel, issue of 1 April 1794."
      },
      {
        "type": "card",
        "date": "1794-03-31",
        "date_text": "31 March 1794",
        "label": "Context (Robespierre turns)",
        "kind": "context",
        "passage_fr": "Danton veut prendre leur place , et il u'eft plus à mes yeux qu'un ennemi de la Patrie.",
        "passage_en": "Danton wants to take their place, and in my eyes he is now nothing but an enemy of the fatherland.",
        "source": "Le Moniteur universel, issue of 1 April 1794."
      },
      {
        "type": "card",
        "date": "1794-03-31",
        "date_text": "31 March 1794",
        "label": "Accusation (Saint-Just)",
        "kind": "charge",
        "passage_fr": "Danton, tu eu», après le 10 août, une conférence avec Dumourier où vous vous jurâtes une amitié à toute epreuve, et où vous unîtes voir» fortune.",
        "passage_en": "Danton, after 10 August you had a meeting with Dumouriez where you swore each other unshakeable friendship and joined your fortunes.",
        "source": "Le Moniteur universel, issue of 1 April 1794.",
        "charge_fr": "alliance et amitié jurée avec le traître Dumouriez après le 10 août",
        "charge_en": "A sworn alliance and friendship with the traitor Dumouriez after 10 August",
        "p_execution": 0.927
      },
      {
        "type": "card",
        "date": "1794-03-31",
        "date_text": "31 March 1794",
        "label": "Accusation (Saint-Just)",
        "kind": "charge",
        "passage_fr": "Danton , tu fus donc le complice, de Mirabeau , de d'Orléans, de Dumourier , de Brillot.",
        "passage_en": "Danton, you were therefore the accomplice of Mirabeau, of d'Orléans, of Dumouriez, of Brissot.",
        "source": "Le Moniteur universel, issue of 1 April 1794.",
        "charge_fr": "complicité avec Mirabeau, d'Orléans, Dumouriez et Brissot",
        "charge_en": "Complicity with Mirabeau, d'Orléans, Dumouriez and Brissot",
        "p_execution": 0.851
      },
      {
        "type": "card",
        "date": "1794-03-31",
        "date_text": "31 March 1794",
        "label": "Accusation (Saint-Just)",
        "kind": "charge",
        "passage_fr": "Dans ce tems même , Danton dîna fouvent rue Grange - Batelière avec des Anglais ; il dînait avec Gufm .ni , cfpàgnol , trois fois par ièmaine, et avec 1\" infâme St-Amarante, le fils deSartine, et Lacroix.",
        "passage_en": "At that very time, Danton often dined in the rue Grange-Batelière with Englishmen; he dined with Gusman, a Spaniard, three times a week, and with the infamous Sainte-Amaranthe, Sartine's son, and Lacroix.",
        "source": "Le Moniteur universel, issue of 1 April 1794.",
        "charge_fr": "dîners suspects et répétés avec des agents étrangers, des aristocrates et d'autres conspirateurs",
        "charge_en": "Repeated suspicious dinners with foreign agents, aristocrats and other conspirators",
        "p_execution": 0.667
      },
      {
        "type": "card",
        "date": "1794-03-31",
        "date_text": "31 March 1794",
        "label": "Reported accusation (Saint-Just)",
        "kind": "charge",
        "passage_fr": "L'été dernier, Hérault dit que Luliier, procureur- général du département de Paris, avait confié qu'il ex i fiait un parti en faveur du jeune Capet, et que fi le gouvernement pouvait perdte faveur et le parti arriver au degré d'influence ticcelfaire , ce ferait Danton qui montrerait au Peuple cet enfant.",
        "passage_en": "Last summer Hérault said that Lullier, procurator-general of the Paris department, had confided that there was a party in favour of the young Capet, and that if the government lost favour and the party gained enough influence, it would be Danton who showed the child to the people.",
        "source": "Le Moniteur universel, issue of 1 April 1794.",
        "charge_fr": "propos d'Hérault rapportant un complot royaliste visant à présenter le jeune Capet au peuple sous la conduite de Danton",
        "charge_en": "Hérault's report of a royalist plot in which Danton would present the young Capet to the people",
        "p_execution": 0.648
      },
      {
        "type": "card",
        "date": "1794-03-31",
        "date_text": "31 March 1794",
        "label": "Decree of accusation (the formal charge)",
        "kind": "charge",
        "passage_fr": "– Ajoutons que, le 11 germinal, la Convention rendit le décret suivant: « La Convention nationale, après avoir entendu le rapport de ses Comités de sûreté générale et de salut public, décrète d'accusation CamiHc Desmoulins, Hérault, Danton, Philippeaux, Delacroix, prévenus de com- plicité avec d'Orléans et Dnmouriez, avec Fabre d'Églantine et les ennemis de la République, d'avoir trempé dans la conjuration tendant à rétablir la monarchie, à détruire la représentation nationale et le gouvernement républirain.",
        "passage_en": "Let us add that on 11 Germinal the Convention passed the following decree: “The National Convention, having heard the report of its Committees of General Security and Public Safety, decrees the accusation of Camille Desmoulins, Hérault, Danton, Philippeaux and Delacroix, charged with complicity with d'Orléans and Dumouriez, with Fabre d'Églantine and the enemies of the Republic, and with having taken part in the conspiracy to restore the monarchy and destroy the national representation and the republican government.”",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 12, view 298.",
        "charge_fr": "complicité avec d'Orléans, Dumouriez, Fabre-d'Eglantine et les ennemis de la République / participation à la conspiration tendante à rétablir la monarchie, détruire la représentation nationale et le gouvernement républicain",
        "charge_en": "Complicity with d'Orléans, Dumouriez, Fabre d'Églantine and the enemies of the Republic; taking part in the conspiracy to restore the monarchy and destroy the national representation and the republican government",
        "p_execution": 0.954
      },
      {
        "type": "act",
        "title": "Act IV · Trial (2–5 April 1794)",
        "sub": "Tried with Desmoulins, Lacroix, Hérault, Philippeaux and the India Company defendants. His voice fills the courtroom, so the Convention changes the rules."
      },
      {
        "type": "card",
        "date": "1794-04-02",
        "date_text": "2 April 1794",
        "label": "Context (his answer)",
        "kind": "context",
        "passage_fr": "Danton , interrogé fur fon ngiu et fa demeure , a répondu : Ma demeure fera bientôt dans le niant , quant à mon nom , vous le trouverez, dans le panthéon de Vhiftoiie.",
        "passage_en": "Danton, asked his name and address, answered: “My address will soon be nothingness; as for my name, you will find it in the pantheon of history.”",
        "source": "Le Moniteur universel, issue of 4 April 1794."
      },
      {
        "type": "card",
        "date": "1794-04-04",
        "date_text": "4 April 1794",
        "label": "Context (decree)",
        "kind": "context",
        "passage_fr": "La Convention nationale , après avoir entendu le rapport de les Comités de falnt public * de fureté générale , décrété que le tribunal révolutioimaiie continuera l inftructiun relative à la conjuration de Lacroix, Danton , Chabot et autres; […] Décrété que tout prévenu de confpiraiion , qui ré liftera ou infultera à la juitice nationale , fera mis hors des débats fur le champ.",
        "passage_en": "The National Convention, having heard the report of its Committees of Public Safety and General Security, decrees that the Revolutionary Tribunal shall continue the case of the conspiracy of Lacroix, Danton, Chabot and others; […] decrees that any accused of conspiracy who resists or insults national justice shall at once be put out of the proceedings.",
        "source": "Le Moniteur universel, issue of 5 April 1794."
      },
      {
        "type": "card",
        "date": "1794-04-05",
        "date_text": "5 April 1794",
        "label": "Context (the news)",
        "kind": "context",
        "passage_fr": "J'apprends dans l'instant que Philippeaux, Danton, Delacroix, Hérault de Séchelles et Camille Desmoulins sont décrétés d'accusation et renvoyés au Tribunal révolutionnaire.",
        "passage_en": "I have just learned that Philippeaux, Danton, Delacroix, Hérault de Séchelles and Camille Desmoulins have been decreed under accusation and sent to the Revolutionary Tribunal.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 12, view 427."
      },
      {
        "type": "card",
        "date": "1794-04-05",
        "date_text": "5 April 1794",
        "label": "Context (from Nice: Robespierre's brother)",
        "kind": "context",
        "passage_fr": "[tf Robespierre jeune donne des détails sur la situation de l'armée d'Italie et sur les menées des ennemis de la Révolution, qui cherchent à y trouver des complices. Selon lui, la mort d'Hébert et de ses adhérents n'a point conjuré tout danger de la part d'une faction dont ils n'étaient pas les vrais chefs. Danton et Delacroix, qu'il ne désigne que par les initiales de leurs noms, sont à ses yeux les premiers conjurés. L'année révolutionnaire peut devenir, si l'on n' y prend garde, une armée contre-révolutionnaire, dirigée par les conspirateurs.",
        "passage_en": "[Robespierre the younger gives details on the state of the Army of Italy and on the schemes of the Revolution's enemies, who are looking for accomplices there. In his view, the death of Hébert and his followers has not removed all danger from a faction of which they were not the real leaders. Danton and Delacroix, whom he names only by their initials, are in his eyes the chief conspirators. The revolutionary army could become, if no one takes care, a counter-revolutionary army led by the conspirators.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 12, view 433."
      }
    ]
  },
  "robespierre": {
    "slug": "robespierre",
    "name": "Maximilien Robespierre",
    "role": "Deputy and member of the Committee of Public Safety",
    "portrait": "assets/robespierre.jpg",
    "bio": "Born in Arras in 1758, Robespierre was a lawyer and a deputy from the start of the Revolution. Nicknamed “the Incorruptible”, he became the leading voice of the Committee of Public Safety during the Terror. On 9 Thermidor (27 July 1794) the Convention turned on him. He was arrested and guillotined the next day with his closest allies.",
    "fun_fact": "On 9 Thermidor, as he tried to speak in the Convention, a deputy is said to have shouted that Danton's blood was choking him.",
    "bio_source": {
      "label": "Wikipedia: Maximilien Robespierre",
      "url": "https://en.wikipedia.org/wiki/Maximilien_Robespierre"
    },
    "outcome": "Outlawed on 9 Thermidor and executed without trial, 28 July 1794",
    "timeline": [
      {
        "type": "act",
        "title": "Act I · At the height (June – July 1794)",
        "sub": "Elected president of the Convention, mourned over after an attempt on his life: weeks before his fall, Robespierre is at the peak of his power."
      },
      {
        "type": "card",
        "date": "1794-06-04",
        "date_text": "4 June 1794 (16 Prairial)",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Robefpterre obtient l'unanimité des fuffrages pour la préfijcnce.",
        "passage_en": "Robespierre is elected president of the Convention unanimously.",
        "source": "Le Moniteur universel, issue of 7 June 1794."
      },
      {
        "type": "card",
        "date": "1794-06-05",
        "date_text": "5 June 1794",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Les dangers que viennent de courir Collot-d'Herbois et Robespierre ont vivement affecté les bons citoyens de cette contrée; tous sont venus aujourd'hui m'en témoigner leur douleur et leur indignation : et Comment! vouloir assassiner nos meilleurs défenseurs!.",
        "passage_en": "The dangers Collot d'Herbois and Robespierre have just faced deeply affected the good citizens here: “What! Wanting to assassinate our best defenders!”",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 14, view 176."
      },
      {
        "type": "card",
        "date": "1794-07-19",
        "date_text": "19 July 1794",
        "label": "Context (reported claim)",
        "kind": "context",
        "passage_fr": "Robespierre ne sort qu'accompagné de 80 hommes armés.",
        "passage_en": "Robespierre only goes out accompanied by 80 armed men.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 15, view 318."
      },
      {
        "type": "card",
        "date": "1794-07-21",
        "date_text": "21 July 1794",
        "label": "Context (criticism)",
        "kind": "context",
        "passage_fr": "La Société des LCJbins m'a invité à venir me justifier à sa séance; je ne m'y suis point rendu, parce que Robespierre y règne en maître.",
        "passage_en": "The Jacobin Society invited me to come justify myself at its session; I did not go, because Robespierre rules there like a master.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 15, view 361."
      },
      {
        "type": "act",
        "title": "Act II · 8 Thermidor: the last speech",
        "sub": "26 July 1794. One sitting. After weeks away, Robespierre denounces unnamed conspirators; the deputies who fear they are on his list turn on him."
      },
      {
        "type": "card",
        "date": "1794-07-26",
        "date_text": "26 July 1794 (8 Thermidor)",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Robefpierrc , qui depuis long-tcms n'avait paru à l'Affcntbice , inouïe à la tribune et prend la parole.",
        "passage_en": "Robespierre, who had not appeared at the Assembly for a long time, ascends the rostrum and takes the floor.",
        "source": "Le Moniteur universel, issue of 29 July 1794."
      },
      {
        "type": "card",
        "date": "1794-07-26",
        "date_text": "26 July 1794",
        "label": "Charge (Cambon)",
        "kind": "charge",
        "passage_fr": "Il eft tems de dire la vérité toute entière : un feul henmac paialifait la volonté de la Convention nationale ; cet homme eft celui qui vient de faire le difeonrs , c'eft Robclpierrc : ainfi jugez.",
        "passage_en": "It is time to tell the whole truth: a single man was paralysing the will of the National Convention; that man is the one who has just given the speech, it is Robespierre: so judge.",
        "source": "Le Moniteur universel, issue of 29 July 1794.",
        "charge_fr": "paralysie de la volonté de la Convention nationale",
        "charge_en": "Paralysing the will of the National Convention",
        "p_execution": 0.81
      },
      {
        "type": "card",
        "date": "1794-07-26",
        "date_text": "26 July 1794",
        "label": "Context (his reply)",
        "kind": "context",
        "passage_fr": "Robefpierre. je demande la pcimiffion de répondre un feul mot à cette inculpation qui me paraît auffi inintelligible qu'extraordinaire.",
        "passage_en": "Robespierre: I ask permission to answer a single word to this charge, which seems to me as unintelligible as it is extraordinary.",
        "source": "Le Moniteur universel, issue of 29 July 1794."
      },
      {
        "type": "card",
        "date": "1794-07-26",
        "date_text": "26 July 1794",
        "label": "Charge (Fayau)",
        "kind": "charge",
        "passage_fr": "Faut'. Je reproche à Robefpierrc de faire chaffer des Jacobins qui bon lui fcmble.",
        "passage_en": "Fayau: I reproach Robespierre for having whichever Jacobins he pleases expelled.",
        "source": "Le Moniteur universel, issue of 29 July 1794.",
        "charge_fr": "exclusion arbitraire de membres de la Société des Jacobins",
        "charge_en": "Having members of the Jacobin Society expelled at will",
        "p_execution": 0.621
      },
      {
        "type": "card",
        "date": "1794-07-26",
        "date_text": "26 July 1794",
        "label": "Charge",
        "kind": "charge",
        "passage_fr": "De* puis , il in'eft revenu de toute* parts que le fait était, vrai , et que c'ciait Robefpierrc qui avait fait la lifte, je demande qu'il s'explique à cet égard , ainfi que lui le compte de Fouché.",
        "passage_en": "Since then, reports have reached me from all sides that it was true, and that it was Robespierre who drew up the list; I demand that he explain himself on this, and on Fouché's account.",
        "source": "Le Moniteur universel, issue of 29 July 1794.",
        "charge_fr": "établissement d'une liste de proscription de députés",
        "charge_en": "Drawing up a proscription list of deputies",
        "p_execution": 0.74
      },
      {
        "type": "act",
        "title": "Act III · 9 Thermidor: the fall",
        "sub": "27 July 1794. Saint-Just is shouted down, the Convention orders the arrests, and through the night the Hôtel de Ville becomes the centre of a failed insurrection."
      },
      {
        "type": "card",
        "date": "1794-07-27",
        "date_text": "27 July 1794 (9 Thermidor)",
        "label": "Context",
        "kind": "context",
        "passage_fr": "SÉ A N ci E hU g THERM1DO R. Saim-juft monte à h tribune; il entame un dif- coi.ts taux le meute feus que celui que Robefpierre veille ; il aiiiire qu'il n'.'ppxitient à la opinions, et l'on s'affurcra que taons n'avons jamais parlé que pour le foutien des droits du Peuple, u'eli *t après cela que nous demandons à être jugés.",
        "passage_en": "Session of 9 Thermidor. Saint-Just ascends the rostrum and begins a speech in the same vein as Robespierre's of the day before; he insists they spoke only to uphold the people's rights and asks to be judged on that.",
        "source": "Le Moniteur universel, issue of 29 July 1794."
      },
      {
        "type": "card",
        "date": "1794-07-27",
        "date_text": "27 July 1794",
        "label": "Charge",
        "kind": "charge",
        "passage_fr": "(^jiïad Robefpierre vous dit qu'il s'en éio>gnr du Comité, parce qu'il y était opp.imé , il a foin de ne pas vous faire tout connaître ; il ne vous uit pas que c'efl paice qu'ayant lait tizi.s le Comité fa volonté pendant fix mois, il y a trouvé de la re- Üftancc au moment ou, feul , il a voulu laite rendre le décret du 82 piairial ; […]",
        "passage_en": "When Robespierre tells you he withdrew from the Committee because he was oppressed there, he is careful not to tell you everything: having imposed his will on the Committee for six months, he met resistance when he alone wanted the 22 Prairial decree passed.",
        "source": "Le Moniteur universel, issue of 29 July 1794.",
        "charge_fr": "domination du Comité de salut public et imposition du décret du 22 prairial",
        "charge_en": "Dominating the Committee of Public Safety and forcing through the law of 22 Prairial",
        "p_execution": 0.881
      },
      {
        "type": "card",
        "date": "1794-07-27",
        "date_text": "27 July 1794",
        "label": "Context (decree)",
        "kind": "context",
        "passage_fr": "[Dans cette séance, la Convention décréta d'arrestation, entre autres citoyens, (rois membres du Comité de salut public : Maximilien Robespierre, Couthon et Saint-J ust, et un membre du Comité de sûreté générale : Le Bas.",
        "passage_en": "In this session the Convention decreed the arrest of three members of the Committee of Public Safety, Robespierre, Couthon and Saint-Just, and of Le Bas of the Committee of General Security.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 15, view 483."
      },
      {
        "type": "card",
        "date": "1794-07-27",
        "date_text": "Night of 9–10 Thermidor (27–28 July 1794)",
        "seal_day": "27–28",
        "label": "Charge",
        "kind": "charge",
        "passage_fr": "Robcfpierrc a dit tout A fin. u ; qu'avant deux heures il marcherait fur ii Convention ; c'cil A nous A le devancer.",
        "passage_en": "Robespierre said just now that within two hours he would march on the Convention; it is up to us to strike first.",
        "source": "Le Moniteur universel, issue of 30 July 1794.",
        "charge_fr": "projet de marcher en armes sur la Convention nationale",
        "charge_en": "Planning an armed march on the National Convention",
        "p_execution": 0.91
      },
      {
        "type": "card",
        "date": "1794-07-27",
        "date_text": "Night of 9–10 Thermidor (27–28 July 1794)",
        "seal_day": "27–28",
        "label": "Charge (evidence)",
        "kind": "charge",
        "passage_fr": "Voici suffi une lettre trouvée fur 'Co ithoîi , fi ^n i e Robcfpierrc et Saint-J uft ; elle e/l <o iç e en evi termes : ss VoutLou, tous les pair Otes.font proferits , le Peuple entier cil levé ; ce ferait le trahir que de ne pas te leudie à la mailwu commune où nous lotîmes.",
        "passage_en": "Here also is a letter found on Couthon, signed Robespierre and Saint-Just: “Couthon, all patriots are proscribed, the whole people has risen; it would be betraying it not to come to the Maison commune where we are.”",
        "source": "Le Moniteur universel, issue of 30 July 1794.",
        "charge_fr": "lettre appelant Couthon à rejoindre l'insurrection à la Maison commune contre la Convention",
        "charge_en": "A letter calling Couthon to join the insurrection at the Hôtel de Ville against the Convention",
        "p_execution": 0.936
      },
      {
        "type": "card",
        "date": "1794-07-27",
        "date_text": "Night of 9–10 Thermidor (27–28 July 1794)",
        "seal_day": "27–28",
        "label": "Context",
        "kind": "context",
        "passage_fr": "En entrant dans celle du fccrct»- ! riat, Robelpierrc l'aîné fe donne un coud de pii- telet dans la bouche, et en reçut un en méme-tem» d'un gendarme.",
        "passage_en": "On entering the secretariat room, Robespierre the elder shot himself in the mouth with a pistol, and at the same moment received a shot from a gendarme.",
        "source": "Le Moniteur universel, issue of 4 August 1794."
      },
      {
        "type": "act",
        "title": "Act IV · 10 Thermidor",
        "sub": "28 July 1794. Outlawed, identified and guillotined the same evening, without trial."
      },
      {
        "type": "card",
        "date": "1794-07-28",
        "date_text": "28 July 1794 (10 Thermidor)",
        "label": "Context (denunciation)",
        "kind": "context",
        "passage_fr": "Il faut que l'échafaud foit dre (lé furie champ ; qu'avec les têtes de lés complices tombe aujourd'hui la Ute de cet infâme Robe (\"pierre , qui nous annonçait aju il croyait à l'Etre fuprême , et qui ne «rroyait a^u'à la foicc du ciioie.",
        "passage_en": "The scaffold must be raised at once; with the heads of his accomplices, today must fall the head of this infamous Robespierre, who told us he believed in the Supreme Being and believed only in the force of [crime].",
        "source": "Le Moniteur universel, issue of 30 July 1794."
      },
      {
        "type": "card",
        "date": "1794-07-28",
        "date_text": "28 July 1794",
        "label": "Context",
        "kind": "context",
        "passage_fr": "13. Les Comités de salut public et de sûreté générale arrêtent que le nommé Girard, juré au Tribunal révolutionnaire, et commandant la force armée de la section des Piques (familier de Robespierre, et dont le caractère contre-révolutionnaire s'est manifesté lors de l'arrestation de ce traître), sera saisi et conduit dans la maison d'arrêt dite Picpus.",
        "passage_en": "The Committees order the arrest of Girard, a juror and section commander “intimate of Robespierre,” whose counter-revolutionary character showed at the arrest of “this traitor.”",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 15, view 496."
      },
      {
        "type": "card",
        "date": "1794-07-28",
        "date_text": "28 July 1794",
        "label": "Context (decree)",
        "kind": "context",
        "passage_fr": "1 à. Le Comité de salut public arrête que Robespierre, Couthon et Goubaud seront transportés sur-le-champ à la Conciergerie sous bonne et sûre garde.",
        "passage_en": "The Committee of Public Safety orders that Robespierre, Couthon and Goubaud be taken at once to the Conciergerie under strong guard.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 15, view 496."
      },
      {
        "type": "card",
        "date": "1794-07-28",
        "date_text": "28 July 1794",
        "label": "Context (the next day)",
        "kind": "context",
        "passage_fr": "Robespierre et tous ses complices ne sont plus; l'oppression a disparu; tous les cœurs s'ouvrent aux plus doux épanchements, et l'allégresse a pris la place de la consternation dans Paris.",
        "passage_en": "Robespierre and all his accomplices are no more; oppression has vanished, and joy has taken the place of dismay in Paris.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 15, view 503."
      },
      {
        "type": "act",
        "title": "Epilogue",
        "sub": "After 28 July 1794."
      },
      {
        "type": "card",
        "date": "1794-07-29",
        "date_text": "After 28 July 1794",
        "seal_day": "…",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Une intrigue des traîtres Robespierre frères avait abouti à faire retirer des Pyrénées orientales et occidentales les troupes à cheval qui y sont indispensables.",
        "passage_en": "An intrigue by the traitors, the Robespierre brothers, had led to the withdrawal of the cavalry indispensable in the Eastern and Western Pyrenees.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 15, view 504."
      }
    ]
  },
  "marie-antoinette": {
    "slug": "marie-antoinette",
    "name": "Marie-Antoinette",
    "role": "Queen of France",
    "portrait": "assets/marie-antoinette.jpg",
    "bio": "Born an Austrian archduchess in Vienna in 1755, she married the future Louis XVI at fourteen. The Revolution made her a symbol of royal extravagance and foreign influence. After the king's execution she was tried by the Revolutionary Tribunal on 14 to 16 October 1793 and guillotined on the 16th.",
    "fun_fact": "“Let them eat cake” is not documented as anything she said. A similar line appears in Rousseau's Confessions, written when she was a child.",
    "bio_source": {
      "label": "Wikipedia: Marie Antoinette",
      "url": "https://en.wikipedia.org/wiki/Marie_Antoinette"
    },
    "outcome": "Executed 16 October 1793",
    "timeline": [
      {
        "type": "act",
        "title": "Act I · “L'infâme Antoinette”",
        "sub": "Autumn 1792. The monarchy has fallen and the royal family is held in the Temple. In the Convention her name becomes an insult and a charge."
      },
      {
        "type": "card",
        "date": "1792-11-01",
        "date_text": "1 November 1792",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Le trouble de l'Affemblée ne me permet pas de me faire entendre ; eh bien ! s'il fiant pour fauver la République donner à Louis XVI et à l'infâme Antoinette le doux p 1 ai fi r de taire egorger ceux qui les ont mis dans la tour du Temple , j'abandonne ia parole.",
        "passage_en": "The turmoil of the Assembly does not allow me to be heard; well! if to save the Republic it is necessary to give Louis XVI and the infamous Antoinette the sweet pleasure of having those who put them in the Temple tower slaughtered, I yield the floor.",
        "source": "Le Moniteur universel, issue of 1 November 1792."
      },
      {
        "type": "card",
        "date": "1792-11-29",
        "date_text": "29 November 1792",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "L'AfTcmblée conftitt'.ante avait accordé à Capct 5û miilious de kh* civile, i. ns s'euibai rafler de 1 emploi qu'il eu leraia ; elle lui avait accordé le î tlo lufpeniit , dont il a fait publiqueuuuit un mauvais ui.ige ; elle lui avait accordé le choix de lés mini fit es , qui , appelés par Antoinette , notre ennemie morte Ile , loutcnaicnt la faibleffe de noue in- lottuûé monarque contre fes fermons et Ion peuple.",
        "passage_en": "The Constituent Assembly had granted Capet 50 millions in civil list... it had granted him the choice of his ministers, who, called by Antoinette, our deadly enemy, supported the weakness of our unfortunate monarch against his oaths and his people.",
        "source": "Le Moniteur universel, issue of 29 November 1792.",
        "charge_fr": "nomination de ministres qui soutenaient le roi contre ses serments et son peuple",
        "charge_en": "Appointing ministers who supported the king against his oaths and his people",
        "p_execution": 0.918
      },
      {
        "type": "card",
        "date": "1792-12-13",
        "date_text": "13 December 1792",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "La reine dit, le 4 ociobie , qu'elle était enchantée rie la iouince du I er , celle de l'orgie où les fcl iats, dai s 1 les écarts de i'ivrcffe , avaient exprimé avec énergie leur dévouaient pour le trône.",
        "passage_en": "The queen said on October 4 that she was delighted with the day of the 1st, that of the orgie where soldiers in drunken excess energetically expressed devotion to the throne.",
        "source": "Le Moniteur universel, issue of 13 December 1792.",
        "charge_fr": "approbation de l'orgie des gardes du corps du 1er octobre 1789 en faveur du trône",
        "charge_en": "Approving the royal guards' banquet of 1 October 1789 in support of the throne",
        "p_execution": 0.854
      },
      {
        "type": "card",
        "date": "1792-12-16",
        "date_text": "16 December 1792",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Antoinette a dit aux commiffaires qu'elle délirerait avoir le journal des Débats, et quelques vête- mens d'hiver.",
        "passage_en": "Antoinette told the commissioners that she would like to have the Journal des Débats and some winter clothes.",
        "source": "Le Moniteur universel, issue of 16 December 1792."
      },
      {
        "type": "act",
        "title": "Act II · “Vous jugerez aussi Antoinette”",
        "sub": "December 1792 – March 1793. While the king is tried and executed, deputies and clubs ask when her turn will come."
      },
      {
        "type": "card",
        "date": "1792-12-08",
        "date_text": "8 December 1792",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Ces moyens fout : 1°. De mettre à l'inftant même Marie-Antoinette j en état d'accufation ; 2°. De décréter , s'il faut que Louis Capct comparaître devant vous; de décréter, dis - je , que Louis Capct fera traduit dès demain , au plus tard , à la barre de celte Alfcmblée ; 3°. D'ordonner A vos deux Commiflions des 24 et des 12 , de vous préfenter une feric de que liions à lui faire , non pour l'interroger fur les crimes , car vous ne devez le confidércr que comme un ennemi avec lequel vous êtes en guerre, mais pour […]",
        "passage_en": "These means are: 1. To put Marie-Antoinette immediately under indictment; 2. To decree whether Louis Capet must appear before you...",
        "source": "Le Moniteur universel, issue of 8 December 1792."
      },
      {
        "type": "card",
        "date": "1793-01-07",
        "date_text": "7 January 1793",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Vous jugerez auffi Antoinette -, et t elle cfl coupable , vous la punirez.",
        "passage_en": "You will also judge Antoinette; and if she is guilty, you will punish her.",
        "source": "Le Moniteur universel, issue of 7 January 1793."
      },
      {
        "type": "card",
        "date": "1793-01-23",
        "date_text": "23 January 1793",
        "label": "Context",
        "kind": "context",
        "passage_fr": "en adrcff.mt la parole a fon fils, Marie-Antoinette lu; dit : Apprenez n.,r ks malheurs de voue pete à ne pas vous venger de fa mort..... °",
        "passage_en": "Addressing her son, Marie-Antoinette said to him: Learn through the misfortunes of your father not to avenge his death.",
        "source": "Le Moniteur universel, issue of 23 January 1793."
      },
      {
        "type": "card",
        "date": "1793-03-05",
        "date_text": "5 March 1793",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Les lois indignées des crimes d'Antoinette , font impatientes delà punir : la terre de la liberté devrait d*j.t voir loin d'elle la km lie des Bourbons , toujours dangereule , lu;tout lurlqu elle liiut la popularité.",
        "passage_en": "The laws, outraged by Antoinette's crimes, are impatient to punish her: the land of liberty should already see far from it the breed of Bourbons, always dangerous, especially when it courts popularity.",
        "source": "Le Moniteur universel, issue of 5 March 1793."
      },
      {
        "type": "card",
        "date": "1793-03-06",
        "date_text": "6 March 1793",
        "label": "Context",
        "kind": "context",
        "passage_fr": "11 La mort du coupable ne fnffit pas à la vengeance des lois , difent les amis de la République Françaife, compofant la fociété populaire de Caffis , diftrict de Marfeille ; Antoinette cft défignée comme complice , l'opinion l'accufe ; que fon procès fuit fait !",
        "passage_en": "The death of the culprit is not enough for the vengeance of the laws, say the friends of the French Republic composing the popular society of Cassis, district of Marseille; Antoinette is designated as an accomplice, public opinion accuses her; let her trial be held!",
        "source": "Le Moniteur universel, issue of 6 March 1793."
      },
      {
        "type": "act",
        "title": "Act III · Sent to the Tribunal",
        "sub": "August – September 1793. The Convention orders her trial, and the calls for her head grow louder."
      },
      {
        "type": "card",
        "date": "1793-08-02",
        "date_text": "2 August 1793",
        "label": "Context (decree)",
        "kind": "context",
        "passage_fr": "VIII. Elifabeht Capet ne pourra être dépoité# qu'après le jugement de Maiie-Antoiuettc.",
        "passage_en": "VIII. Élisabeth Capet cannot be deported until after the judgment of Marie-Antoinette.",
        "source": "Le Moniteur universel, issue of 2 August 1793."
      },
      {
        "type": "card",
        "date": "1793-08-09",
        "date_text": "9 August 1793",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Ce n'eft qu'en happant l'Autrichienne que vous forez fentir A François , i George , à Charles , et 4 Guillaume , les etimes de leurs miniftres et de leurs armées.",
        "passage_en": "It is only by striking the Austrian woman that you will make Francis, George, Charles, and William feel the crimes of their ministers and armies.",
        "source": "Le Moniteur universel, issue of 9 August 1793."
      },
      {
        "type": "card",
        "date": "1793-09-05",
        "date_text": "5 September 1793",
        "label": "Context",
        "kind": "context",
        "passage_fr": "Le champ de bataille nous refla couvert de leuis morts ; on eu compte 35o , parmi lesquels fc trouvent ptnfi-urs chef, et des p.êtres qui avaient plufienrs montres et Le portrait de Marie Antoinette attaché à .",
        "passage_en": "The battlefield remained covered with their dead; 350 are counted, among whom are several leaders and priests who had several watches and the portrait of Marie Antoinette attached to...",
        "source": "Le Moniteur universel, issue of 5 September 1793."
      },
      {
        "type": "card",
        "date": "1793-09-20",
        "date_text": "20 September 1793",
        "label": "Context",
        "kind": "context",
        "passage_fr": "A l'égard de Marie-Antoinette, i! n'eft; pas néccffaire que la Convention ren ie un décret qui autorife Ou ordonne fon jugement ; c'eft une fiinplc particulière , extraordinaire feulement par fes crime» ; mai» la profonde fcélérateffe ne doit pas lui fournir un privilège , c'eft aux tribunals ordinaires à la juger.",
        "passage_en": "With regard to Marie-Antoinette, it is not necessary for the Convention to issue a decree authorizing or ordering her trial; she is an ordinary private individual, extraordinary only through her crimes; but profound villainy must not afford her a privilege, it is up to the ordinary tribunals to judge her.",
        "source": "Le Moniteur universel, issue of 20 September 1793."
      },
      {
        "type": "act",
        "title": "Act IV · The trial",
        "sub": "14–16 October 1793. The prosecutor reads the indictment: a long exposé in which earlier accusations return, ending in three formal charges."
      },
      {
        "type": "card",
        "date": "1793-10-16",
        "date_text": "16 October 1793",
        "label": "Context (trial opens)",
        "kind": "context",
        "passage_fr": "Elle répond : Je m'appelle Marie-Antoinette de Lorraine i.'Au- u. the.",
        "passage_en": "She answers: My name is Marie-Antoinette of Lorraine-Austria.",
        "source": "Le Moniteur universel, issue of 16 October 1793."
      },
      {
        "type": "card",
        "date": "1793-10-16",
        "date_text": "16 October 1793",
        "label": "Reported accusation",
        "kind": "charge",
        "passage_fr": "[…] qu'à l'inflar des Meffalines-bruru-haut , Frédégoude et Médicis, que l'on qualifiait autrefois de reines de France , et dont les noms à jamais odieux ne s'effaceront pas des taftes de l'hiftoirc , Marie-Antoinette , veuve de Louis Capet , a été depuis fon fejour en France, le fléau cl la fang/ue des Français ; qu'avant même Vheurcufe révolution qui a rendu an Peuple Français lu fouveiait.eié , elle avait des tapports politiques avec l'homme qualifié de roi de Bohême et de Hongrie ; que ers rapports étaient Contraires aux intérêts de la Fiance; que, non contente, de concert avec les treres de Louis Capet , et l'infâme et exécrable Galonné , alors mimftie de» finances, d'avoir dilapidé, d'une manière tffroyjile, les finances de la Fiance, (fruit des lueurs du Peuple ) pour fati.-Lire a des pLifirs défordonnés , et payer les agens de fes intrigues ciiminelle» ; il tft notoire qu elle a fait palier , à rliffaitnies époques, à l'empereur, des millions qui I ni ont feivi et lui ferveut encore à foutenir la guerre contre la Republique , et que c'eft par ces d l pidatifcins exerffi.es qu'elle eft parvenue à épuder le tiélor national.",
        "passage_en": "…like Messalina, Brunhilda, Fredegund and Medici… Marie-Antoinette, widow of Louis Capet, has been since her arrival in France the scourge and the leech of the French… it is notorious that she sent the emperor millions that served, and still serve, to support the war against the Republic.",
        "source": "Le Moniteur universel, issue of 16 October 1793.",
        "charge_fr": "rapports politiques avec l'empereur contraires aux intérêts de la France, dilapidation des finances et envoi de millions à l'empereur pour soutenir la guerre contre la République",
        "charge_en": "Political dealings with the emperor against France's interests, squandering the finances, and sending millions to the emperor to fund the war against the Republic",
        "p_execution": 0.962
      },
      {
        "type": "card",
        "date": "1793-10-16",
        "date_text": "16 October 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "[…] d'abord ay.ru t , fous prviexte d'une réuuicn rucefiaire entre les ci-dcvant gardes du corps et les officiers et folduts du régiment de Flandre , ménagé un repas etiue ces deux corps, le I er octobre 1789, lequel tft dégénéré en une véritable orgie, ainfi qu'elle le defir-it, […]",
        "passage_en": "…first, under pretext of a reunion between the former bodyguards and the officers of the Flanders regiment, she arranged a meal between the two corps on 1 October 1789, which degenerated into a true orgy, as she wished…",
        "source": "Le Moniteur universel, issue of 16 October 1793.",
        "charge_fr": "organisation du repas des gardes du corps du 1er octobre 1789, dégénéré en orgie contre-révolutionnaire",
        "charge_en": "Arranging the royal guards' banquet of 1 October 1789, which turned into a counter-revolutionary orgy",
        "p_execution": 0.865
      },
      {
        "type": "card",
        "date": "1793-10-16",
        "date_text": "16 October 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "[…] qu'on a arrêté la fuiie de Louis C p>et , de h veuve Capet n de tonte la Li.i l e, lous des 110 i» fuypoles , an mois de juin 179* » tentée tant dr fois cl <avs fuccè» dilf etrle» épOf|, • s i que la veuve Capet convient dan» Ion rutcirogateu* ■•r*-— >/ que «'eft elle qui a tom ménagé et tout préparé , jour cHVcluer cette évafioe , et que c'eft elle ijut a rtivert tt Imité 1er 7 unes de l'appariement par où les lugiuh iont pattes […]",
        "passage_en": "…that the flight of Louis Capet, the widow Capet and the whole family, under false names, was decided in June 1791… the widow Capet admits in her interrogation that it was she who arranged and prepared everything for this escape, and that she opened the doors through which the fugitives passed.",
        "source": "Le Moniteur universel, issue of 16 October 1793.",
        "charge_fr": "organisation de la fuite de la famille royale à Varennes en juin 1791",
        "charge_en": "Organising the royal family's flight to Varennes in June 1791",
        "p_execution": 0.939
      },
      {
        "type": "card",
        "date": "1793-10-16",
        "date_text": "16 October 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "Çjie c'cft la veuve Capet qui a fait parvenir aux puifTmees étrangères les plans de ci mpnguc et tV-tt-ique qui étaient convenus dans le couleil ; de nvuicrc que par cette double trahi Ion , les tune- rois tta : ent toujours iWliuits à l'avance des tuou* Vt . >n en s que devaient faire les armées de la R p 0- ; […]",
        "passage_en": "That it was the widow Capet who passed to the foreign powers the campaign and attack plans agreed in the council, so that by this double treason the enemy was always informed in advance of the movements of the Republic's armies.",
        "source": "Le Moniteur universel, issue of 16 October 1793.",
        "charge_fr": "transmission des plans de campagne aux puissances étrangères",
        "charge_en": "Passing the army's campaign plans to foreign powers",
        "p_execution": 0.844
      },
      {
        "type": "card",
        "date": "1793-10-16",
        "date_text": "16 October 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "[…] elle lui a préfenté un piHolet , en difant : Voila le moment de vons montrer, et que , fur fon relus , elle l'a traite de lâche […]",
        "passage_en": "…on her return she handed him a pistol, saying: “Now is the moment to show yourself”, and, when he refused, she called him a coward.",
        "source": "Le Moniteur universel, issue of 16 October 1793.",
        "charge_fr": "remise d'un pistolet au roi le 10 août et ordre de tirer sur le peuple",
        "charge_en": "Handing the king a pistol on 10 August, and an order to fire on the people",
        "p_execution": 0.953
      },
      {
        "type": "card",
        "date": "1793-10-16",
        "date_text": "16 October 1793",
        "label": "Accusation",
        "kind": "charge",
        "passage_fr": "Qji enfin la veuve Capet, ioimoratc fons tous les rapports , et nouvelle Agrippine, cft fi perve;fe et fi familière avec tous les crimes , qu'oubliant fa qualité de met e, et 1.x démarcation preferite parles lois de la nature , elle n'a pas crdut de (e livier a vecLouis-Chailes Captt, foc fils , et de l'aveu de ce dernier, à des indécences dont l'idée et le nom féal font frémir d'hortcur.",
        "passage_en": "That finally the widow Capet, immoral in every respect, a new Agrippina, is so perverse and so familiar with every crime that, forgetting she is a mother… she did not shrink from giving herself up with Louis-Charles Capet, her son, and on his own admission, to indecencies whose very idea makes one shudder.",
        "source": "Le Moniteur universel, issue of 16 October 1793.",
        "charge_fr": "actes d'inceste avec son fils Louis-Charles Capet",
        "charge_en": "Incest with her son Louis-Charles Capet",
        "p_execution": 0.837
      },
      {
        "type": "card",
        "date": "1793-10-16",
        "date_text": "16 October 1793",
        "label": "The indictment's formal charges",
        "kind": "charge",
        "passage_fr": "D'après l'expofé ci-deffus , l'accn r ateur public 3 diifle la préfente accufation contte Marie - Antoinette , fe qualifiant, dans fon interrogatoire, de Lorraine d'Autriche, veuve de Louis Capet , pour avoir méchamment et à déficit! ; l°. Dr concert avec les freres de Louis Capet et l'infâme ex-minifbc Calonne , dilapidé , d'uue maniei c effioyable , les finances de la Fiance, et d'avoir fait prlfcr des fonnues îucakuLblcn à l'empereur , et d'avoir aiufi éputfe le irefor national. 2°. D'avoir , tant par elle que par fes agens comte-révolutionnaires , entretenu des intelligences et des corrcfpojidanccs avec les ennemis de la République , et d avoir informé ou fait informer ces mêmes ennemis des plans de campagne et d'attaque convenus et arrêtés dans le cOnfcii. 3°. D'avoir, pur fes intrigues et manœuvres , et celles de fes agens, tramé des confpiratious e: des complots tonne la fureté intérieure et extérieure de la France , et d'avoir a ctt effet allumé la guerre civile dans divers points de la République et armé les citoyens les uns contre les autres , et d'avoir , par ce moyen , fait couler le fang d'un nombre incalculable de citoyens ; ce qui efl contraire à I article IV de la fectiou l ere du titre I er de la féconde partie du code pénal , et à l'article II dé la 2 e fectiou du titre I er du même code.",
        "passage_en": "In view of the above, the public prosecutor has drawn up the present accusation against Marie-Antoinette, calling herself in her interrogation of Lorraine-Austria, widow of Louis Capet, for having wickedly and deliberately: 1. in concert with Louis Capet's brothers and the infamous ex-minister Calonne, squandered the finances of France in a frightful manner, sent incalculable sums to the emperor, and so exhausted the national treasury; 2. both herself and through her counter-revolutionary agents, kept up intelligence and correspondence with the enemies of the Republic, and informed or had informed those enemies of the plans of campaign and attack agreed and settled in the council; 3. by her intrigues and manoeuvres and those of her agents, plotted conspiracies against the internal and external security of France, and to that end kindled civil war in various parts of the Republic and armed citizens against one another, thereby shedding the blood of a countless number of citizens; which is contrary to article IV of section 1, title I, part 2 of the penal code, and to article II of section 2, title I, of the same code.",
        "source": "Le Moniteur universel, issue of 16 October 1793.",
        "charge_fr": "dilapidation des finances de la France et envoi de sommes incalculables à l'empereur, intelligences avec les ennemis de la République et communication des plans de campagne, complots contre la sûreté intérieure et extérieure de la France et guerre civile",
        "charge_en": "Squandering France's finances and sending incalculable sums to the emperor; dealings with the Republic's enemies and passing them the campaign plans; plots against France's internal and external security, and civil war",
        "p_execution": 0.97
      },
      {
        "type": "act",
        "title": "Epilogue · Her image after death",
        "sub": "July 1794, from the Recueil: nine months after her execution, mourning her still counts against the living."
      },
      {
        "type": "card",
        "date": "1794-07-08",
        "date_text": "8 July 1794",
        "label": "Context (Recueil)",
        "kind": "context",
        "passage_fr": "Mais ce qui m'a été encore assuré, c'est que Washington a dans sa chambre les portraits de Capet et d'Antoinette, qu'il a porté leur deuil. Vanstabel, qui est près de vous, aura été à même de vous donner bien d'autres renseignements, et vous aurez été indignés comme moi quand vous aurez appris que la femme du consul Laforêt portait aussi le deuil de la furie Antoinette.",
        "passage_en": "But what I have also been assured is that Washington has the portraits of Capet and Antoinette in his room, and that he wore mourning for them. Vanstabel, who is with you, will have been able to give you much more information, and you will have been as outraged as I was to learn that the wife of Consul Laforêt was also wearing mourning for the fury Antoinette.",
        "source": "Aulard, Recueil des actes du Comité de salut public, tome 15, view 32."
      }
    ]
  }
};
