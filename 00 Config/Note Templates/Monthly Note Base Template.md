``` base
  and:
    - file.inFolder(this.file.folder)
    - file.path != this.file.path
formulas:
  Weekday: file.ctime.format("dddd")
properties:
  file.name:
    displayName: Date
views:
  - type: table
    name: Table
    order:
      - formula.Weekday
      - file.name
      - exercised
      - exerciseType
      - journaled
      - mood
      - affectLevel
      - energyLevel
    sort: []
    columnSize:
      file.name: 110
      note.journaled: 142
      note.mood: 178
      note.affectLevel: 125
      note.energyLevel: 131
```