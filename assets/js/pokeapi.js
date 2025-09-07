const pokeApi = {}

function convertFromApiToClass(pokemonFromApi) {
    const pokemon = new Pokemon();
    pokemon.id = pokemonFromApi.id;
    pokemon.name = pokemonFromApi.name;

    const types = pokemonFromApi.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types

    pokemon.type = type
    pokemon.types = types

    pokemon.photo = pokemonFromApi.sprites.other.dream_world.front_default

    return pokemon

}

function convertOnePokemonToClass(pokemonFromApi) {
    const pokemone = new PokemonDetailed();
    pokemone.id = String(pokemonFromApi.id).padStart(3, '0');
    pokemone.name = pokemonFromApi.name;
    pokemone.photo = pokemonFromApi.sprites.other.dream_world.front_default;

    const types = pokemonFromApi.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types

    pokemone.type = type
    pokemone.types = types

    pokemone.attributes = pokemonFromApi.stats.map((s) => ({
        name:s.stat.name,
        value:s.base_stat
    }))
    return pokemone

}

pokeApi.getPokemonsDetails = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertFromApiToClass)
}

pokeApi.getOnePokemonDetails = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    return fetch(url)
        .then((res) => res.json())
        .then(convertOnePokemonToClass)
}


pokeApi.getPokemons = (offset = 0, limit = 20) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then((response) => response.json())
        .then((responseBody) => responseBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonsDetails))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) =>pokemonsDetails)
        .catch((error) => console.log(error))
}