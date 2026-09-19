# FlatCraft

## Basic Info

FlatCraft is an open source, MIT licensed 2d Minecraft inspired game. It uses LittleJS for the rendering, and vanilla HTML/CSS/JavaScript for the UI. All the rest was written by me.

## Challenges:

One of the biggest challenge was world generation. The idea was to use simplex noise to make terrain, but there was one problem: It's uncontrolability. I wanted real biomes, but that coudn't happen because I didn't know how to control simplex noise. Nor did I know how to make mountains. I solved it by realizing that this is just a silly 2d Minecraft game for a program designed to get teens to make something, not for teens to make some complex minecraft like game, so I decided to bite the bullet and to just make an array for each biome, and have that array contain the y level of the highest block, and use that array to make the terrain. It's basically like [1,1,2,2,3,3]. Nothing complicated, and if you played this game long enough you'll see that each biomes are litterally the same.

## Most Proud of:

I'm actually most proud of the custom skins part of flatcraft. It's really not that complex, but it took a mesruable amount of time to get it working. I had to learn node.js, finally had a use for a server! and used my old chromebook as my server. I made the precaution of adding a ratelimiter just in case someone tried to take it down or whatever, but yeah. That's what I'm most proud of.

## What I learned:

- Making classes in js
- NodeJS
- LittleJS engine

## Stuff that didnt make it into the game:
Game music
Mobs


# Credits

## Art:

Me, My little brother
Inspired by https://www.planetminecraft.com/texture-pack/digs-simple-pack-1-15-100-complete/, and https://bloxd.io

## Programming:

Me

## Libraries used:

- LittleJS
