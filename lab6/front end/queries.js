const GetPokemon = gql`
query {
  getPokemon($id: Int) {
    id
    name
    type
    img
  }
}
`;
