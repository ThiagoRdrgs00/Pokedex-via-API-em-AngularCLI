import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface PokeInterface{
  created: string,
  modified: string,
  name: string,
  pokemon: any[],
  types: any[],
  url: string
  results: any[],
  height: BigInt,
  sprites: any,
  front_default: string,
  home: any,
  stats: any[],
  id: BigInt;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonapiService {
  private pokeURL = 'https://pokeapi.co/api/v2/pokemon';
  PokemonList = [];
  PokemonTypes = [];
  types = "";
  foto = "";
  hp = "";
  ataque = "";
  spattack = "";
  defesa = "";
  spdefesa = "";
  velocidade = "";
  
  constructor(
    private http: HttpClient
  ) { }

  listarTodos() {
    const params = new HttpParams().set('limit', 1100);
    this.http.get<PokeInterface>(this.pokeURL, {params})
      .subscribe(response => {
        response.results.forEach(results =>{
          results.number = this.getID(results.url);
        })
        this.PokemonList = response.results.filter(results => results.number < 10000);
      });
  }

  private getID(url){
    return parseInt(url.replace(/.*\/(\d+)\/$/, '$1'));
  }

  obterDadosPokemon(pokemonSelecionado, opcaoFoto) {
    this.types = "";
    let pokeURLDados = 'https://pokeapi.co/api/v2/pokemon/' + pokemonSelecionado;
    const params = new HttpParams().set('limit', 1);
    this.http.get<PokeInterface>(pokeURLDados, {params})
      .subscribe(response => { 
        response.types.forEach(response =>{
          if (this.types == "") {
            this.types = response.type.name;
          } else {
            this.types = this.types + " - " + response.type.name;
          }
        });
        if (opcaoFoto == 0) {
          this.foto = response.sprites.other.home.front_default;
        } else {
          this.foto = response.sprites.other.home.front_shiny;
        }
        response.stats.forEach(response =>{
          if (response.stat.name == "hp") {
            this.hp = "HP: " + response.base_stat;
          }
          if (response.stat.name == "attack") {
            this.ataque = "Ataque: " + response.base_stat;
          }
          if (response.stat.name == "defense") {
            this.defesa = "Defesa: " + response.base_stat;
          }
          if (response.stat.name == "special-attack") {
            this.spattack = "Ataque Esp.: " + response.base_stat;
          }
          if (response.stat.name == "special-defense") {
            this.spdefesa = "Defesa Esp.: " + response.base_stat;
          }
          if (response.stat.name == "speed") {
            this.velocidade = "Velocidade: " + response.base_stat;
          }
        })
        
      });
  }
}