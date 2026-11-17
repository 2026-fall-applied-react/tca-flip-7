thinking of revamping the play screen, right now just buttons for winner

how about sections, or cards, something consistent with what we're using say
on the home screen, for each player

and, how about small triangles for moving players up and down on the list, in front of name, maybe

i imagine ima going to add a lot of functionality on this page, so, i would like to consider
using usereducer over a bunch of usestate hooks, if that makes sense

gameresults has type definitions for flip 7 cards, and deck composition

and i added how i think i could store each players card draw to a gameresult

each player section is maybe collapsible, maybe a plus minus in the upper right of
section

also show each players drawn cards in order drawn even if collapses, its important
for other players to see all the time, to decide which player to say freeze or draw 3

when expanded, allow data entry for the card that was drawn, also if the card drawn
is a duplicate number, the player busts for the turn, and can't draw any more, and
loses any points, there are a lot of card choices, so not sure how to present, grid of buttons
or dropdown menu, say draw, then cascade into draw choices

oh, and killer feature, when expanded, prominently show percent chance to bust, so
user can see, then decide to draw or not

ah, need pass button, or maybe not, probably, so when passing phone around table
to log draws, we know to skipp players who have passed, so show somethin when collapsed even

oh, somewhere, possibly in front of cards drawn, should show the total, this is
the number of points player currently has, and is risking when they draw

on second thought, percent chance to bust probably when collapsed, want to see for
all players, may influence who to give a draw 3 card to, so they bust

