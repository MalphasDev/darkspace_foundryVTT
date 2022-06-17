# darkspace_foundryVTT
[GER] Dark Space TTRPG für Foundry VTT

Umsetzung meines TTRPG-Systems als System für Foundry VTT 9.x
Aktueller Release unterstützt Foundry VTT 8.9

## Bekannte Probleme / Known issues:
- Das Neu-Laden von Foundry nachdem ein Kampf begonnen hat, aber bevor jeder Kampfteilnehmer/Combatant mindestens einmal an der Reihe war, führt zu Fehlerhaften Initiativ-Werten beim entsprechenden Client. 
WORKAROUND: Der GM sagt Initiativen an, bis alle fehlerhaften Initiativ-Einträge einmal überschrieben wurden.

- Beim starten eines Kampfes, bevor alle Teilnehmer eine Inititaive haben, wird keine Sortierung vorgenommen. Die Teilnehmer werden gemäß ihrer aktuellen Positionen in die Initiative eingetragen.
WORKAROUND: Erst den Kampf starten, wenn alle Teilnehmer eine Initiative haben.
