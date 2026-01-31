---
noteBook: "[[Note Templates]]"
noteType: "[[Gallery Template|Gallery]]"
branchTemplate:
leafTemplate:
aliases:
  - Gallery
dated: false
folderNote: true
---
```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.ext.containsAny("jpg", "jpeg", "png","avif","webp")
views:
  - type: cards
    name: Gallery
    sort:
      - property: file.ctime
        direction: ASC
    image: file.path
    imageAspectRatio: 1.7

```
