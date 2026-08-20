---
# The theme's index page sets ogTitle/ogDescription from this front-matter without
# falling back to app.config's site.description, so omitting `description` here
# publishes an empty og:description. `title` doubles as the og:title, which is why
# it reads as a headline rather than "Home".
title: A free API for the Wizarding World
description: The Hogwarts API is a magical API containing data from the wizarding world of Harry Potter, Hogwarts Legacy and the Fantastic Beasts universe.
navigation: false
---

::hero
---
announcement:
  title: '6,084 records across 6 collections'
  icon: '✨'
  to: /getting-started/introduction
actions:
  - name: Get Started
    to: /getting-started/introduction
  - name: Browse the API
    variant: outline
    to: /endpoints/books
  - name: GitHub
    variant: ghost
    to: https://github.com/ivopauly/hogwarts-api
    leftIcon: 'lucide:github'
---

#title
A free API for the :br Wizarding World.

#description
Books, films, characters, spells, potions and creatures from Harry Potter, :br Fantastic Beasts and Hogwarts Legacy. No key, no signup, no rate limit.
::

::card-group
  ::card
  ---
  title: Books
  icon: lucide:book
  to: /endpoints/books
  ---
  All 7 novels, with chapter listings.
  ::
  ::card
  ---
  title: Movies
  icon: lucide:clapperboard
  to: /endpoints/movies
  ---
  11 films across both series, with cast and crew credits.
  ::
  ::card
  ---
  title: Characters
  icon: lucide:users
  to: /endpoints/characters
  ---
  5,410 witches, wizards, ghosts and goblins.
  ::
  ::card
  ---
  title: Spells
  icon: lucide:wand-sparkles
  to: /endpoints/spells
  ---
  345 charms, curses, hexes and jinxes.
  ::
  ::card
  ---
  title: Potions
  icon: lucide:flask-conical
  to: /endpoints/potions
  ---
  168 brews, with ingredients and effects.
  ::
  ::card
  ---
  title: Creatures
  icon: lucide:paw-print
  to: /endpoints/creatures
  ---
  143 beasts and beings, with Ministry classifications.
  ::
::
