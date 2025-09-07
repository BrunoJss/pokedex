const pokemonOl = document.getElementById('pokemonList')
const loadMoreBtn = document.getElementById('loadMore')
const pokemonList = document.getElementById('pokemonList')
const closeBtn = document.getElementById('closeBtn');
const content = document.getElementById('content')
const details = document.getElementById('details')
const typesDetail = document.getElementById('typesDetail')
const maxRecord = 15;
const limit = 5;
let offset = 0;
const imageBackgroundDetail = document.getElementById("imageBackgroundDetail")

closeBtn.addEventListener('click', () => {
    typesDetail.innerHTML = ''
    imageBackgroundDetail.className = "imageBackgroundDetail"
    content.style.display = "block"
    details.style.display = "none"
})

function loadPokemonsItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemonList = []) => {
        pokemonOl.innerHTML += pokemonList.map((pokemon) => `
        <li class="pokemonCard">
            <button type="button" data-id="${pokemon.id}" class="btnPokemon pokemon ${pokemon.type}">
                <div class="pokemonCardHeader">
                    <span class="name">${pokemon.name}</span>
                    <span class="number">#${pokemon.id}</span>
                </div>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
                </div>
            </button>
        </li>
        `).join("")
    }).catch((error) => console.log(error))
}

function atualizarBarra(statId, valor, type) {
    const max = 255;
    const numero = document.getElementById(statId);
    const barraBase = numero.nextElementSibling; 
    const barra = barraBase.querySelector(".attributeBar");
    barra.classList.remove(
        "fire", "water", "grass", "electric", "psychic", 
        "ice", "dragon", "dark", "fairy", "normal",
        "fighting", "flying", "poison", "ground", 
        "rock", "bug", "ghost", "steel"
    );
    barra.classList.add(type);

    const porcentagem = (valor / max) * 100;

    // Atualiza número e largura da barra
    numero.textContent = valor;
    barra.style.width = `${porcentagem}%`;
}

loadPokemonsItens(offset, limit)

loadMoreBtn.addEventListener('click', () => {
    offset += limit

    const qtRecordsNextPage = offset + limit;

    if (qtRecordsNextPage >= maxRecord) {
        const newLimit = maxRecord - offset
        loadPokemonsItens(offset, newLimit)
        loadMoreBtn.parentElement.removeChild(loadMoreBtn)

    } else {
        loadPokemonsItens(offset, limit)
    }
})

pokemonList.addEventListener('click', async (e) => {
    const btn = e.target.closest('button.btnPokemon');
    if (!btn) return;


    const id = btn.dataset.id;
    const res = await pokeApi.getOnePokemonDetails(id)
        typesDetail.innerHTML = ''

    document.getElementById('idDetail').textContent = res.id
    document.getElementById('nameDetail').textContent = res.name
    document.getElementById("imageDetail").src = res.photo
    
    imageBackgroundDetail.classList.add(res.type)
    
    const ol = `${ res.types.map((type) => `<span class="typeDetail capitalize ${type}">${type}</span>`).join('')}`
    
    typesDetail.innerHTML += ol;

    // document.getElementById("hp").textContent = res.attributes[0].value

    atualizarBarra("hp", res.attributes[0].value, res.type)
    atualizarBarra("atk", res.attributes[1].value, res.type)
    atualizarBarra("def", res.attributes[2].value, res.type)
    atualizarBarra("satk", res.attributes[3].value, res.type)
    atualizarBarra("sdef", res.attributes[4].value, res.type)
    atualizarBarra("spd", res.attributes[5].value, res.type)

    console.log(res)
    content.style.display = "none"
    details.style.display = "flex"
    console.log('Pokemon ID:', id);

})
