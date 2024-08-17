---
noteType:
  - "[[Daily Note Template]]"
  - "[[Note Templates|Template]]"
created: "{{date:YYYY-MM-DDTHH:mm:ssZ}}"
wakeup: 
pill_1: 
breakfast_time: 
breakfast: 
lunch_time: 
lunch: 
pill_2: 
bed: 
mood: 
energy_level: 
affect_level: 
mood_why: 
aliases:
  - daily note
templateType:
  - Periodic
---
# Notes

## Log

## Daily Check In
### Bio Stats
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/selectHour", {"targetField": "wakeup"})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/currentTime", {"targetField": "pill_1", "fieldName": "Pill 1"})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/currentTime", {"targetField": "breakfast_time", "fieldName": "Breakfast"})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/selectText", {"targetField": "breakfast"})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/currentTime", {"targetField": "pill_2", "fieldName": "Pill 2"})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/currentTime", {"targetField": "lunch_time", "fieldName": "Lunch"})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/selectText", {"targetField": "lunch"})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/selectHour", {"targetField": "bed"})
```
### How I'm feeling Now
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/moodMeter")
```
### A few words about it
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/selectText", {"targetField": "mood_why"})
```