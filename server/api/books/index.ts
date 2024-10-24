export default defineEventHandler(async (event) => {
  // handle GET requests for the `api/books` endpoint
  return [
    {
      id: "hp1",
      title: "Harry Potter and the Philosopher's Stone",
      summary:
        "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry. An incredible adventure is about to begin!",
      author: "J. K. Rowling",
      release_date: "26 June 1997",
      dedication:
        "For Jessica, who loves stories, for Anne, who loved them too, and for Di, who heard this one first",
      pages: "223",
      cover:
        "https://www.wizardingworld.com/images/products/books/UK/rectangle-1.jpg",
      wiki: "https://harrypotter.fandom.com/wiki/Harry_Potter_and_the_Philosopher's_Stone",
      chapters: [
        {
          title: "The Boy Who Lived",
          summary:
            "In the first chapter, we are introduced the Dursley family: Mr. and Mrs. Dursley and his son Dudley. They live on Privet Drive number four and are proud of being completely normal. One day, Mr. Dursley notices many strange things: people wearing odd-looking colorful robes and talking about 'You-Know-Who', a peculiar cat, as well as strangers who hug him and tell him to celebrate. That night, Professor Dumbledore, Professor McGonagall and Rubeus Hagrid meet in Privet Drive. They discuss the tragic deaths of James and Lily Potter and the survival of their son Harry. The chapter ends with them leaving the baby on the Dursleys' doorstep with a letter explaining the circumstances.",
        },
        {
          title: "The Vanishing Glass",
          summary:
            "Many years later, Harry Potter is already 10 years old and still living with the Dursley family. They give a roof over his head, but overall they treat him more like a help than a family member. On the day of Dudley's birthday, the Dursleys want to visit the zoo and due to an unfortunate coincidence, they have to bring along Harry. The boy gets drawn into a conversation with a boa constrictor. When Dudley starts teasing Harry, the glass in front of the boa disappears. The snake escapes its terrarium, thanking Harry for the help, and spreads panic across visitors, Dursleys included.",
        },
        {
          title: "The Letter from No One",
          summary:
            "It's the summer holiday before Harry and Dudley go to different schools - Harry's local school and Dudley's expensive private school. One morning during breakfast, the mail arrives at Dursley's home. Unexpectedly, there is a first-ever, strange looking letter to Harry. However the Dursleys don't allow Harry to read his letter and the next day more letters get into the house by all means, no matter how hard Dursleys try to get rid of them. Uncle Vernon decides to run away from the problem and takes the whole family to a hotel, but the letters are still following them. Finally, they end up in an old cabin on an island which can only be accessed by a boat, hoping to no longer get any letters. In the night, while Harry is counting the seconds till his 11th birthday, suddenly someone is hammering on the cabin's door.",
        },
        {
          title: "The Keeper of the Keys",
          summary:
            "The person hammering on the door enters the cabin and introduces himself as Hagrid, the Keeper of the Keys in Hogwarts School of Witchcraft and Wizardry. He is a half-giant and a friend of Harry's parents, Lily and James. Hagrid informs Harry about his magical heritage, reveals his true identity as a wizard, and explains that he is to attend Hogwarts. Hagrid's arrival marks the beginning of Harry's journey into the wizarding world, his introduction to the magical community and his newfound destiny.",
        },
        {
          title: "Diagon Alley",
          summary:
            "Hagrid takes Harry to the Leaky Cauldron, a wizarding inn, and then through a secret entrance in Leaky Cauldron's back wall to Diagon Alley. There Harry experiences a whole new world, visiting Gringotts to access his family vault, purchasing his school supplies and receiving his very own wand from Ollivanders. Additionally, Harry acquires Hedwig, a beautiful snowy owl, as a gift from Hagrid. It's a captivating introduction to the magical realm he's destined to be a part of.",
        },
        {
          title: "The Journey from Platform Nine and Three-Quarters",
          summary:
            "Harry is at King's Cross Station with the Dursleys, preparing to catch the train to Hogwarts. However, as he and the Dursleys are unable to find Platform Nine and Three-Quarters, where the train should leave, he get abandon from the Dursleys. Fortunately, Harry overhears a woman talking about Muggles and asks her for help in finding the hidden platform. Mrs. Weasley tells him to run into the barrier between platform nine and ten, and he miraculously passes through it, finally finding the train to Hogwarts. This unexpected encounter with Mrs. Weasley and her family marks the beginning of Harry's magical journey. He spends the trip to Hogwarts with the youngest Weasley, Ron. Additionally, Harry meets Draco Malfoy, a fellow student on the Hogwarts Express, who leaves a distinct impression with his aloof and arrogant demeanor.",
        },
        {
          title: "The Sorting Hat",
          summary:
            "Harry arrives at Hogwarts School of Witchcraft and Wizardry and is sorted into his house during the Sorting Hat ceremony. The hat briefly considers placing him in Slytherin, but ultimately chooses Gryffindor after Harry expresses a strong desire not to be in Slytherin. Throughout the ceremony, Harry becomes friends with Ron Weasley, who is also sorted into Gryffindor. Together they have their first encounters with several of the Hogwarts teachers, including Professor Dumbledore, Professor Snape, Professor McGonagall, and the quirky Professor Quirrell",
        },
        {
          title: "The Potions Master",
          summary:
            "Harry attends his first Potions class at Hogwarts, taught by the enigmatic Professor Severus Snape. He quickly discovers that Snape has a strong dislike for him, leading to a tense and challenging class experience. Harry also attends to other classes, such as Transfiguration taught by Professor McGonagall and Charms with Professor Flitwick.",
        },
        {
          title: "The Midnight Duel",
          summary:
            "During his first flying lessons, hold by Madam Hooch, Harry's remarkable talent on a broomstick is noticed by Professor McGonagall, who recommends him for the Gryffindor Quidditch team. The tension between him and Draco Malfoy, who is clearly jealous of Harry's recognition, steadily escalates. Harry, Ron, and Hermione sneak out of their dormitories at night to challenge Malfoy to a duel. Harry and his friends do not encounter Malfoy, but instead, they stumble upon a massive three-headed dog guarding a mysterious trapdoor.",
        },
        {
          title: "Hallowe'en",
          summary:
            "Hermione Granger impresses her peers with her mastery of making a feather float with the Levitation Charm, 'Wingardium Leviosa'. However, her approach leads to a conflict with Ron, who finds her bossy. Later, during the Halloween feast, a troll is accidentally let into the castle. The troll makes its way into the girls' bathroom, where it threatens Hermione, who is alone and unaware of the danger. Harry and Ron, wondering where Hermione is, come to her rescue, successfully defeating the troll and solidifying their friendship.",
        },
        {
          title: "Quidditch",
          summary:
            "Harry joins the Gryffindor Quidditch team as the youngest Seeker in a century. During his first Quidditch match against Slytherin, Harry experiences a series of ups and downs, including Professor Snape's alleged attempt to jinx his broomstick, making it go haywire. Harry's determination prevails and he manages to catch the Golden Snitch, securing the victory for Gryffindor. After the match, Harry, Ron, and Hermione pay a visit to Hagrid to discuss Snape's role in the broomstick incident. Hagrid accidentally reveals information that it is his three-headed dog and it actually protects a big secret.",
        },
        {
          title: "The Mirror of Erised",
          summary:
            "Harry discovers a mysterious mirror in an abandoned classroom at Hogwarts. When he looks into the mirror, he sees himself with his deceased parents, James and Lily Potter, who he never had a chance to know. Harry quickly becomes obsessed with returning to the mirror, leading to many late-night visits to the mirror room. Professor Dumbledore eventually intervenes, explaining the mirror's powers of showing the deeperst desires of a person's heart, and the danger of becoming lost in its illusions. He mentions that he now will move the mirror to another place.",
        },
        {
          title: "Nicolas Flamel",
          summary:
            "Harry and his friends learn about Nicolas Flamel, a renowned alchemist who is believed to have created the Philosopher's Stone, an object with incredible powers. They discover that Flamel's work with the stone has contributed to his extraordinary longevity, and it's also rumored to produce the Elixir of Life, a potion that grants immortality. Harry accidentally overhears a mysterious conversation between Professor Snape and Professor Quirrell. Snape expresses his distrust of Quirrell's loyalty and his urgent need to know how to access the Philosopher's Stone, which is stored at Hogwarts.",
        },
        {
          title: "Norbert the Norwegian Ridgeback",
          summary:
            "During a visit at Hagrid's hut, he reveals that he won a dragon egg in a card game. He becomes obsessed with hatching it - even though it's illegal - and invites Harry, Ron and Hermione to witness it. Unfortunately, they are being followed by Malfoy. To protect both Hagrid and dragon, Harry has an idea to smuggle the dragon, named Norbert, out of the castle to Charlie Weasley, who works with dragons in Romania. As Ron gets bitten by Norbert, Harry and Hermione  have to set out on the expedition on their own. The late-night excursion to the tower where Norbert is kept leads to a dangerous encounter with Draco Malfoy. They successfully pass Norbert to Charlie's friends, but they get caught by Mr Filch.",
        },
        {
          title: "The Forbidden Forest",
          summary:
            "Harry and Hermione serve detention in the Forbidden Forest as punishment for being out of their common room after hours. They are accompanied by Hagrid and encounter dangerous creatures, including a wounded unicorn and a mysterious centaur named Firenze. During their time in the forest, they witness a hooded figure drinking the blood of the unicorn. Firenze explains that drinking unicorn blood allows a person to prolong their life, but at a terrible cost - the drinker becomes cursed. Harry begins to suspect that Snape wants to obtain the Philosopher's Stone to help Voldemort regain his strength.",
        },
        {
          title: "Through the Trapdoor",
          summary:
            "Harry, Ron, and Hermione, armed with the knowledge of Fluffy guarding the trapdoor, embark on a perilous journey to reach the Philosopher's Stone before it falls into the wrong hands. These include Devil's Snare, a plant that tries to strangle them, a life-sized wizard's chess match, a game of flying keys, and potions that must be consumed in the correct order to proceed. In the last puzzle it turns out that only Harry can proceed further, and Hermione decides to turn back to Ron, who got knocked out earlier in game of chess. Harry encounters an unexpected figure waiting for him.",
        },
        {
          title: "The Man with Two Faces",
          summary:
            "Harry confronts Professor Quirrell, who is attempting to steal the Stone. Harry faces Voldemort, who is attached to the back of Quirrell's head. Voldemort demands that Harry give him the Philosopher's Stone, but Harry's courage and selflessness protect the Stone from falling into Voldemort's grasp. The Philosopher's Stone is destroyed to prevent it from falling into the wrong hands. Dumbledore explains to Harry that his mother's love and the protection it provided played a crucial role in safeguarding the Stone.",
        },
      ],
    },
    {
      id: "hp2",
      title: "Harry Potter and the Chamber of Secrets",
      summary:
        "Harry Potter's summer has included the worst birthday ever, doomy warnings from a house-elf called Dobby, and rescue from the Dursleys by his friend Ron Weasley in a magical flying car! Back at Hogwarts School of Witchcraft And Wizardry for his second year, Harry hears strange whispers echo through empty corridors – and then the attacks start. Students are found as though turned to stone... Dobby's sinister predictions seem to be coming true.",
      author: "J. K. Rowling",
      release_date: "2 July 1998",
      dedication:
        "For Séan P. F. Harris, getaway driver and foul-weather friend",
      pages: "251",
      cover:
        "https://www.wizardingworld.com/images/products/books/UK/rectangle-2.jpg",
      wiki: "https://harrypotter.fandom.com/wiki/Harry_Potter_and_the_Chamber_of_Secrets",
      chapters: [
        {
          title: "The Worst Birthday",
          summary: "",
        },
        {
          title: "Dobby's Warning",
          summary: "",
        },
        {
          title: "The Burrow",
          summary: "",
        },
        {
          title: "At Flourish and Blotts",
          summary: "",
        },
        {
          title: "The Whomping Willow",
          summary: "",
        },
        {
          title: "Gilderoy Lockhart",
          summary: "",
        },
        {
          title: "Mudbloods And Murmurs",
          summary: "",
        },
        {
          title: "The Deathday Party",
          summary: "",
        },
        {
          title: "The Writing on the Wall",
          summary: "",
        },
        {
          title: "The Rogue Bludger",
          order: "10",
        },
        {
          title: "The Duelling Club",
          order: "11",
        },
        {
          title: "The Polyjuice Potion",
          order: "12",
        },
        {
          title: "The Very Secret Diary",
          order: "13",
        },
        {
          title: "Cornelius Fudge",
          order: "14",
        },
        {
          title: "Aragog",
          order: "15",
        },
        {
          title: "The Chamber of Secrets",
          order: "16",
        },
        {
          title: "The Heir of Slytherin",
          order: "17",
        },
        {
          title: "Dobby's Reward",
          order: 18,
        },
      ],
    },
  ];
});
