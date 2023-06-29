# Quran Scraper

This project aims to help you scrape the Quran in Eng and Arabic text in json format. 

**In the Name of Allah, the All-beneficent, the All-merciful.**


## Requirements

1. Node.js installed


### Setup

install dependancies:

`npm i`

### Scrape Process.

1. First scrape for the Sura's (Chapters - 114 in total) by runing the command bellow:

`node ./scrape_chapters.js`

This will create a json file in the `./data/scraped_chapters` folder.

Sample Output:

```
[
    {
        "url": "https://www.al-islam.org/quran/surah/1/al-faatiha",
        "name": "Al-Faatiha",
        "title": "THE OPENING",
        "chapter": 1,
        "verses": "7 Verses"
    },
]
```


2. Scrape the verses.

To scrape for the verses you will run the command bellow:

`node index.js`

WHich will save all the verses in a folder with the name of the chapter in the chapters folder  e.g `./data/chapters/1_Al-Faatiha.json`

This is a sample output

```
  {
    "url": "https://www.al-islam.org/quran/surah/1/al-faatiha/ayat/1",
    "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "chapter": 1,
    "verse": 1,
    "eng": "In the name of Allah, the Beneficent, the Merciful."
  },
```

Creadits to: [AL-ISLAM.org](https://www.al-islam.org/)
