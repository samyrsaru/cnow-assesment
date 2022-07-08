import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-games',
  templateUrl: './video-games.component.html',
  styleUrls: ['./video-games.component.css']
})
export class VideoGamesComponent implements OnInit {
  games: any[] = [];
  gamesFiltered: any[] = [];
  filterByName: string = "";
  minScore: number = 0;
  orderAscendent: boolean = true;
  filterBy: string = "date";

  constructor() { }

  ngOnInit(): void {
    this.getGames();    
  }

  async getGames(): Promise<void> {
    // this.getMock();
    await this.fetchFromDB();
  }

  getMock() {
    this.games = [
      {
        "id": 109596,
        "first_release_date": 1540944000000,
        "name": "SEGA AGES Phantasy Star",
        "rating": 90.0,
        "summary": "The classic galactical adventure arrives on Nintendo Switch! \n \nThe tyrant Lassic rules the cosmos, and it is up to you to defeat his evil reign. Witness the revival of this defining RPG in SEGA AGES Phantasy Star. \n \nTake advantage of the new dungeon map display and the acclaimed “Ages Mode” as you traverse tricky dungeon mazes and battle ferocious 8-bit beasts. Phantasy Star has claimed its place as a pioneer RPG and its retro-spirit is sure to find a home in the hearts of old and new fans alike."
      },
      {
        "id": 68161,
        "first_release_date": 1519171200000,
        "name": "Layers of Fear: Legacy",
        "rating": 90.0,
        "summary": "The Masterpiece of Fear"
      },
      {
        "id": 104790,
        "first_release_date": 1538092800000,
        "name": "Namco Museum Arcade Pac",
        "rating": 77.0,
        "summary": "All the best Namco arcade games in the palm of your hand. \n \nSave your quarters and bring the arcade home with the ultimate two-in-one game ‘pac,’ Namco Museum Arcade Pac! Enjoy the nostalgic classics in Namco Museum and the flashy maze madness of Pac-Man Championship Edition 2 Plus with friends or solo, at home or on the go, for exciting arcade fun wherever you are—exclusively for the Nintendo Switch."
      }
    ];
    this.games = this.games.map((game: any) => {
      return {
        ...game,
        first_release_date: new Date(game.first_release_date),
        formated_date: new Date(game.first_release_date).toLocaleDateString("en-GB")
      };
    });
    this.gamesFiltered = this.games;
    this.filterByChanged();
  }

  async fetchFromDB(): Promise<void> {
    return fetch("https://public.connectnow.org.uk/applicant-test/")
      .then(response => response.json())
      .then(games => games.map((game: any) => {
        return {
          ...game,
          first_release_date: new Date(game.first_release_date),
          formated_date: new Date(game.first_release_date).toLocaleDateString("en-GB")
        };
      }))
      .then(data => {
        this.gamesFiltered = this.games = data;
        this.filterByChanged();
      })
      .catch(e => console.error(e));
  }

  onFilterByNameChanged(): void {
    if (!this.filterByName) {
      this.gamesFiltered = this.games;
      return;
    }
    const filter = this.filterByName.toLowerCase();
    this.gamesFiltered = this.games.filter(game => game.name.toLowerCase().includes(filter));
  }

  onFilterByScoreChanged(event: Event): void {
    const minScore = (event.target as HTMLInputElement).valueAsNumber;
    this.minScore = Number.isInteger(minScore) ? minScore : 0;

    if (!this.minScore) {
      this.gamesFiltered = this.games;
      return;
    }
    this.gamesFiltered = this.games.filter(game => game.rating >= this.minScore * 10);
  }

  onOrderByDate(): void {
    this.gamesFiltered = this.gamesFiltered.sort((game1, game2) => {
        return this.orderAscendent ?
          game1.first_release_date - game2.first_release_date :
          game2.first_release_date - game1.first_release_date;
    });
  }

  onOrderByName(): void {
    this.gamesFiltered = this.gamesFiltered.sort((game1, game2) => {
      return this.orderAscendent ?
        game1.name.localeCompare(game2.name) :
        game2.name.localeCompare(game1.name)
    });
  }

  onOrderByScore(): void {
    this.gamesFiltered = this.gamesFiltered.sort((game1, game2) => {
      return this.orderAscendent ?
        game1.rating - game2.rating :
        game2.rating - game1.rating;
    });
  }

  toggleOrder(): void {
    this.orderAscendent = !this.orderAscendent;
    this.filterByChanged();
  }

  filterByChanged(): void {
    if (this.filterBy === "date") {
      this.onOrderByDate();
    }
    else if (this.filterBy === "name") {
      this.onOrderByName();
    }
    else if (this.filterBy === "score") {
      this.onOrderByScore();
    }
  }

  onClear(): void {
    this.minScore = 0;
    this.filterByName = "";
    this.orderAscendent = true;
    this.filterBy = "date";
    this.gamesFiltered = this.games;
    this.filterByChanged();
  }
}
